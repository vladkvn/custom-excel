import {$} from '../../core/dom';

export class TableResizer {
    constructor($parent, type, event) {
        this.$el = $.create('div', `resizer-${type}`);
        this.$parent = $parent;
        this.type = type;
        this.move(event.pageX, event.pageY);
        this.$parent.append(this.$el);
        this.startX = event.pageX;
        this.startY = event.pageY;
        this.x = event.pageX;
        this.y = event.pageY;
        this.target = event.target;
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
        const newWidth = initialWidth + (this.x - this.startX);
        const colIndex = this.target.dataset.colIndex;
        const targetCells = $.all(`div[data-cell-col-index$="${colIndex}"]`);
        targetCells.forEach((cell)=>
            cell.css({width: `${newWidth}px`})
        );
    }

    resizeRow() {
        const initialHeight = this.target.parentElement.offsetHeight;
        const newHeight = initialHeight + (this.y - this.startY);
        const rowIndex = this.target.dataset.rowResizeIndex;
        const targetRow = $(`div[data-row-index$="${rowIndex}"]`);
        targetRow.css({height: `${newHeight}px`});
    }

    remove() {
        this.$parent.removeChild(this.$el);
    }
}
