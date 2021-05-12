import {ExcelComponent} from '../../core/ExcelComponent';
import {createTable} from './helper/table.template';
import {resize} from './resize/TableResizer';
import {selectCells} from './cellSelector/CellSelector';
import {targetCellDetails} from './helper/table-helper';
import {EventBus} from '../../core/EventBus';
import {SelectedCellsManager} from './cellSelector/SelectedCellsManager';
import {ActiveCellManager} from './cellSelector/ActiveCellManager';


export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root) {
      super($root, {
          name: 'Table',
          listeners: ['mousedown', 'keydown']
      });
      this.onKeydownListeners = [];
      this.eventBus = new EventBus();
      this.selectedCellsManager = new SelectedCellsManager(this.eventBus);
      this.activeCellManager = new ActiveCellManager(this);
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
          selectCells(this, targetCellInfo)
              .then((result)=>{
                  console.log('cellsSelectionFinished');
                  this.eventBus.publish('cellsSelectionFinished', result);
              });
      }
  }

  onKeydown(event) {
      this.onKeydownListeners.forEach((listener) => listener.onKeydown(event));
  }
}
