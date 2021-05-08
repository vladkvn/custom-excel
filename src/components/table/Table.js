import {ExcelComponent} from '../../core/ExcelComponent';
import {createTable} from './table.template';
import {TableResizer} from './TableResizer';

export class Table extends ExcelComponent {
  static className = 'excel__table'

  constructor($root) {
      super($root, {
          name: 'Table',
          listeners: ['mousedown', 'mouseup', 'mousemove']
      });
      this.resizer = undefined;
  }

  toHTML() {
      return createTable();
  }

  onMousedown(event) {
      const resizerType = event.target.dataset.resize;
      if (resizerType) {
          console.log('start resizing ' + resizerType);
          console.log(event);
          this.resizer = new TableResizer(this.$root, resizerType, event);
      }
  }

  onMouseup() {
      if (this.resizer) {
          this.resizer.resize();
          this.resizer.remove();
          this.resizer = undefined;
      }
  }

  onMousemove(event) {
      if (this.resizer) {
          this.resizer.move(event.pageX, event.pageY);
      }
  }
}
