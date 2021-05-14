import {ExcelComponent} from '../../core/ExcelComponent';
import {EVENT_TYPES} from '../../core/events/EventTypes';
import {CellStyleUpdatedEvent} from '../../core/events/CellStyleUpdatedEvent';
export const DEFAULT_ALIGN = 'left';
export const DEFAULT_FONT_SIZE = 'left';
export const DEFAULT_FONT_STYLE = 'left';
export const DEFAULT_TEXT_DECORATOR = 'none';

export class Toolbar extends ExcelComponent {
  static className = 'excel__toolbar'


  constructor($root, eventBus) {
      super($root, {
          name: 'Toolbar',
          listeners: ['click'],
          eventBus: eventBus
      });
      this.selectedCells = [];
  }

  toHTML() {
      return `
      <div class="button">
        <i class="material-icons" data-format="format_align_left">format_align_left</i>
      </div>

      <div class="button">
        <i class="material-icons" data-format="format_align_center">format_align_center</i>
      </div>

      <div class="button">
        <i class="material-icons" data-format="format_align_right">format_align_right</i>
      </div>

      <div class="button">
        <i class="material-icons" data-format="format_bold">format_bold</i>
      </div>

      <div class="button">
        <i class="material-icons" data-format="format_italic">format_italic</i>
      </div>

      <div class="button">
        <i class="material-icons" data-format="format_underlined">format_underlined</i>
      </div>
    `;
  }


  init() {
      super.init();
      this.eventBus.subscribe(EVENT_TYPES.CELLS_SELECTION_FINISHED, this);
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
      this.processFormatButtonBehaviour('font-weight', 'italic', DEFAULT_FONT_STYLE);
  }

  underlineButtonBehaviour() {
      this.processFormatButtonBehaviour('text-decoration', 'underline', DEFAULT_TEXT_DECORATOR);
  }

  cellsWithStyleValue(styleName, styleValue) {
      return this.selectedCells.filter((cell)=>{
          return cell.$el.style[styleName] === styleValue;
      });
  }

  setCellsStyleAndPublishEvent(styleName, styleValue) {
      const style = {};
      style[styleName] = styleValue;
      this.selectedCells.forEach((cell)=>{
          cell.css(style);
          this.eventBus.publish(EVENT_TYPES.CELL_STYLE_UPDATED, new CellStyleUpdatedEvent(cell));
      });
  }

  processFormatButtonBehaviour(styleName, styleValue, defaultValue) {
      const alreadyAlignedCells = this.cellsWithStyleValue(styleName, styleValue);
      if (alreadyAlignedCells.length !== this.selectedCells.length) {
          this.setCellsStyleAndPublishEvent(styleName, styleValue);
      } else {
          this.setCellsStyleAndPublishEvent(styleName, defaultValue);
      }
  }
}
