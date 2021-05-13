import {EVENT_TYPES} from '../../../core/events/EventTypes';
import {columnIdentifier} from '../../table/helper/table-helper';
import {TYPE_COLUMN, TYPE_ROW} from '../../table/resize/TableResizer';

export class ExcelState {
    constructor(table) {
        this.values = [];
        this.rowsHeight = {};
        this.colsWidth = {};
        this.values = {};
        const eventBus = table.eventBus;
        eventBus.subscribe(EVENT_TYPES.RESIZE, this);
        eventBus.subscribe(EVENT_TYPES.CELL_INPUT_UPDATED, this);
    }

    listen(event) {
        switch (event.name) {
        case EVENT_TYPES.CELL_INPUT_UPDATED:
            this.saveCellValue(event);
            break;
        case EVENT_TYPES.RESIZE:
            this.saveResizeValue(event);
            break;
        }
    }

    saveCellValue(event) {
        const targetIdentifier = columnIdentifier(event.data.x, event.data.y);
        this.values[targetIdentifier] = event.data;
        console.log(this.values);
    }

    saveResizeValue(event) {
        switch (event.data.type) {
        case TYPE_COLUMN:
            this.colsWidth[event.data.x] = event.data.newValue;
            break;
        case TYPE_ROW:
            this.rowsHeight[event.data.y] = event.data.newValue;
            break;
        }
    }
}
