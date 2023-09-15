import { createDraggable } from './utility/drag-event.js';
import { clickCloseBtn, clickWindowEl } from './utility/click-event.js';
import { createlifeQuoteEl } from './lifequote.js';
import { createClockEl, timerId } from './clock.js';

// Desktop Element: to append a new tab
const desktop = document.querySelector('#desktop');

// Get Desktop Items
const sayingWordsLabel = document.querySelector('#wise-saying');
const clockLabel = document.querySelector('#clock');

// Elements will be created by click label
let clockEl = null;
let quoteEl = null;

// Handlers for content (label) click
const clickQuoteLabel = () => {
    if (desktop.contains(quoteEl)) return;

    quoteEl = createlifeQuoteEl();
    clickCloseBtn(quoteEl);
    clickWindowEl(quoteEl);
    createDraggable(quoteEl);
    desktop.append(quoteEl);
};

const clickClockLabel = () => {
    // Make sure only one window is open
    if (desktop.contains(clockEl)) return;

    clockEl = createClockEl();
    createDraggable(clockEl);
    clickCloseBtn(clockEl, timerId);
    desktop.append(clockEl);
};

sayingWordsLabel.addEventListener('click', clickQuoteLabel);
clockLabel.addEventListener('click', clickClockLabel);
