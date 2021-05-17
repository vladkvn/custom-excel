import {ExcelComponent} from '../../../core/ExcelComponent';
import {$} from '../../../core/dom/Dom';
import {styleUpdated} from '../../../core/redux/actionCreators';
import {EVENT_TYPES} from '../../../core/events/EventTypes';
import {findCell} from '../../table/helper/tableHelper';

const START_TIME_MS = 200;

export class ToolbarButton extends ExcelComponent {
    constructor(toolbar, options) {
        super(toolbar.$root, {
            listeners: ['click'],
            eventBus: toolbar.eventBus,
            store: toolbar.store,
            name: 'toolbarButton'
        });
        this.styleName= options.styleName;
        this.styleValue= options.styleValue;
        this.defaultValue= options.defaultValue;
        this.name = options.name;
        this.selectedCells = [];
        this.element = '';
        this.unsubscribers.push(
            this.eventBus.subscribe(EVENT_TYPES.CELLS_SELECTION_FINISHED,
                (event)=>this.listenSelectionChangedEvent(event))
        );
    }

    init() {
        super.init();
        this.element = $(`div[data-format|='${this.name}']`);
        this.renderInitialState(this.store.state);
    }

    toHTML() {
        return `
        <div class="button" data-format="${this.name}">
            <i class="material-icons" data-format="${this.name}">${this.name}</i>
        </div>
        `;
    }

    renderState(state) {
        const affectedCells = this.cellsWithStyleValue(this.styleName, this.styleValue);
        if (affectedCells.length === this.selectedCells.length) {
            this.element.$el.classList.add('clicked');
        } else {
            this.element.$el.classList.remove('clicked');
        }
    }

    onClick(event) {
        if (event.target.dataset.format && event.target.dataset.format === this.name) {
            this.reactOnButtonClick();
        }
    }

    reactOnButtonClick() {
        const alreadyAlignedCells = this.cellsWithStyleValue(this.styleName, this.styleValue);
        if (alreadyAlignedCells.length !== this.selectedCells.length) {
            this.setCellsStyle(this.styleName, this.styleValue);
        } else {
            this.setCellsStyle(this.styleName, this.defaultValue);
        }
    }

    cellsWithStyleValue(styleName, styleValue) {
        return this.selectedCells.filter((cell)=>{
            return cell.$el.style[styleName] === styleValue;
        });
    }

    setCellsStyle(styleName, styleValue) {
        this.selectedCells.forEach((cell)=>{
            cell.css({[styleName]: styleValue});
        });
        this.$dispatch(styleUpdated({cells: this.selectedCells, styleName, styleValue}));
    }

    listenSelectionChangedEvent(event) {
        this.selectedCells = event.data.cells;
    }

    renderInitialState(state) {
        if (state.activeX && state.activeY) {
            this.selectedCells = [findCell(state.activeX, state.activeY)];
        }
        setTimeout(()=>this.renderState(state), START_TIME_MS);
    }
}


