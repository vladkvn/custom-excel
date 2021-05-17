import {clearCellsView, updateCellsView} from '../helper/tableHelper';
import {EVENT_TYPES} from '../../../core/events/EventTypes';
import {ExcelComponent} from '../../../core/ExcelComponent';

const SELECTED = 'selected';

export class SelectedCellsManager extends ExcelComponent {
    constructor(table) {
        super(table.$root, {
            name: 'activeCellManager',
            eventBus: table.eventBus,
            store: table.store,
            listeners: []
        });
        this.selectedCells = [];
        this.unsubscribers = [];
    }

    init() {
        super.init();
        this.unsubscribers.push(
            this.eventBus.subscribe(EVENT_TYPES.CELLS_SELECTION_STARTED, (event)=>this.listen(event)),
            this.eventBus.subscribe(EVENT_TYPES.CELLS_SELECTION_FINISHED, (event)=>this.listen(event)),
            this.eventBus.subscribe(EVENT_TYPES.ACTIVE_CELL_MOVED, (event)=>this.listen(event))
        );
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
