import {EVENT_TYPES} from '../../../core/events/EventTypes';
import {InputDataEvent} from '../../../core/events/InputDataEvent';
import {ExcelComponent} from '../../../core/ExcelComponent';

export class TableInputManager extends ExcelComponent {
    constructor(table) {
        super(table.$root, {
            listeners: ['input'],
            eventBus: table.eventBus
        });
    }

    onInput(event) {
        const target = event.target;
        this.eventBus.publish(EVENT_TYPES.CELL_INPUT_UPDATED, new InputDataEvent(target));
    }
}
