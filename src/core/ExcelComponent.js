import {DomListener} from './DomListener';

export class ExcelComponent extends DomListener {
    constructor($root, options = {}) {
        super($root, options.listeners);
        this.name = options.name || '';
        this.eventBus = options.eventBus;
        this.store = options.store;
        this.unsubscribers = [];
    }

    toHTML() {
        return '';
    }

    init() {
        this.initDomListeners();
    }

    destroy() {
        this.removeDomListeners();
        this.unsubscribers.forEach((unsub)=>unsub.unsubscribe());
    }

    $subscribe(fn) {
        this.unsubscribers.push(this.store.subscribe(fn));
    }

    $dispatch(action) {
        this.store.dispatch(action);
    }
}
