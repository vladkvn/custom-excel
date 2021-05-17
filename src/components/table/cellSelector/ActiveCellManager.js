import {$} from '../../../core/dom/Dom';
import {findCell} from '../helper/tableHelper';
import {EVENT_TYPES} from '../../../core/events/EventTypes';
import {ActiveCellMoved} from '../../../core/events/ActiveCellMoved';
import {ExcelComponent} from '../../../core/ExcelComponent';
import {activeCellMoved} from '../../../core/redux/actionCreators';

const FOCUS = 'focus';
const MIN_X = 1;
const MIN_Y = 1;

export class ActiveCellManager extends ExcelComponent {
    constructor(table) {
        super(table.$root, {
            name: 'activeCellManager',
            eventBus: table.eventBus,
            store: table.store,
            listeners: ['keydown']
        });
        this.unsubscribers = [];
        this.focusX;
        this.focusY;
        this.x1;
        this.x2;
        this.y1;
        this.y2;
        this.singleSelection = true;
        this.activeElement;
    }

    init() {
        super.init();
        this.unsubscribers.push(
            this.eventBus.subscribe(EVENT_TYPES.CELLS_SELECTION_STARTED, (event)=>this.listen(event)),
            this.eventBus.subscribe(EVENT_TYPES.CELLS_SELECTION_FINISHED, (event)=>this.listen(event)));
        this.renderState(this.store.state);
    }

    renderState(state) {
        this.focusX = state.activeX;
        this.focusY = state.activeY;
        if (this.focusX && this.focusY) {
            this.updateActiveCell();
            this.publishActiveCellUpdated(true);
        }
    }

    listen(selectionChangedEvent) {
        this.clear();
        switch (selectionChangedEvent.name) {
        case EVENT_TYPES.CELLS_SELECTION_FINISHED:
            this.x1 = this.focusX = selectionChangedEvent.data.x1;
            this.x2 = selectionChangedEvent.data.x2;
            this.y1 = this.focusY = selectionChangedEvent.data.y1;
            this.y2 = selectionChangedEvent.data.y2;
            this.singleSelection = selectionChangedEvent.data.cells.length === 1;
            this.updateActiveCell();
            break;
        }
    }

    onKeydown(event) {
        switch (event.key) {
        case 'ArrowDown':
            this.moveAndMakeActive(this.focusX, this.focusY + 1);
            this.publishActiveCellUpdated(true);
            break;
        case 'ArrowUp':
            this.moveAndMakeActive(this.focusX, this.focusY - 1);
            this.publishActiveCellUpdated(true);
            break;
        case 'ArrowLeft':
            this.moveAndMakeActive(this.focusX - 1, this.focusY);
            this.publishActiveCellUpdated(true);
            break;
        case 'ArrowRight':
            this.moveAndMakeActive(this.focusX + 1, this.focusY);
            this.publishActiveCellUpdated(true);
            break;
        case 'Tab':
            this.tab(event);
            this.publishActiveCellUpdated(this.singleSelection);
            break;
        case 'Enter':
            this.enter(event);
            this.publishActiveCellUpdated(this.singleSelection);
            break;
        }
    }


    clear() {
        const activeCell = $('.' + FOCUS);
        if (activeCell.$el) {
            activeCell.removeClass(FOCUS);
        }
    }

    updateActiveCell() {
        this.clear();
        const activeCell = findCell(this.focusX, this.focusY);
        activeCell.addClass(FOCUS);
        activeCell.$el.focus();
        this.$dispatch(activeCellMoved(activeCell));
    }

    tab(event) {
        event.preventDefault();
        if (!event.shiftKey) {
            this.defaultTabBehaviour(event);
        } else {
            this.reversedTabBehaviour(event);
        }
    }

    enter(event) {
        if (event.altKey) {
            return;
        }
        event.preventDefault();
        if (!event.shiftKey) {
            this.defaultEnterBehaviour();
        } else {
            this.reversedEnterBehaviour();
        }
    }

    reversedEnterBehaviour() {
        if (this.singleSelection) {
            this.moveAndMakeActive(this.focusX, this.focusY - 1);
            return;
        }
        if (!this.firstRowInSelection()) {
            this.updateActiveIndicates(this.focusX, this.focusY - 1);
            this.updateActiveCell();
            return;
        }
        if (!this.firstColInSelection()) {
            this.updateActiveIndicates(this.focusX - 1, this.y2);
        } else {
            this.updateActiveIndicates(this.x2, this.y2);
        }
        this.updateActiveCell();
    }

    defaultEnterBehaviour() {
        if (this.singleSelection) {
            this.moveAndMakeActive(this.focusX, this.focusY + 1);
            return;
        }
        if (!this.lastRowInSelection()) {
            this.updateActiveIndicates(this.focusX, this.focusY + 1);
            this.updateActiveCell();
            return;
        }
        if (!this.lastColInSelection()) {
            this.updateActiveIndicates(this.focusX + 1, this.y1);
        } else {
            this.updateActiveIndicates(this.x1, this.y1);
        }
        this.updateActiveCell();
    }

    moveAndMakeActive(x, y) {
        this.updateActiveIndicates(x, y);
        this.x1 = this.x2 = this.focusX;
        this.y1 = this.y2 = this.focusY;
        this.updateActiveCell();
    }

    updateActiveIndicates(x, y) {
        if (x >= MIN_X && y >= MIN_Y && findCell(x, y).$el) {
            this.focusX = x;
            this.focusY = y;
        }
    }

    lastColInSelection() {
        return this.focusX === this.x2;
    }

    lastRowInSelection() {
        return this.focusY === this.y2;
    }

    firstColInSelection() {
        return this.focusX === this.x1;
    }

    firstRowInSelection() {
        return this.focusY === this.y1;
    }

    reversedTabBehaviour() {
        if (this.singleSelection) {
            this.moveAndMakeActive(this.focusX - 1, this.focusY);
            return;
        }
        if (!this.firstColInSelection()) {
            this.updateActiveIndicates(this.focusX - 1, this.focusY);
            this.updateActiveCell();
            return;
        }
        if (!this.firstRowInSelection()) {
            this.updateActiveIndicates(this.x2, this.focusY - 1);
        } else {
            this.updateActiveIndicates(this.x2, this.y2);
        }
        this.updateActiveCell();
    }

    defaultTabBehaviour() {
        if (this.singleSelection) {
            this.moveAndMakeActive(this.focusX + 1, this.focusY);
            return;
        }
        if (!this.lastColInSelection()) {
            this.updateActiveIndicates(this.focusX + 1, this.focusY);
            this.updateActiveCell();
            return;
        }
        if (!this.lastRowInSelection()) {
            this.updateActiveIndicates(this.x1, this.focusY + 1);
        } else {
            this.updateActiveIndicates(this.x1, this.y1);
        }
        this.updateActiveCell();
    }

    publishActiveCellUpdated(updateSelectedCells = false) {
        const activeCell = findCell(this.focusX, this.focusY);
        this.eventBus.publish(EVENT_TYPES.ACTIVE_CELL_MOVED, new ActiveCellMoved(activeCell, updateSelectedCells));
    }
}
