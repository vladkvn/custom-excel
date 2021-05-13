import {DomListener} from '../../../core/DomListener';
import {clearCellsView, findCell, targetCellDetails, updateCellsView} from '../helper/table-helper';
import {SelectingResult} from '../../../core/events/SelectingResult';
import {EVENT_TYPES} from '../../../core/events/EventTypes';

const PRESELECTED = 'preselected';

export const SELECTOR_MODE_MOUSE = 'mouse';
export const SELECTOR_MODE_KEYS = 'keys';

class AdvancedCellSelector extends DomListener {
    constructor(table, resolve, initialEventDetails, mode) {
        const isMouseMode = mode === SELECTOR_MODE_MOUSE;
        super(table.$root, isMouseMode? ['mouseup', 'mousemove'] : ['keyup', 'click']);
        this.isMouseMode = isMouseMode;
        this.resolve = resolve;
        this.initDomListeners();
        this.preselectedCells = [];
        this.prevX = initialEventDetails.x;
        this.prevY = initialEventDetails.y;
        this.x1 = initialEventDetails.x;
        this.x2 = initialEventDetails.x;
        this.y1 = initialEventDetails.y;
        this.y2 = initialEventDetails.y;
        this.updatePreselectedCells();
        this.eventBus = table.eventBus;
        if (mode === SELECTOR_MODE_KEYS) {
            this.eventBus.subscribe(EVENT_TYPES.ACTIVE_CELL_MOVED, this);
        }
        this.initialX = initialEventDetails.x;
        this.initialY = initialEventDetails.y;
    }

    finishSelecting() {
        this.removeDomListeners();
        this.resolve(new SelectingResult(this.preselectedCells, this.x1, this.x2, this.y1, this.y2, this.isMouseMode));
        this.eventBus.unsubscribe(this);
    }

    onMouseup() {
        this.finishSelecting();
    }

    onKeyup(event) {
        if (event.key === 'Shift') {
            this.finishSelecting();
        }
    }

    listen(event) {
        if (event.name === EVENT_TYPES.ACTIVE_CELL_MOVED) {
            const selectedCell = event.data.activeCell.$el;
            this.updateIndexesInKeyboardMode(
                parseInt(selectedCell.dataset.cellX),
                parseInt(selectedCell.dataset.cellY));
            this.updatePreselectedCells();
        }
    }

    onClick(event) {
        const targetCellInfo = targetCellDetails(event);
        if (targetCellInfo) {
            this.updateIndexesInKeyboardMode(
                parseInt(targetCellInfo.x),
                parseInt(targetCellInfo.y));
            this.updatePreselectedCells();
        }
    }


    onMousemove(event) {
        const targetCellInfo = targetCellDetails(event);
        if (targetCellInfo &&
            ((this.prevX !== targetCellInfo.x) || this.prevY !== targetCellInfo.y)) {
            this.updateIndexesInMouseMode(targetCellInfo);
            this.updatePreselectedCells();
        }
    }

    updatePreselectedCells() {
        this.clearPreselectedCellBackground();
        this.preselectedCells = [];
        for (let x = this.x1; x <= this.x2; x++) {
            for (let y = this.y1; y <= this.y2; y++) {
                const cell = findCell(x, y);
                this.preselectedCells.push(cell);
            }
        }
        updateCellsView(this.preselectedCells, PRESELECTED);
    }

    clearPreselectedCellBackground() {
        clearCellsView(this.preselectedCells, PRESELECTED);
    }

    updateIndexesInKeyboardMode(xQualifier, yQualifier) {
        if (xQualifier > this.initialX) {
            this.x2 = xQualifier;
            this.x1 = this.initialX;
        } else {
            this.x2 = this.initialX;
            this.x1 = xQualifier;
        }

        if (yQualifier > this.initialY) {
            this.y2 = yQualifier;
            this.y1 = this.initialY;
        } else {
            this.y2 = this.initialY;
            this.y1 = yQualifier;
        }
    }

    updateIndexesInMouseMode(hoveredCellInfo) {
        this.x1 = Math.min(this.x1, hoveredCellInfo.x);
        this.x2 = Math.max(this.x2, hoveredCellInfo.x);
        this.y1 = Math.min(this.y1, hoveredCellInfo.y);
        this.y2 = Math.max(this.y2, hoveredCellInfo.y);
    }
}


export function selectCells($table, targetCellInfo, mode = 'mouse') {
    $table.eventBus.publish(EVENT_TYPES.CELLS_SELECTION_STARTED);
    // eslint-disable-next-line no-undef
    const promise = new Promise((resolve)=>{
        new AdvancedCellSelector($table, resolve, targetCellInfo, mode);
    });
    promise.then((res) => {
        clearCellsView(res.cells, PRESELECTED);
    });
    promise.then((res) => {
        $table.eventBus.publish(EVENT_TYPES.CELLS_SELECTION_FINISHED, res);
    });
    return promise;
}
