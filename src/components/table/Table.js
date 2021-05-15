import {ExcelComponent} from '../../core/ExcelComponent';
import {createTable} from './helper/table.template';
import {resize} from './resize/TableResizer';
import {selectCells} from './cellSelector/CellSelector';
import {targetCellDetails} from './helper/table-helper';
import {SelectedCellsManager} from './cellSelector/SelectedCellsManager';
import {ActiveCellManager} from './cellSelector/ActiveCellManager';
import {TableInputManager} from './input/TableInputManager';


export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root, options) {
      super($root, {
          name: 'Table',
          listeners: ['mousedown'],
          ...options
      });
      this.components = [
          new SelectedCellsManager(this),
          new TableInputManager(this),
          new ActiveCellManager(this)];
  }


  init() {
      super.init();
      this.components.forEach((component)=> component.init());
      this.$subscribe((state) => console.log(state));
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
}
