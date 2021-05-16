import {Page} from '../core/router/Page';
import {$} from '../core/dom/Dom';

export class DashboardPage extends Page {
    constructor() {
        super();
        this.$root = {};
    }

    afterRender() {

    }

    getRoot() {
        this.$root = $.create('div', 'dashboard');
        this.$root.html(`
            <div class="dashboard__header">
              <h1>Excel dashboard</h1>
            </div>
            <div class="dashboard__new">
              <div class="dashboard__view">
                <a class="dashboard__create" href="#">
                  Новая таблица
                </a>
              </div>
            </div>
            <div class="dashboard__table dashboard__view">
              <div class="dashboard__list-header">
                <span>Название</span>
                <span>Дата открытия</span>
              </div>
              <ul class="dashboard__list">
                <li class="dashboard__item">
                  <a href="#">таблица номер 1</a>
                  <strong>04.05.2021</strong>
                </li>
                <li class="dashboard__item">
                  <a href="#">таблица номер 2</a>
                  <strong>04.05.2021</strong>
                </li>
              </ul>
            </div>`);
        return this.$root;
    }
}
