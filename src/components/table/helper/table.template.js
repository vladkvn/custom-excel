const CODES = {
    A: 65,
    Z: 90
};

const alphabetSize = CODES['Z'] - CODES['A'] + 1;

function createCell(content, className = 'cell', rowIndex, colIndex) {
    return `<div
                data-cell-x=${colIndex}
                data-cell-y=${rowIndex}
                class="${className}"
                contenteditable="true">${content || '' }
            </div>`;
}

function toColumnHeaderCell(content, index) {
    return `
    <div class="column" data-cell-x=${index} data-cell-y="0">
        ${content || ''}
        <div class="col-resize" data-resize="col" data-target-col-index=${index}>
        </div>
    </div>`;
}

function createRow(content, index) {
    return `
        <div class="row" data-row-index=${index}>
            <div class="row-info" data-row-y=${index} data-cell-x="0" data-cell-y="${index}">
                ${index}
                <div class="row-resize" data-resize="row" data-target-row-index=${index}></div>
            </div>
            <div class="row-data">
                ${content}
            </div>
        </div>
        `;
}

function createFirstRow(content) {
    return `
        <div class="row">
            <div class="row-info"></div>
            <div class="row-data">
                ${content}
            </div>
        </div>
        `;
}

export function createTable(rowsCount= 20, columnsCount = alphabetSize - 1) {
    const rows = [];
    const headerCols = new Array(columnsCount + 1)
        .fill('')
        .map(toHeaderValue)
        .map((value, index)=> toColumnHeaderCell(value, index + 1))
        .join('');
    rows.push(createFirstRow(headerCols));
    for (let i = 0; i < rowsCount; i++) {
        const rowCells = new Array(columnsCount + 1)
            .fill('')
            .map((_, index)=>toCell(_, i+1, index + 1))
            .join('');
        rows.push(createRow(rowCells, i+1));
    }
    return rows.join('');
}

function toHeaderValue(_, index) {
    let accumulator = index;
    let res = '';
    do {
        const stepResult = (accumulator % alphabetSize) + CODES['A'];
        accumulator = Math.trunc(accumulator / alphabetSize);
        res = String.fromCharCode(stepResult) + res;
        if (accumulator === 1) {
            res = 'A' + res;
            accumulator = 0;
        }
    } while (accumulator > 0);
    return res;
}

function toCell(_, rowIndex, colIndex) {
    return createCell('', 'cell', rowIndex, colIndex);
}
