import {clearCellsView, updateCellsView} from '../helper/table-helper';

const SELECTED = 'selected';

export class SelectedCellsManager {
    constructor(eventBus) {
        this.selectedCells = [];
        eventBus.subscribe('cellsSelectionStarted', this);
        eventBus.subscribe('cellsSelectionFinished', this);
        eventBus.subscribe('cellsSelectionChanged', this);
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
