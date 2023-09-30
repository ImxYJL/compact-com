import { createDraggable } from './utility/drag-event.js';
import { clickCloseBtn, clickWindowEl } from './utility/click-event.js';
import { createlifeQuoteEl } from './lifequote.js';
import { createClockEl, TIMERID } from './clock.js';

// Desktop Element: to append a new tab
const desktop = document.querySelector('#desktop');

// Get Desktop Items
const lifequoteLabel = document.querySelector('#life-quote');
const clockLabel = document.querySelector('#clock');

const OPEN_EL_LIST = new Set();

// Elements will be created by click label
let clockEl = null;
let quoteEl = null;

// Handlers for content (label) click
const clickQuoteLabel = () => {
    if (desktop.contains(quoteEl)) return;

    // 여기 체이닝으로 구현해도 될것같다
    quoteEl = createlifeQuoteEl();
    clickCloseBtn(quoteEl);
    createDraggable(quoteEl);
    desktop.append(quoteEl);
    OPEN_EL_LIST.add(quoteEl);
    clickWindowEl(quoteEl);
};

const clickClockLabel = () => {
    // Make sure only one window is open
    if (desktop.contains(clockEl)) return;

    clockEl = createClockEl();
    createDraggable(clockEl);
    clickCloseBtn(clockEl, TIMERID);
    desktop.append(clockEl);
    OPEN_EL_LIST.add(clockEl);
    clickWindowEl(clockEl);
};

lifequoteLabel.addEventListener('click', clickQuoteLabel);
clockLabel.addEventListener('click', clickClockLabel);

export { OPEN_EL_LIST };
