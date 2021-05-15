import {$} from '../../../core/dom';

export function resizeColumn(colIndex, newWidth) {
    const targetCells = $.all(`div[data-cell-x$="${colIndex}"]`);
    targetCells.forEach((cell)=> cell.css({width: `${newWidth}px`}));
}

export function resizeRow(rowIndex, newHeight) {
    const targetRow = $(`div[data-row-index$="${rowIndex}"]`);
    targetRow.css({height: `${newHeight}px`});
}
