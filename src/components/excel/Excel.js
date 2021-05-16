import {$} from '../../core/dom/Dom';
import {EventBus} from '../../core/events/EventBus';
import {StoreSubscriber} from '../../core/redux/StoreSubscriber';

export class Excel {
    constructor(options) {
        this.components = options.components || [];
        this.eventBus = new EventBus();
        this.store = options.store;
        this.subscriber = new StoreSubscriber(this.store);
    }

    getRoot() {
        const $root = $.create('div', 'excel');
        const componentOptions = {
            eventBus: this.eventBus,
            store: this.store
        };
        this.components = this.components.map((Component) => {
            const $el = $.create('div', Component.className);
            const component = new Component($el, componentOptions);
            $el.html(component.toHTML());
            $root.append($el);
            return component;
        });
        return $root;
    }

    init() {
        this.subscriber.subscribeComponents(this.components);
        this.components.forEach((component) => component.init());
    }

    destroy() {
        this.subscriber.unsubscribeFromStore();
        this.components.forEach((component)=> component.destroy());
    }
}
