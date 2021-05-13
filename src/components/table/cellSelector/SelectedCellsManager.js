import {clearCellsView, updateCellsView} from '../helper/table-helper';
import {EVENT_TYPES} from '../../../core/events/EventTypes';

const SELECTED = 'selected';

export class SelectedCellsManager {
    constructor(eventBus) {
        this.selectedCells = [];
        eventBus.subscribe(EVENT_TYPES.CELLS_SELECTION_STARTED, this);
        eventBus.subscribe(EVENT_TYPES.CELLS_SELECTION_FINISHED, this);
        eventBus.subscribe(EVENT_TYPES.CELLS_SELECTION_CHANGED, this);
    }

    listen(selectionChangedEvent) {
        this.clear();
        switch (selectionChangedEvent.name) {
        case 'cellsSelectionStarted':
            this.selectedCells = [];
            break;
        case 'cellsSelectionFinished':
        case 'cellsSelectionChanged':
            this.selectedCells = selectionChangedEvent.data.cells;
            this.redraw();
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
