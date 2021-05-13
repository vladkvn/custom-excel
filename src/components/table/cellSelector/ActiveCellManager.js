import {$} from '../../../core/dom';
import {findCell} from '../helper/table-helper';
import {DomListener} from '../../../core/DomListener';
import {SelectingResult} from '../../../core/events/SelectingResult';
import {EVENT_TYPES} from '../../../core/events/EventTypes';

const FOCUS = 'focus';
const MIN_X = 1;
const MIN_Y = 1;

export class ActiveCellManager extends DomListener {
    constructor(table) {
        super(table.$root, ['keydown']);
        this.eventBus = table.eventBus;
        this.eventBus.subscribe(EVENT_TYPES.CELLS_SELECTION_STARTED, this);
        this.eventBus.subscribe(EVENT_TYPES.CELLS_SELECTION_FINISHED, this);
        this.focusX;
        this.focusY;
        this.x1;
        this.x2;
        this.y1;
        this.y2;
        this.singleSelection = true;
        this.activeElement;
    }

    listen(selectionChangedEvent) {
        this.clear();
        switch (selectionChangedEvent.name) {
        case 'cellsSelectionFinished':
            this.x1 = this.focusX = selectionChangedEvent.data.x1;
            this.x2 = selectionChangedEvent.data.x2;
            this.y1 = this.focusY = selectionChangedEvent.data.y1;
            this.y2 = selectionChangedEvent.data.y2;
            this.singleSelection = !selectionChangedEvent.data.cells.length;
            this.updateActiveCell();
            break;
        }
    }

    onKeydown(event) {
        switch (event.key) {
        case 'ArrowDown':
            this.moveAndMakeActive(this.focusX, this.focusY + 1);
            break;
        case 'ArrowUp':
            this.moveAndMakeActive(this.focusX, this.focusY - 1);
            break;
        case 'ArrowLeft':
            this.moveAndMakeActive(this.focusX - 1, this.focusY);
            break;
        case 'ArrowRight':
            this.moveAndMakeActive(this.focusX + 1, this.focusY);
            break;
        case 'Tab':
            this.tab(event);
            break;
        case 'Enter':
            this.enter(event);
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
        } else if (!this.firstColInSelection()) {
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
        } else if (!this.lastColInSelection()) {
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
            if (this.singleSelection) {
                const activeCell = findCell(this.focusX, this.focusY);
                console.log('single cell moved!');
                this.eventBus.publish(EVENT_TYPES.CELLS_SELECTION_CHANGED,
                    new SelectingResult([activeCell], this.focusX, this.focusX, this.focusY, this.focusY));
            }
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
        } else if (!this.firstRowInSelection()) {
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
        } else if (!this.lastRowInSelection()) {
            this.updateActiveIndicates(this.x1, this.focusY + 1);
        } else {
            this.updateActiveIndicates(this.x1, this.y1);
        }
        this.updateActiveCell();
    }
}
