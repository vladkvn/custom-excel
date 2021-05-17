import {$} from '../../../core/dom/Dom';
import {ExcelComponent} from '../../../core/ExcelComponent';
import {columnResize, rowResize} from '../../../core/redux/actionCreators';
import {resizeColumn, resizeRow} from './resizeHelper';

export const TYPE_COLUMN = 'col';
export const TYPE_ROW = 'row';

export function resize(table, event) {
    let resizer;
    // eslint-disable-next-line no-undef
    const promise = new Promise((resolve)=>{
        resizer = new Resizer(table, event, resolve);
        resizer.init();
    });
    promise.then(()=>{
        resizer.destroy();
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
        this.type = event.target.dataset.resize;
        this.$el = $.create('div', `resizer-${this.type}`);
        this.move(event.pageX, event.pageY);
        this.$root.append(this.$el);
        this.startX = event.pageX;
        this.startY = event.pageY;
        this.x = event.pageX;
        this.y = event.pageY;
        this.target = event.target;
        this.resolve = resolve;
        this.targetIndex = this.type === TYPE_COLUMN ?
            this.target.dataset.targetColIndex :
            this.target.dataset.targetRowIndex;
    }

    onMouseup() {
        this.resize();
        this.remove();
        this.removeDomListeners();
        this.resolve({
            type: this.type,
            value: this.newValue,
            index: this.targetIndex
        });
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
        let newValue;
        switch (this.type) {
        case TYPE_COLUMN:
            newValue = this.calcNewWidth();
            resizeColumn(this.targetIndex, newValue);
            this.$dispatch(columnResize({index: this.target.dataset.targetColIndex, value: newValue}));
            break;
        case TYPE_ROW:
            newValue = this.calcNewHeight();
            resizeRow(this.targetIndex, newValue);
            this.$dispatch(rowResize({index: this.target.dataset.targetRowIndex, value: newValue}));
        }
    }

    calcNewWidth() {
        const initialWidth = this.target.parentElement.offsetWidth;
        return initialWidth + (this.x - this.startX);
    }

    calcNewHeight() {
        const initialHeight = this.target.parentElement.offsetHeight;
        return initialHeight + (this.y - this.startY);
    }

    remove() {
        this.$root.removeChild(this.$el);
    }
}
