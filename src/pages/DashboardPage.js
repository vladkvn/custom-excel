import {Page} from '../core/router/Page';
import {Dashboard} from '../components/dashboard/Dashboard';

export class DashboardPage extends Page {
    constructor() {
        super();
        this.$root = {};
    }

    afterRender() {

    }

    getRoot() {
        return new Dashboard().getRoot();
    }
}
