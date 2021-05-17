import {ExcelComponent} from '../../core/ExcelComponent';
import * as buttonCreator from './buttons/toolbarButtonCreators';

export class Toolbar extends ExcelComponent {
  static className = 'excel__toolbar'

  constructor($root, options) {
      super($root, {
          name: 'Toolbar',
          ...options,
          subscribe: ['cellsStyle', 'activeX', 'activeY']
      });
      this.selectedCells = [];
      this.buttons = [
          buttonCreator.createAlignLeftButton(this),
          buttonCreator.createAlignCenterButton(this),
          buttonCreator.createAlignRightButton(this),
          buttonCreator.createItalicButton(this),
          buttonCreator.createBoldButton(this),
          buttonCreator.createUnderlineButton(this),
      ];
  }

  toHTML() {
      return this.buttons.map((button)=>button.toHTML()).join('');
  }

  renderState(state) {
      this.buttons.forEach((button)=>button.renderState(state));
  }

  init() {
      super.init();
      this.buttons.forEach((button)=> button.init());
  }
}
