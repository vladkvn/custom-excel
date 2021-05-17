import {ExcelComponent} from '../../core/ExcelComponent';
import {titleUpdated} from '../../core/redux/actionCreators';
import {$} from '../../core/dom/Dom';
import {ActiveRoute} from '../../core/router/ActiveRoute';
import {STORAGE_PREFIX} from '../../core/utils';

export class Header extends ExcelComponent {
  static className = 'excel__header'

  constructor($root, options) {
      super($root, {
          name: 'Header',
          listeners: ['input', 'click'],
          ...options
      });
      this.deleteButton = undefined;
      this.backToAppButton = undefined;
  }

  init() {
      super.init();
      this.renderInitialState(this.store.state);
      this.deleteButton = $(`[data-action|='delete']`);
      this.backToAppButton = $(`[data-action|='exit_to_app']`);
  }

  onClick(event) {
      switch (event.target.dataset.action) {
      case 'delete':
          localStorage.removeItem(STORAGE_PREFIX + ActiveRoute.param[1]);
          ActiveRoute.navigate('');
          break;
      case 'exit_to_app':
          ActiveRoute.navigate('');
          break;
      }
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
          <i class="material-icons" data-action="delete">delete</i>
        </div>
        <div class="button">
          <i class="material-icons" data-action="exit_to_app">exit_to_app</i>
        </div>
      </div>
    `;
  }

  onInput(event) {
      this.$dispatch(titleUpdated({value: event.target.value}));
  }
}
