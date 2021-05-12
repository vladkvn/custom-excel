import {DomListener} from '../../../core/DomListener';
import {clearCellsView, findCell, targetCellDetails, updateCellsView} from '../helper/table-helper';
import {SelectingResult} from './SelectingResult';

const PRESELECTED = 'preselected';
// eslint-disable-next-line no-unused-vars
class AdvancedCellSelector extends DomListener {
    constructor($root, resolve, initialEventDetails) {
        super($root, ['mouseup', 'mousemove']);
        this.resolve = resolve;
        this.initDomListeners();
        this.preselectedCells = [];
        this.prevX = initialEventDetails.x;
        this.prevY = initialEventDetails.y;
        this.x1 = initialEventDetails.x;
        this.x2 = initialEventDetails.x;
        this.y1 = initialEventDetails.y;
        this.y2 = initialEventDetails.y;
    }

    onMouseup() {
        this.removeDomListeners();
        this.resolve(new SelectingResult(this.preselectedCells, this.x1, this.x2, this.y1, this.y2));
    }

    onMousemove(event) {
        const targetCellInfo = targetCellDetails(event);
        if (targetCellInfo &&
            ((this.prevX !== targetCellInfo.x) || this.prevY !== targetCellInfo.y)) {
            this.updateTargetIndexes(targetCellInfo);
            this.updatePreselectedCells();
        }
    }

    updatePreselectedCells() {
        this.clearPreselectedCellBackground();
        this.preselectedCells = [];
        for (let x = this.x1; x<=this.x2; x++) {
            for (let y = this.y1; y<=this.y2; y++) {
                const cell = findCell(x, y);
                this.preselectedCells.push(cell);
            }
        }
        updateCellsView(this.preselectedCells, PRESELECTED);
    }

    clearPreselectedCellBackground() {
        clearCellsView(this.preselectedCells, PRESELECTED);
    }

    updateTargetIndexes(hoveredCellInfo) {
        this.x1 = Math.min(this.x1, hoveredCellInfo.x);
        this.x2 = Math.max(this.x2, hoveredCellInfo.x);
        this.y1 = Math.min(this.y1, hoveredCellInfo.y);
        this.y2 = Math.max(this.y2, hoveredCellInfo.y);
    }
}


export function selectCells($table, targetCellInfo) {
    // eslint-disable-next-line no-undef
    const promise = new Promise((resolve)=>{
        new AdvancedCellSelector($table.$root, resolve, targetCellInfo);
    });
    promise.then((res) => {
        clearCellsView(res.cells, PRESELECTED);
    });
    $table.eventBus.publish('cellsSelectionStarted');
    return promise;
}
