import {$} from '../../core/dom';
import {EventBus} from '../../core/events/EventBus';
import {ExcelState} from './state/ExcelState';

export class Excel {
    constructor(selector, options) {
        this.$el = $(selector);
        this.components = options.components || [];
        this.eventBus = new EventBus();
        this.state = new ExcelState(this);
    }

    getRoot() {
        const $root = $.create('div', 'excel');

        this.components = this.components.map((Component) => {
            const $el = $.create('div', Component.className);
            const component = new Component($el, this.eventBus);
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
