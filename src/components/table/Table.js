import {ExcelComponent} from '../../core/ExcelComponent';
import {createTable} from './helper/tableTemplate';
import {resize} from './resize/TableResizer';
import {selectCells} from './cellSelector/CellSelector';
import {SelectedCellsManager} from './cellSelector/SelectedCellsManager';
import {ActiveCellManager} from './cellSelector/ActiveCellManager';
import {resizeColumn, resizeRow} from './resize/resizeHelper';
import {findCell, targetCellDetails} from './helper/tableHelper';
import {parse} from '../../core/utils';
import {cellInput} from '../../core/redux/actionCreators';
import {EVENT_TYPES} from '../../core/events/EventTypes';


export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root, options) {
      super($root, {
          name: 'Table',
          listeners: ['mousedown', 'input'],
          subscribe: ['cellsData', 'colState', 'rowState'],
          ...options
      });
      this.prevInputX;
      this.prevInputY;
      this.components = [
          new SelectedCellsManager(this),
          new ActiveCellManager(this)];
  }


  init() {
      super.init();
      this.components.forEach((component)=> component.init());
      this.eventBus.subscribe(EVENT_TYPES.ACTIVE_CELL_MOVED, ()=> {
          if (this.prevInputX && this.prevInputY) {
              this.renderData(this.store.state, this.prevInputX, this.prevInputY);
          }
      });
      this.renderInitialState(this.store.state);
  }

  renderState(state, updatedStateFieldKey) {
      switch (updatedStateFieldKey) {
      case 'cellsData': {
          if (!document.activeElement.dataset.cellX) {
              this.renderData(state, state.activeX, state.activeY);
          }
      }
          break;
      case 'colState':
          this.renderColumns(state);
          break;
      case 'rowState':
          this.renderRows(state);
          break;
      case 'cellsStyle':
          this.renderStyles(state);
          break;
      }
  }

  renderInitialState(state) {
      this.renderAllData(state);
      this.renderColumns(state);
      this.renderRows(state);
      this.renderStyles(state);
  }

  destroy() {
      super.destroy();
      this.components.forEach((component)=> component.destroy());
  }

  toHTML() {
      return createTable(this.store.state.colCount, this.store.state.rowCount);
  }


  onMousedown(event) {
      const resizerType = event.target.dataset.resize;
      if (resizerType) {
          resize(this, event);
          return;
      }

      const targetCellInfo = targetCellDetails(event);
      if (targetCellInfo) {
          selectCells(this, targetCellInfo);
      }
  }

  renderAllData(state) {
      if (state.cellsData) {
          Object.keys(state.cellsData).forEach((key) => {
              const cellIndexes = key.split(':');
              const $cell = findCell(cellIndexes[0], cellIndexes[1]);
              $cell.$el.textContent = parse(state.cellsData[key]);
          });
      }
  }

  renderData(state, x, y) {
      if (state.cellsData && x && y) {
          const $activeCell = findCell(x, y);
          $activeCell.$el.textContent = parse(state.cellsData[`${x}:${y}`]);
      }
  }

  renderColumns(state) {
      const colState = state.colState;
      if (colState) {
          Object.keys(colState).forEach((key)=>{
              resizeColumn(key, colState[key]);
          });
      }
  }

  renderRows(state) {
      const rowState = state.rowState;
      if (rowState) {
          Object.keys(rowState).forEach((key) => {
              resizeRow(key, rowState[key]);
          });
      }
  }

  renderStyles(state) {
      if (state.cellsStyle) {
          Object.keys(state.cellsStyle).forEach((key) => {
              const cellIndexes = key.split(':');
              const $cell = findCell(cellIndexes[0], cellIndexes[1]);
              $cell.css(state.cellsStyle[key]);
          });
      }
  }

  onInput(event) {
      this.prevInputX = event.target.dataset.cellX;
      this.prevInputY = event.target.dataset.cellY;
      const data= {
          x: event.target.dataset.cellX,
          y: event.target.dataset.cellY,
          value: event.target.textContent.trim()
      };
      this.$dispatch(cellInput(data));
  }
}
