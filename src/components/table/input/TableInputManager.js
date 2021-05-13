import {DomListener} from '../../../core/DomListener';
import {EVENT_TYPES} from '../../../core/events/EventTypes';
import {InputDataEvent} from '../../../core/events/InputDataEvent';

export class TableInputManager extends DomListener {
    constructor(table) {
        super(table.$root, ['input']);
        this.eventBus = table.eventBus;
    }

    onInput(event) {
        const target = event.target;
        this.eventBus.publish(EVENT_TYPES.CELL_INPUT_UPDATED, new InputDataEvent(target), this);
    }
}
