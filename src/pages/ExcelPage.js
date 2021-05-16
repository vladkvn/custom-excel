import {Page} from '../core/router/Page';
import {Excel} from '../components/excel/Excel';
import {rootReducer} from '../core/redux/rootReducer';
import {Store} from '../core/redux/Store';
import {debounce, storage} from '../core/utils';
import {Header} from '../components/header/Header';
import {Toolbar} from '../components/toolbar/Toolbar';
import {Formula} from '../components/formula/Formula';
import {Table} from '../components/table/Table';

export class ExcelPage extends Page {
    constructor() {
        super({
            name: 'table'
        });
        this.excel;
    }

    afterRender() {
        this.excel.init();
    }

    destroy() {
        this.excel.destroy();
    }

    getRoot() {
        const storageKey = 'excel-state';
        const DEBOUNCE_PERIOD_MS = 300;
        const store = new Store(rootReducer, storage(storageKey));
        const stateListener = debounce(function(state) {
            console.log('App state', state);
            storage(storageKey, state);
        }, DEBOUNCE_PERIOD_MS);
        store.subscribe(stateListener);
        this.excel = new Excel({
            components: [Header, Toolbar, Formula, Table],
            store
        });
        return this.excel.getRoot();
    }
}
