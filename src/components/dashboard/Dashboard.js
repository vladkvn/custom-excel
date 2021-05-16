import {$} from '../../core/dom/Dom';
import {createRecordsTable} from './dashboard.functions';

export class Dashboard {
    constructor() {
    }

    getRoot() {
        this.$root = $.create('div', 'dashboard');
        const newId = Date.now().toString();
        this.$root.html(`
            <div class="dashboard__header">
              <h1>Excel dashboard</h1>
            </div>
            <div class="dashboard__new">
              <div class="dashboard__view">
                <a class="dashboard__create" href="#excel/${newId}">
                  Новая таблица
                </a>
              </div>
            </div>
            <div class="dashboard__table dashboard__view">
                ${createRecordsTable()}
            </div>`);
        return this.$root;
    }
}
