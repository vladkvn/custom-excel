import {ExcelComponent} from '../../../core/ExcelComponent';
import {cellInput} from '../../../core/redux/action.creators';

export class TableDataManager extends ExcelComponent {
    constructor(table) {
        super(table.$root, {
            listeners: ['input'],
            eventBus: table.eventBus,
            store: table.store
        });
    }

    init() {
        super.init();
    }

    onInput(event) {
        const data= {
            x: event.target.dataset.cellX,
            y: event.target.dataset.cellY,
            value: event.target.textContent.trim()
        };
        this.$dispatch(cellInput(data));
    }
}
