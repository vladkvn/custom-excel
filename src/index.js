import {DashboardPage} from './pages/DashboardPage';
import {ExcelPage} from './pages/ExcelPage';

const {Router} = require('./core/router/Router');
new Router('#app', {
    dashboard: DashboardPage,
    excel: ExcelPage
});

