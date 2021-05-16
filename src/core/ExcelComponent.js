import {DomListener} from './dom/DomListener';

export class ExcelComponent extends DomListener {
    constructor($root, options = {}) {
        super($root, options.listeners);
        this.name = options.name || '';
        this.eventBus = options.eventBus;
        this.store = options.store;
        this.unsubscribers = [];
        this.subscribe = options.subscribe || [];
    }

    toHTML() {
        return '';
    }

    init() {
        this.initDomListeners();
    }

    renderState(state) {}

    destroy() {
        this.removeDomListeners();
        this.unsubscribers.forEach((unsub)=>unsub.unsubscribe());
    }

    isWatching(key) {
        return this.subscribe.includes(key);
    }

    $subscribe(fn) {
        this.unsubscribers.push(this.store.subscribe(fn));
    }

    $dispatch(action) {
        this.store.dispatch(action);
    }
}
