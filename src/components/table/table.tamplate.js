const CODES = {
    A: 65,
    Z: 90
};

const alphabetSize = CODES['Z'] - CODES['A'] + 1;

function createCell(content, className = 'cell') {
    return `<div class="${className}" contenteditable="${className !== 'column'}">${content || ''}</div>`;
}

function toColumnHeaderCell(content) {
    return createCell(content, 'column');
}

function createRow(content, rowInfo='') {
    return `
        <div class="row">
            <div class="row-info">${rowInfo}</div>
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
        .map(toColumnHeaderCell)
        .join('');
    rows.push(createRow(headerCols));
    for (let i = 0; i < rowsCount; i++) {
        const rowCells = new Array(columnsCount + 1)
            .fill('')
            .map(toCell)
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
    console.log(res);
    return res;
}

function toCell(_, __) {
    return createCell('', 'cell');
}
