export class InputDataEvent {
    constructor(target) {
        this.x = target.dataset.cellX;
        this.y = target.dataset.cellY;
        this.value = target.textContent.trim();
    }
}
