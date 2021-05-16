import {ACTION_TYPES} from './action.types';

export function columnResize(data) {
    return {
        type: ACTION_TYPES.COLUMN_RESIZE,
        data
    };
}

export function rowResize(data) {
    return {
        type: ACTION_TYPES.ROW_RESIZE,
        data
    };
}

export function cellInput(data) {
    return {
        type: ACTION_TYPES.CELL_INPUT,
        data
    };
}

export function styleUpdated(data) {
    return {
        type: ACTION_TYPES.STYLE_CHANGED,
        data
    };
}

export function activeCellMoved(cell) {
    return {
        type: ACTION_TYPES.ACTIVE_CELL_MOVED,
        data: {
            x: cell.$el.dataset.cellX,
            y: cell.$el.dataset.cellY
        }
    };
}

export function titleUpdated(data) {
    return {
        type: ACTION_TYPES.TITLE_UPDATED,
        data
    };
}
