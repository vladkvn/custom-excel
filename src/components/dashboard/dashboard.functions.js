import {storage, STORAGE_PREFIX} from '../../core/utils';


function getAllKeys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('excel:')) {
            keys.push(key);
        }
    }
    return keys;
}

export function createRecordsTable() {
    const keys = getAllKeys();
    console.log(keys);
    if (!keys.length) {
        return '' +
          '<p>Список записей пуск</p>';
    } else {
        const elems = keys.map((key)=>{
            const excelState = storage(key);
            const id = key.substr(STORAGE_PREFIX.length);
            const lastOpenedDate = new Date(parseInt(excelState.lastOpened));
            return singleEntryHtml(id, excelState.title, formatDate(lastOpenedDate));
        }).join('');
        return `
        <div class="dashboard__list-header">
                    <span>Название</span>
                    <span>Дата открытия</span>
                  </div>
        <ul class="dashboard__list">
            ${elems}
        </ul>`;
    }
}

function formatDate(date) {
    return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
}

function singleEntryHtml(id, name, lastOpened) {
    return `
        <li class="dashboard__item">
            <a href="#excel/${id}">${name}</a>
            <strong>${lastOpened}</strong>
        </li>`;
}
