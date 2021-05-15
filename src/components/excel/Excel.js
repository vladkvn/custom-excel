import {$} from '../../core/dom';
import {EventBus} from '../../core/events/EventBus';

export class Excel {
    constructor(selector, options) {
        this.$el = $(selector);
        this.components = options.components || [];
        this.eventBus = new EventBus();
        this.store = options.store;
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

    render() {
        this.$el.append(this.getRoot());
        this.components.forEach((component) => component.init());
    }

    destroy() {
        this.components.forEach((component)=> component.destroy());
    }
}
