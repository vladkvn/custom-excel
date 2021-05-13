import {DomListener} from '../../../core/DomListener';
import {EVENT_TYPES} from '../../../core/events/EventTypes';

const TIMEOUT_DURATION = 4000;

export class TableInputManager extends DomListener {
    constructor(table) {
        super(table.$root, ['input']);
        this.inputWaiters = {};
        this.eventBus = table.eventBus;
    }

    onInput(event) {
        // eslint-disable-next-line no-debugger
        const target = event.target;
        const targetIdentifier = `[${target.dataset.cellX}/${target.dataset.cellY}]`;
        const inputWaiter = this.inputWaiters[targetIdentifier];
        if (inputWaiter) {
            clearTimeout(inputWaiter);
        }
        const timeout = setTimeout(()=>{
            // eslint-disable-next-line no-undef
            this.inputWaiters[targetIdentifier] = undefined;
            this.eventBus.publish(EVENT_TYPES.CELL_INPUT_UPDATED, );
        }, TIMEOUT_DURATION);
        this.inputWaiters[targetIdentifier] = timeout;
    }
}
