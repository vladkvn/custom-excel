import {ExcelComponent} from '../../core/ExcelComponent';
import {createTable} from './table.template';
import {ResizeManager} from './TableResizer';
import {SelectorManager} from './CellSelector';

export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root) {
      super($root, {
          name: 'Table',
          listeners: ['mousedown', 'mouseup', 'mousemove']
      });
      const resizerManager = new ResizeManager(this);
      const selectorManager = new SelectorManager(this);
      this.onMousedownListeners = [resizerManager];
      this.onMouseupListeners = [resizerManager];
      this.onMousemoveListeners = [resizerManager];
      console.log(selectorManager);
  }

  toHTML() {
      return createTable();
  }

  onMousedown(event) {
      this.onMousedownListeners.forEach((listener) => listener.onMousedown(event));
  }

  onMouseup() {
      this.onMouseupListeners.forEach((listener) => listener.onMouseup());
  }

  onMousemove(event) {
      this.onMousemoveListeners.forEach((listener) => listener.onMousemove(event));
  }
}
