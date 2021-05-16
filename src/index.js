import {Excel} from './components/excel/Excel';
import {Header} from './components/header/Header';
import {Toolbar} from './components/toolbar/Toolbar';
import {Formula} from './components/formula/Formula';
import {Table} from './components/table/Table';
import {Store} from './core/redux/Store';
import {rootReducer} from './core/redux/rootReducer';
import {debounce, storage} from './core/utils';

const storageKey = 'excel-state';

const DEBOUNCE_PERIOD_MS = 300;

const store = new Store(rootReducer, storage(storageKey));
const stateListener = debounce(function(state) {
    console.log('App state', state);
    storage(storageKey, state);
}, DEBOUNCE_PERIOD_MS);

store.subscribe(stateListener);

const excel = new Excel('#app', {
    components: [Header, Toolbar, Formula, Table],
    store
});

excel.render();

