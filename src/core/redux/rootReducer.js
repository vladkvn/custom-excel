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
    case ACTION_TYPES.CELL_INPUT: {
        prevState = state.cellsData || {};
        const newState = {...prevState, [`${action.data.x}:${action.data.y}`]: action.data.value};
        return {...state, cellsData: newState};
    }
    case ACTION_TYPES.ACTIVE_CELL_MOVED: {
        return {...state, activeX: action.data.x, activeY: action.data.y};
    }
    case ACTION_TYPES.STYLE_CHANGED: {
        prevState = state.cellsStyle || {};
        const newState = {...prevState};
        action.data.cells.map((cell)=>cell.$el).forEach((cell) => {
            const savingStyles = {};
            Object.keys(cell.style).filter((key)=>!!cell.style[key]).forEach((key)=> {
                savingStyles[key] = cell.style[key];
            });
            newState[`${cell.dataset.cellX}:${cell.dataset.cellY}`] = savingStyles;
        });
        return {...state, cellsStyle: newState};
    }
    case ACTION_TYPES.TITLE_UPDATED: {
        return {...state, title: action.data.value};
    }
    default:
        return state;
    }
}
