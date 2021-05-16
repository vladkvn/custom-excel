import {$} from '../dom/Dom';
import {ActiveRoute} from './ActiveRoute';
import {DashboardPage} from '../../pages/DashboardPage';

export class Router {
    constructor(selector, routes) {
        if (!selector) {
            throw new Error('Router requires selector!');
        }
        this.$placeholder = $(selector);
        this.routes = routes;
        this.changePageHandle = this.changePageHandle.bind(this);
        this.init();
    }

    init() {
        window.addEventListener('hashchange', this.changePageHandle);
        this.changePageHandle();
    }

    changePageHandle() {
        this.$placeholder.clear();
        const routerKey = Object.keys(this.routes).filter((routerKey)=> {
            return routerKey === ActiveRoute.param[0];
        });
        let page;
        if (routerKey.length) {
            const Page = this.routes[routerKey];
            page = new Page();
        } else {
            page = new DashboardPage();
        }
        this.$placeholder.append(page.getRoot());
        page.afterRender();
    }

    destroy() {
        window.removeEventListener('hashchange', this.changePageHandle);
    }
}
