import {EVENT_TYPES} from '../../../core/events/EventTypes';
import {columnIdentifier, findCell} from '../../table/helper/table-helper';

export class ExcelState {
    constructor(table) {
        this.cellStates = {};
        const eventBus = table.eventBus;
        eventBus.subscribe(EVENT_TYPES.CELL_STYLE_UPDATED, this);
        eventBus.subscribe(EVENT_TYPES.CELL_INPUT_UPDATED, this);
        window['stateSaver'] = this;
    }

    listen(event) {
        switch (event.name) {
        case EVENT_TYPES.CELL_INPUT_UPDATED:
            this.saveCellValue(event);
            break;
        case EVENT_TYPES.CELL_STYLE_UPDATED:
            this.saveCellStyle(event);
            break;
        }
    }

    saveCellValue(event) {
        this.cellEntry(event.data.x, event.data.y).value = event.data.value;
    }

    saveCellStyle(event) {
        this.cellEntry(event.data.x, event.data.y).style = event.data.style;
    }

    cellEntry(x, y) {
        const targetIdentifier = columnIdentifier(x, y);
        if (!this.cellStates[targetIdentifier]) {
            this.cellStates[targetIdentifier] = {x: x, y: y};
        }
        return this.cellStates[targetIdentifier];
    }

    renderState() {
        Object.values(this.cellStates).forEach((cellState) => {
            const $cell = findCell(cellState.x, cellState.y);
            if (cellState.style) {
                $cell.$el.style = cellState.style;
            }
            if (cellState.value) {
                $cell.$el.textContent = cellState.value;
            }
        });
    }
}
