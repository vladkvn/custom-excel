import {ExcelComponent} from '../../core/ExcelComponent';
import {createTable} from './helper/table.template';
import {resize} from './resize/TableResizer';
import {selectCells} from './cellSelector/CellSelector';
import {SelectedCellsManager} from './cellSelector/SelectedCellsManager';
import {ActiveCellManager} from './cellSelector/ActiveCellManager';
import {TableDataManager} from './data/TableDataManager';
import {resizeColumn, resizeRow} from './resize/resize.helper';
import {findCell, targetCellDetails} from './helper/table.helper';
import {parse} from '../../core/utils';


export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root, options) {
      super($root, {
          name: 'Table',
          listeners: ['mousedown'],
          subscribe: ['cellsData', 'colState', 'rowState'],
          ...options
      });
      this.tableDataManager = new TableDataManager(this);
      this.components = [
          new SelectedCellsManager(this),
          this.tableDataManager,
          new ActiveCellManager(this)];
  }


  init() {
      super.init();
      this.components.forEach((component)=> component.init());
      this.renderInitialState(this.store.state);
  }

  renderState(state, key) {
      switch (key) {
      case 'cellsData':
          this.renderData(state);
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
      return createTable();
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

  renderData(state) {
      if (state.cellsData && state.activeX && state.activeY) {
          const $activeCell = findCell(state.activeX, state.activeY);
          $activeCell.$el.textContent = parse(state.cellsData[`${state.activeX}:${state.activeY}`]);
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
}
