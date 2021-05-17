import {TOOLBAR_BUTTON_PROPERTIES} from './toolbarButtonProperties';
import {ToolbarButton} from './ToolbarButton';

export function createAlignLeftButton(toolbar) {
    return new ToolbarButton(toolbar, TOOLBAR_BUTTON_PROPERTIES.ALIGN_LEFT);
}

export function createAlignRightButton(toolbar) {
    return new ToolbarButton(toolbar, TOOLBAR_BUTTON_PROPERTIES.ALIGN_RIGHT);
}

export function createAlignCenterButton(toolbar) {
    return new ToolbarButton(toolbar, TOOLBAR_BUTTON_PROPERTIES.ALIGN_CENTER);
}

export function createBoldButton(toolbar) {
    return new ToolbarButton(toolbar, TOOLBAR_BUTTON_PROPERTIES.TEXT_BOLD);
}

export function createUnderlineButton(toolbar) {
    return new ToolbarButton(toolbar, TOOLBAR_BUTTON_PROPERTIES.DECORATION_UNDERLINE);
}

export function createItalicButton(toolbar) {
    return new ToolbarButton(toolbar, TOOLBAR_BUTTON_PROPERTIES.STYLE_ITALIC);
}
