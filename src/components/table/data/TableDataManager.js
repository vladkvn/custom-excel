import {ExcelComponent} from '../../../core/ExcelComponent';
import {cellInput} from '../../../core/redux/action.creators';
import {findCell} from '../helper/table.helper';

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
        this.$subscribe((state)=>this.renderState(state));
    }

    renderState(state) {
        if (state.cellsData) {
            Object.keys(state.cellsData).forEach((key) => {
                const cellIndexes = key.split(':');
                const $cell = findCell(cellIndexes[0], cellIndexes[1]);
                $cell.$el.textContent = state.cellsData[key];
            });
        }
    }

    onInput(event) {
        this.$dispatch(cellInput(event.target));
    }
}
