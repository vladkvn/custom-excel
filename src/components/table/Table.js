import {ExcelComponent} from '../../core/ExcelComponent';
import {createTable} from './helper/table.template';
import {resize} from './resize/TableResizer';
import {selectCells} from './cellSelector/CellSelector';
import {targetCellDetails} from './helper/table-helper';
import {EventBus} from '../../core/events/EventBus';
import {SelectedCellsManager} from './cellSelector/SelectedCellsManager';
import {ActiveCellManager} from './cellSelector/ActiveCellManager';
import {TableInputManager} from './input/TableInputManager';


export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root) {
      super($root, {
          name: 'Table',
          listeners: ['mousedown']
      });
      this.eventBus = new EventBus();
      this.selectedCellsManager = new SelectedCellsManager(this.eventBus);
      this.activeCellManager = new ActiveCellManager(this);
      this.inputManager = new TableInputManager(this);
      this.domListenerComponents = [this.activeCellManager, this.inputManager];
  }


  init() {
      super.init();
      this.domListenerComponents.forEach((component)=>component.initDomListeners());
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
          selectCells(this, targetCellInfo);
      }
  }
}
