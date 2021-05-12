import {$} from '../../../core/dom';

export function targetCellDetails(event) {
    const target = event.target;
    if (target.dataset.cellX && target.dataset.cellY) {
        return new CellInfo(target);
    }
}

export function findCell(x, y) {
    return $(`[data-cell-x|="${x}"][data-cell-y|="${y}"]`);
}

export function updateCellsView(cells, className) {
    cells.forEach((cell) => {
        cell.addClass(className);
    });
}

export function clearCellsView(cells, className) {
    cells.forEach((cell) => {
        cell.removeClass(className);
    });
}

export class CellInfo {
    constructor(target) {
        this.x= parseInt(target.dataset.cellX);
        this.y= parseInt(target.dataset.cellY);
        this.target= target;
    }
}


