export class CellStyleUpdatedEvent {
    constructor($cell) {
        this.x = $cell.$el.dataset.cellX;
        this.y = $cell.$el.dataset.cellY;
        this.style = $cell.$el.style;
    }
}
