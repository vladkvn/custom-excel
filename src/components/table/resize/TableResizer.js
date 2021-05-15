import {$} from '../../../core/dom';
import {EVENT_TYPES} from '../../../core/events/EventTypes';
import {CellStyleUpdatedEvent} from '../../../core/events/CellStyleUpdatedEvent';
import {ExcelComponent} from '../../../core/ExcelComponent';

export const TYPE_COLUMN = 'col';
export const TYPE_ROW = 'row';

export function resize(table, event) {
    let resizer;
    // eslint-disable-next-line no-undef
    const promise = new Promise((resolve)=>{
        resizer = new Resizer(table, event, resolve);
    });
    promise.then(()=>{
        resizer.destroy();
    });
    promise.then((cells)=> {
        cells.forEach((cell)=>{
            table.eventBus.publish(EVENT_TYPES.CELL_STYLE_UPDATED, new CellStyleUpdatedEvent(cell));
        });
    });
    return promise;
}

export class Resizer extends ExcelComponent {
    constructor(table, event, resolve) {
        super(table.$root, {
            name: 'resizer',
            eventBus: table.eventBus,
            store: table.store,
            listeners: ['mouseup', 'mousemove']
        });
        const type = event.target.dataset.resize;
        this.$el = $.create('div', `resizer-${type}`);
        this.type = type;
        this.move(event.pageX, event.pageY);
        this.$root.append(this.$el);
        this.startX = event.pageX;
        this.startY = event.pageY;
        this.x = event.pageX;
        this.y = event.pageY;
        this.target = event.target;
        this.resolve = resolve;
        this.newValue = 0;
        this.targetCells = [];
    }

    onMouseup() {
        this.resize();
        this.remove();
        this.removeDomListeners();
        this.resolve(this.targetCells);
    }

    onMousemove(event) {
        this.move(event.pageX, event.pageY);
    }

    move(x, y) {
        this.x = x;
        this.y = y;
        switch (this.type) {
        case TYPE_COLUMN:
            this.$el.css({left: `${x}px`});
            break;
        case TYPE_ROW:
            this.$el.css({top: `${y}px`});
        }
    }

    resize() {
        switch (this.type) {
        case TYPE_COLUMN:
            this.resizeColumn();
            break;
        case TYPE_ROW:
            this.resizeRow();
        }
    }

    resizeColumn() {
        const initialWidth = this.target.parentElement.offsetWidth;
        this.newValue = initialWidth + (this.x - this.startX);
        const colIndex = this.target.dataset.targetColIndex;
        this.targetCells = $.all(`div[data-cell-x$="${colIndex}"]`);
        this.targetCells.forEach((cell)=> cell.css({width: `${this.newValue}px`}));
    }

    resizeRow() {
        const initialHeight = this.target.parentElement.offsetHeight;
        this.newValue = initialHeight + (this.y - this.startY);
        const rowIndex = this.target.dataset.targetRowIndex;
        const targetRow = $(`div[data-row-index$="${rowIndex}"]`);
        targetRow.css({height: `${this.newValue}px`});
    }

    remove() {
        this.$root.removeChild(this.$el);
    }
}
