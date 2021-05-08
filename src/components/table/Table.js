import {ExcelComponent} from '../../core/ExcelComponent';
import {createTable} from './table.template';
import {ResizeManager} from './TableResizer';

export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root) {
      super($root, {
          name: 'Table',
          listeners: ['mousedown', 'mouseup', 'mousemove']
      });
      const resizerManager = new ResizeManager(this);
      this.onMousedownListeners = [resizerManager];
      this.onMouseupListeners = [resizerManager];
      this.onMousemoveListeners = [resizerManager];
  }

  toHTML() {
      return createTable();
  }

  onMousedown(event) {
      this.onMousedownListeners.forEach((listener) => listener.onMousedown(event));
  }

  onMouseup() {
      this.onMouseupListeners.forEach((listener) => listener.onMouseup(event));
  }

  onMousemove(event) {
      this.onMousemoveListeners.forEach((listener) => listener.onMousemove(event));
  }
}
