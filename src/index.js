import {Excel} from './components/excel/Excel';
import {Header} from './components/header/Header';
import {Toolbar} from './components/toolbar/Toolbar';
import {Formula} from './components/formula/Formula';
import {Table} from './components/table/Table';
import {Store} from './core/redux/Store';
import {rootReducer} from './core/redux/rootReducer';

const store = new Store(rootReducer, {
    tableTitle: 'tableTitle'
});

const excel = new Excel('#app', {
    components: [Header, Toolbar, Formula, Table],
    store
});

excel.render();

