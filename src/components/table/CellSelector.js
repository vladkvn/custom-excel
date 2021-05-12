import {$} from '../../core/dom';

const PRESELECTED = 'preselected';
const SELECTED = 'selected';
const FOCUS = 'focus';
const MIN_X = 1;
const MIN_Y = 1;

export class SelectorManager {
    constructor(table) {
        this.selector = new CellSelector();
        this.$root = table.$root;
        this.prevX = undefined;
        this.prevY = undefined;
    }

    onMousedown(event) {
        const targetCellInfo = this.targetCellDetails(event);
        if (targetCellInfo) {
            this.selector.startSelecting(targetCellInfo);
        }
    }

    onKeydown(event) {
        if (this.selector.selectionMode) {
            return;
        }
        console.log(event.key);
        switch (event.key) {
        case 'ArrowDown':
            this.selector.arrowDown();
            break;
        case 'ArrowUp':
            this.selector.arrowUp();
            break;
        case 'ArrowLeft':
            this.selector.arrowLeft();
            break;
        case 'ArrowRight':
            this.selector.arrowRight();
            break;
        case 'Tab':
            this.selector.tab(event);
            break;
        case 'Enter':
            this.selector.enter(event);
            break;
        }
    }

    onMouseup(event) {
        const targetCellInfo = this.targetCellDetails(event);
        if (this.selector.selectionMode && targetCellInfo) {
            this.selector.finishSelecting();
        }
    }

    onMousemove(event) {
        const targetCellInfo = this.targetCellDetails(event);
        if (this.selector.selectionMode &&
          targetCellInfo &&
          ((this.prevX !== targetCellInfo.x) || this.prevY !== targetCellInfo.y)) {
            this.prevX = targetCellInfo.x;
            this.prevY = targetCellInfo.y;
            this.selector.onMove(targetCellInfo);
        }
    }

    targetCellDetails(event) {
        const target = event.target;
        if (target.dataset.cellX && target.dataset.cellY) {
            return new CellInfo(target);
        }
    }
}


class CellSelector {
    constructor() {
        this.selectionMode = false;
        this.preselectedCells = [];
        this.selectedCells = [];
        this.focusX = 1;
        this.focusY = 1;
        this.x1 = 1;
        this.x2 = 1;
        this.y1 = 1;
        this.y2 = 1;
    }

    startSelecting(cellInfo) {
        this.selectionMode = true;
        this.definitiveIndexes(cellInfo);
        this.updatePreselectedCells();
        clearSelectedCellsBackground(this.selectedCells);
        this.selectedCells = [];
    }

    definitiveIndexes(hoveredCellInfo) {
        this.x1 = this.x2 = hoveredCellInfo.x;
        this.y1 = this.y2 = hoveredCellInfo.y;
    }

    onMove(cellInfo) {
        this.updateTargetIndexes(cellInfo);
        this.updatePreselectedCells();
    }

    updateTargetIndexes(hoveredCellInfo) {
        this.x1 = Math.min(this.x1, hoveredCellInfo.x);
        this.x2 = Math.max(this.x2, hoveredCellInfo.x);
        this.y1 = Math.min(this.y1, hoveredCellInfo.y);
        this.y2 = Math.max(this.y2, hoveredCellInfo.y);
    }

    updatePreselectedCells() {
        clearPreselectedCellBackground(this.preselectedCells);
        this.preselectedCells = [];
        for (let x = this.x1; x<=this.x2; x++) {
            for (let y = this.y1; y<=this.y2; y++) {
                const cell = findCell(x, y);
                this.preselectedCells.push(cell);
            }
        }
        updatePreselectedCellsView(this.preselectedCells);
    }

    finishSelecting() {
        this.selectedCells = this.preselectedCells;
        clearPreselectedCellBackground(this.preselectedCells);
        this.preselectedCells = [];
        this.selectionMode = false;
        updateSelectedCellView(this.selectedCells);
        this.focusX = this.x1;
        this.focusY = this.y1;
        this.updateActiveCell();
    }

    updateActiveCell() {
        let activeCell = $('.' + FOCUS);
        if (activeCell.$el) {
            activeCell.removeClass(FOCUS);
        }
        activeCell = findCell(this.focusX, this.focusY);
        activeCell.addClass(FOCUS);
        activeCell.$el.focus();
    }

    arrowRight() {
        this.moveAndMakeActive(this.focusX + 1, this.focusY);
    }

    arrowDown() {
        this.moveAndMakeActive(this.focusX, this.focusY + 1);
    }

    arrowUp() {
        this.moveAndMakeActive(this.focusX, this.focusY - 1);
    }

    arrowLeft() {
        this.moveAndMakeActive(this.focusX - 1, this.focusY);
    }

    tab(event) {
        event.preventDefault();
        if (this.selectedCells.length === 1) {
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

    enter(event) {
        if (event.altKey) {
            return;
        }
        event.preventDefault();
        if (this.selectedCells.length === 1) {
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
        clearSelectedCellsBackground(this.selectedCells);
        this.selectedCells = [];
        this.updateActiveIndicates(x, y);
        this.selectedCells = [findCell(this.focusX, this.focusY)];
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
}

const updatePreselectedCellsView = function(preselectedCells) {
    updateCellsView(preselectedCells, PRESELECTED);
};

const updateSelectedCellView = function(selectedCells) {
    updateCellsView(selectedCells, SELECTED);
};

const clearPreselectedCellBackground = function(cells) {
    clearCellsView(cells, PRESELECTED);
};

const clearSelectedCellsBackground = function(selectedCells) {
    clearCellsView(selectedCells, SELECTED);
};

const updateCellsView = function(cells, className) {
    cells.forEach((cell) => {
        cell.addClass(className);
    });
};

const clearCellsView = function(cells, className) {
    cells.forEach((cell) => {
        cell.removeClass(className);
    });
};

const findCell = function(x, y) {
    return $(`[data-cell-x|="${x}"][data-cell-y|="${y}"]`);
};

class CellInfo {
    constructor(target) {
        this.x= parseInt(target.dataset.cellX);
        this.y= parseInt(target.dataset.cellY);
        this.target= target;
    }
}
