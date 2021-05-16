import {ActiveRoute} from './router/ActiveRoute';

export const STORAGE_PREFIX = 'excel:';

export function capitalizeFirstLetter(string) {
    if (typeof string !== 'string') {
        return '';
    }
    return string.charAt(0).toUpperCase() + string.slice(1);
}


export function storage(key, data) {
    if (!data) {
        return JSON.parse(localStorage.getItem(key));
    }
    localStorage.setItem(key, JSON.stringify(data));
}

export function storageName() {
    return STORAGE_PREFIX + ActiveRoute.param[1];
}

export function isEqual(a, b) {
    if (!!a && !!b && typeof a === 'object' && typeof b === 'object') {
        return JSON.stringify(a) === JSON.stringify(b);
    }
    return a === b;
}

export function parse(valueString) {
    if (valueString && valueString[0] === '=') {
        try {
            return eval(valueString.substr(1));
        } catch (_) {
            return valueString;
        }
    }
    return valueString;
}


export function debounce(fn, ms) {
    let timeout;
    return function(...args) {
        const later = () => {
            clearTimeout(timeout);
            fn(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, ms);
    };
}
