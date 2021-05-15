import {ExcelComponent} from '../../core/ExcelComponent';
import {$} from '../../core/dom';
import {cellInput} from '../../core/redux/action.creators';

export class Formula extends ExcelComponent {
  static className = 'excel__formula'

  constructor($root, options) {
      super($root, {
          name: 'Formula',
          listeners: ['input', 'keydown'],
          ...options
      });
      this.formulaElement;
      this.targetCell;
  }

  init() {
      super.init();
      this.formulaElement= $('[data-formula]').$el;
      this.renderState(this.store.state);
      this.$subscribe((state)=>this.renderState(state));
  }

  renderState(state) {
      // eslint-disable-next-line no-debugger
      debugger;
      const activeX = state.activeX;
      const activeY = state.activeY;
      if (activeX && activeY) {
          this.formulaElement.textContent = state.cellsData[`${activeX}:${activeY}`];
      }
  }

  toHTML() {
      return `
      <div class="formula-info">fx</div>
      <div class="input" contenteditable spellcheck="false" data-formula></div>
    `;
  }

  onInput(event) {
      if (this.targetCell) {
          this.$dispatch(cellInput(this.targetCell));
      } else {
          event.preventDefault();
      }
  }

  onKeydown(event) {
      if (event.key === 'Enter' && this.targetCell) {
          event.preventDefault();
          this.targetCell.focus();
      }
  }
}
