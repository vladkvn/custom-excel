import {ExcelComponent} from '../../core/ExcelComponent';
import {titleUpdated} from '../../core/redux/action.creators';
import {$} from '../../core/dom/Dom';

export class Header extends ExcelComponent {
  static className = 'excel__header'


  constructor($root, options) {
      super($root, {
          name: 'Header',
          listeners: ['input'],
          ...options
      });
  }

  init() {
      super.init();
      this.renderInitialState(this.store.state);
  }

  renderInitialState(state) {
      if (state.title) {
          $('.excel__header .input').$el.value = state.title;
      }
  }

  toHTML() {
      return `
      <input type="text" class="input" value="Новая таблица" />

      <div>
        <div class="button">
          <i class="material-icons">delete</i>
        </div>
        <div class="button">
          <i class="material-icons">exit_to_app</i>
        </div>
      </div>
    `;
  }

  onInput(event) {
      this.$dispatch(titleUpdated({value: event.target.value}));
  }
}
