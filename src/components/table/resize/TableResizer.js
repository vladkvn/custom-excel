import {$} from '../../../core/dom';
import {DomListener} from '../../../core/DomListener';
import {ResizeResult} from './ResizeResult';


export function resize(table, event) {
    // eslint-disable-next-line no-undef
    const promise = new Promise((resolve)=>{
        new Resizer(table, event, resolve);
    });
    promise.then((result)=> table.eventBus.publish('resize', result));
    return promise;
}

export class Resizer extends DomListener {
    constructor(table, event, resolve) {
        const type = event.target.dataset.resize;
        super(table.$root, ['mouseup', 'mousemove']);
        this.$el = $.create('div', `resizer-${type}`);
        this.$parent = table.$root;
        this.type = type;
        this.move(event.pageX, event.pageY);
        this.$parent.append(this.$el);
        this.startX = event.pageX;
        this.startY = event.pageY;
        this.x = event.pageX;
        this.y = event.pageY;
        this.target = event.target;
        this.$root = table.$root;
        this.resolve = resolve;
        this.initDomListeners();
        this.newValue = 0;
    }

    onMouseup() {
        this.resize();
        this.remove();
        this.removeDomListeners();
        this.resolve(new ResizeResult(this.type, this.newValue));
    }

    onMousemove(event) {
        this.move(event.pageX, event.pageY);
    }

    move(x, y) {
        this.x = x;
        this.y = y;
        switch (this.type) {
        case 'col':
            this.$el.css({left: `${x}px`});
            break;
        case 'row':
            this.$el.css({top: `${y}px`});
        }
    }

    resize() {
        switch (this.type) {
        case 'col':
            this.resizeColumn();
            break;
        case 'row':
            this.resizeRow();
        }
    }

    resizeColumn() {
        const initialWidth = this.target.parentElement.offsetWidth;
        this.newValue = initialWidth + (this.x - this.startX);
        const colIndex = this.target.dataset.targetColIndex;
        const targetCells = $.all(`div[data-cell-x$="${colIndex}"]`);
        targetCells.forEach((cell)=>
            cell.css({width: `${this.newValue}px`})
        );
    }

    resizeRow() {
        const initialHeight = this.target.parentElement.offsetHeight;
        this.newValue = initialHeight + (this.y - this.startY);
        const rowIndex = this.target.dataset.targetRowIndex;
        const targetRow = $(`div[data-row-index$="${rowIndex}"]`);
        targetRow.css({height: `${this.newValue}px`});
    }

    remove() {
        this.$parent.removeChild(this.$el);
    }
}