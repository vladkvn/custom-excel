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
