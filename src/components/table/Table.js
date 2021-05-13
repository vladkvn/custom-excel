import {ExcelComponent} from '../../core/ExcelComponent';
import {createTable} from './helper/table.template';
import {resize} from './resize/TableResizer';
import {selectCells, SELECTOR_MODE_KEYS, SELECTOR_MODE_MOUSE} from './cellSelector/CellSelector';
import {targetCellDetails} from './helper/table-helper';
import {SelectedCellsManager} from './cellSelector/SelectedCellsManager';
import {ActiveCellManager} from './cellSelector/ActiveCellManager';
import {TableInputManager} from './input/TableInputManager';


export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root, eventBus) {
      super($root, {
          name: 'Table',
          listeners: ['mousedown', 'keydown'],
          eventBus: eventBus
      });
      this.selectedCellsManager;
      this.activeCellManager;
      this.inputManager;
      this.domListenerComponents;
  }


  init() {
      super.init();
      this.selectedCellsManager = new SelectedCellsManager(this);
      this.inputManager = new TableInputManager(this);
      this.activeCellManager = new ActiveCellManager(this);
      this.inputManager.initDomListeners();
      this.activeCellManager.initDomListeners();
      this.activeCellManager.updateActiveCell();
      this.activeCellManager.publishActiveCellUpdated(true);
  }

  destroy() {
      super.destroy();
      this.activeCellManager.removeDomListeners();
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
          selectCells(this, targetCellInfo, SELECTOR_MODE_MOUSE);
      }
  }

  onKeydown(event) {
      if (event.key === 'Shift') {
          const targetCellInfo = targetCellDetails(event);
          selectCells(this, targetCellInfo, SELECTOR_MODE_KEYS);
      }
  }
}
