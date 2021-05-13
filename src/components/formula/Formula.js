import {ExcelComponent} from '../../core/ExcelComponent';
import {EVENT_TYPES} from '../../core/events/EventTypes';
import {InputDataEvent} from '../../core/events/InputDataEvent';
import {$} from '../../core/dom';

export class Formula extends ExcelComponent {
  static className = 'excel__formula'

  constructor($root, eventBus) {
      super($root, {
          name: 'Formula',
          listeners: ['input', 'keydown'],
          eventBus: eventBus
      });
      this.formulaElement;
  }

  init() {
      super.init();
      this.formulaElement= $('[data-formula]').$el;
      this.eventBus.subscribe(EVENT_TYPES.ACTIVE_CELL_MOVED, this);
      this.eventBus.subscribe(EVENT_TYPES.CELL_INPUT_UPDATED, this);
      this.eventBus.subscribe(EVENT_TYPES.CELLS_SELECTION_FINISHED, this);
  }

  toHTML() {
      return `
      <div class="formula-info">fx</div>
      <div class="input" contenteditable spellcheck="false" data-formula></div>
    `;
  }

  listen(event) {
      let newValue = '';
      switch (event.name) {
      case EVENT_TYPES.ACTIVE_CELL_MOVED:
          this.targetCell = event.data.activeCell.$el;
          newValue = this.targetCell.textContent;
          break;
      case EVENT_TYPES.CELL_INPUT_UPDATED:
          newValue = event.data.value;
          break;
      case EVENT_TYPES.CELLS_SELECTION_FINISHED:
          this.targetCell = event.data.cells[0].$el;
          newValue = this.targetCell.textContent;
          break;
      }
      this.formulaElement.textContent = newValue;
  }

  onInput(event) {
      this.eventBus.publish(EVENT_TYPES.CELL_INPUT_UPDATED, new InputDataEvent(this.targetCell), this);
      this.targetCell.textContent = event.target.textContent;
  }

  onKeydown(event) {
      if (event.key === 'Enter') {
          event.preventDefault();
          this.targetCell.focus();
      }
  }
}
