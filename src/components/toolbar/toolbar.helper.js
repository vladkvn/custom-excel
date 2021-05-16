function createButton(name) {
    return `
    <div class="button" data-format="${name}">
        <i class="material-icons" data-format="${name}">${name}</i>
    </div>`;
}

export function createToolbar(buttons = []) {
    return buttons.map(createButton).join('');
}
