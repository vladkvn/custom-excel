import {ExcelComponent} from '../../core/ExcelComponent';
import {EVENT_TYPES} from '../../core/events/EventTypes';
import {styleUpdated} from '../../core/redux/actionCreators';
import {createToolbar} from './toolbar.helper';
import {$} from '../../core/dom/Dom';
import {findCell} from '../table/helper/tableHelper';
export const DEFAULT_ALIGN = '';
export const DEFAULT_FONT_SIZE = '';
export const DEFAULT_FONT_STYLE = '';
export const DEFAULT_TEXT_DECORATOR = 'none';

const START_TIME_MS = 200;

export class Toolbar extends ExcelComponent {
  static className = 'excel__toolbar'

  constructor($root, options) {
      super($root, {
          name: 'Toolbar',
          listeners: ['click'],
          ...options,
          subscribe: ['cellsStyle', 'activeX', 'activeY']
      });
      this.selectedCells = [];
  }

  toHTML() {
      return createToolbar([
          'format_align_left',
          'format_align_center',
          'format_align_right',
          'format_bold',
          'format_italic',
          'format_underlined']);
  }

  updateButton(element, styleName, styleValues) {
      const affectedCells = [];
      styleValues.map((styleValue)=> {
          this.cellsWithStyleValue(styleName, styleValue).forEach((affectedCell)=>affectedCells.push(affectedCell));
      });
      if (affectedCells.length === this.selectedCells.length) {
          element.$el.classList.add('clicked');
      } else {
          element.$el.classList.remove('clicked');
      }
  }

  renderState(state) {
      const alignLeftButton = $(`div[data-format|='format_align_left']`);
      const alignRightButton = $(`div[data-format|='format_align_right']`);
      const alignCenterButton = $(`div[data-format|='format_align_center']`);
      const formatBoldButton = $(`div[data-format|='format_bold']`);
      const textDecorationUnderlineButton = $(`div[data-format|='format_underlined']`);
      const textStyleItalicButton = $(`div[data-format|='format_italic']`);
      this.updateButton(alignLeftButton, 'text-align', ['left', '']);
      this.updateButton(alignRightButton, 'text-align', ['right']);
      this.updateButton(alignCenterButton, 'text-align', ['center']);
      this.updateButton(formatBoldButton, 'font-weight', ['bold']);
      this.updateButton(textDecorationUnderlineButton, 'text-decoration', ['underline']);
      this.updateButton(textStyleItalicButton, 'font-style', ['italic']);
  }

  init() {
      super.init();
      this.unsubscribers.push(
          this.eventBus.subscribe(EVENT_TYPES.CELLS_SELECTION_FINISHED, (event)=>this.listen(event))
      );
      this.renderInitialState(this.store.state);
  }

  renderInitialState(state) {
      if (state.activeX && state.activeY) {
          this.selectedCells = [findCell(state.activeX, state.activeY)];
      }
      setTimeout(()=>this.renderState(state), START_TIME_MS);
  }

  onClick(event) {
      switch (event.target.dataset.format) {
      case 'format_align_left':
          this.alignButtonBehaviour('left');
          break;
      case 'format_align_center':
          this.alignButtonBehaviour('center');
          break;
      case 'format_align_right':
          this.alignButtonBehaviour('right');
          break;
      case 'format_bold':
          this.textBoldButtonBehaviour();
          break;
      case 'format_italic':
          this.fontStyleItalicButtonBehaviour();
          break;
      case 'format_underlined':
          this.underlineButtonBehaviour();
          break;
      }
  }

  listen(event) {
      switch (event.name) {
      case EVENT_TYPES.CELLS_SELECTION_FINISHED:
          this.selectedCells = event.data.cells;
          break;
      }
  }

  alignButtonBehaviour(direction) {
      this.processFormatButtonBehaviour('text-align', direction, DEFAULT_ALIGN);
  }

  textBoldButtonBehaviour() {
      this.processFormatButtonBehaviour('font-weight', 'bold', DEFAULT_FONT_SIZE);
  }

  fontStyleItalicButtonBehaviour() {
      this.processFormatButtonBehaviour('font-style', 'italic', DEFAULT_FONT_STYLE);
  }

  underlineButtonBehaviour() {
      this.processFormatButtonBehaviour('text-decoration', 'underline', DEFAULT_TEXT_DECORATOR);
  }

  cellsWithStyleValue(styleName, styleValue) {
      return this.selectedCells.filter((cell)=>{
          return cell.$el.style[styleName] === styleValue;
      });
  }

  setCellsStyle(styleName, styleValue) {
      this.selectedCells.forEach((cell)=>{
          cell.css({[styleName]: styleValue});
      });
      this.$dispatch(styleUpdated({cells: this.selectedCells, styleName, styleValue}));
  }

  processFormatButtonBehaviour(styleName, styleValue, defaultValue) {
      const alreadyAlignedCells = this.cellsWithStyleValue(styleName, styleValue);
      if (alreadyAlignedCells.length !== this.selectedCells.length) {
          this.setCellsStyle(styleName, styleValue);
      } else {
          this.setCellsStyle(styleName, defaultValue);
      }
  }
}
