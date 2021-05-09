import {$} from '../../core/dom';

const PRESELECTED = 'preselected';

export class SelectorManager {
    constructor(table) {
        this.selector = new CellSelector();
        this.$root = table.$root;
        this.prevX = undefined;
        this.prevY = undefined;
    }

    validateEvent(event) {
        event.target.dataset.colIndex;
    }

    onMousedown(event) {
        const targetCellInfo = this.targetCellDetails(event);
        if (targetCellInfo) {
            this.selector.startSelecting(targetCellInfo);
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
            this.selector.updateCellSelection(targetCellInfo);
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
        this.x1 = 0;
        this.y1 = 0;
        this.x2 = 0;
        this.y2 = 0;
    }

    startSelecting(cellInfo) {
        this.x1 = this.x2 = cellInfo.x;
        this.y1 = this.y2 = cellInfo.y;
        this.selectionMode = true;
        this.updateCellSelection(cellInfo);
    }

    updateCellSelection(hoveredCellInfo) {
        this.x1 = Math.min(this.x1, hoveredCellInfo.x);
        this.x2 = Math.max(this.x2, hoveredCellInfo.x);
        this.y1 = Math.min(this.y1, hoveredCellInfo.y);
        this.y2 = Math.max(this.y2, hoveredCellInfo.y);
        this.updatePreselectedCells();
    }

    updatePreselectedCells() {
        this.clearPreselectedCellBackground();
        this.preselectedCells = [];
        for (let x = this.x1; x<=this.x2; x++) {
            for (let y = this.y1; y<=this.y2; y++) {
                const cell = this.findCell(x, y);
                this.preselectedCells.push(cell);
            }
        }
        this.updatePreselectedCellsVisibillity();
    }

    findCell(x, y) {
        return $(`[data-cell-x|="${x}"][data-cell-y|="${y}"]`);
    }

    clearPreselectedCellBackground() {
        this.preselectedCells.forEach((cell)=>{
            cell.removeClass(PRESELECTED);
        });
    }

    finishSelecting() {
        this.selectedCells = this.preselectedCells;
        this.selectionMode = false;
        this.clearPreselectedCellBackground();
    }

    updatePreselectedCellsVisibillity() {
        this.preselectedCells.forEach((cell) => {
            const cellClasses = [PRESELECTED];
            cell.addClasses(cellClasses);
        });
    }
}

class CellInfo {
    constructor(target) {
        this.x= target.dataset.cellX;
        this.y= target.dataset.cellY;
        this.target= target;
    }
}
