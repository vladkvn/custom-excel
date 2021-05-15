import {ACTION_TYPES} from './action.types';

export function rootReducer(state, action) {
    let prevState;
    switch (action.type) {
    case ACTION_TYPES.COLUMN_RESIZE: {
        prevState = state.rowState || {};
        const newState = {...prevState, [action.data.index]: action.data.value};
        return {...state, colState: newState};
    }
    case ACTION_TYPES.ROW_RESIZE: {
        prevState = state.colState || {};
        const newState = {...prevState, [action.data.index]: action.data.value};
        return {...state, rowState: newState};
    }
    default:
        return state;
    }
}
