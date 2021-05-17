import {ExcelComponent} from '../../core/ExcelComponent';
import {$} from '../../core/dom/Dom';
import {cellInput} from '../../core/redux/actionCreators';
import {findCell} from '../table/helper/tableHelper';

export class Formula extends ExcelComponent {
  static className = 'excel__formula'

  constructor($root, options) {
      super($root, {
          name: 'Formula',
          listeners: ['input', 'keydown'],
          subscribe: ['activeX', 'activeY', 'cellsData'],
          ...options
      });
      this.formulaElement;
      this.$targetCell;
  }

  init() {
      super.init();
      this.formulaElement= $('[data-formula]').$el;
      this.renderState(this.store.state);
  }

  renderState(state) {
      const activeX = state.activeX;
      const activeY = state.activeY;
      if (activeX && activeY && state.cellsData && state.cellsData) {
          this.$targetCell = findCell(activeX, activeY);
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
      if (this.$targetCell) {
          const data= {
              x: this.$targetCell.$el.dataset.cellX,
              y: this.$targetCell.$el.dataset.cellY,
              value: this.formulaElement.textContent
          };
          this.$dispatch(cellInput(data));
      } else {
          event.preventDefault();
      }
  }

  onKeydown(event) {
      if (event.key === 'Enter' && this.$targetCell) {
          event.preventDefault();
          this.$targetCell.$el.focus();
      }
  }
}
