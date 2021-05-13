import {clearCellsView, updateCellsView} from '../helper/table-helper';
import {EVENT_TYPES} from '../../../core/events/EventTypes';

const SELECTED = 'selected';

export class SelectedCellsManager {
    constructor(table) {
        this.selectedCells = [];
        table.eventBus.subscribe(EVENT_TYPES.CELLS_SELECTION_STARTED, this);
        table.eventBus.subscribe(EVENT_TYPES.CELLS_SELECTION_FINISHED, this);
        table.eventBus.subscribe(EVENT_TYPES.ACTIVE_CELL_MOVED, this);
    }

    listen(selectionChangedEvent) {
        switch (selectionChangedEvent.name) {
        case EVENT_TYPES.CELLS_SELECTION_STARTED:
            this.clear();
            this.selectedCells = [];
            break;
        case EVENT_TYPES.CELLS_SELECTION_FINISHED:
            this.clear();
            this.selectedCells = selectionChangedEvent.data.cells;
            this.redraw();
            break;
        case EVENT_TYPES.ACTIVE_CELL_MOVED:
            if (selectionChangedEvent.data.updateSelectedCells) {
                this.clear();
                this.selectedCells = [selectionChangedEvent.data.activeCell];
                this.redraw();
            }
            break;
        }
    }

    redraw() {
        this.clear();
        updateCellsView(this.selectedCells, SELECTED);
    }

    clear() {
        clearCellsView(this.selectedCells, SELECTED);
    }
}
