import { createDraggable } from './dragcontroller.js';
import { createlifeQuoteEl } from './lifequote.js';
import { createClockEl } from './clock.js';

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
    createDraggable(quoteEl);
    desktop.append(quoteEl);
};

const clickClockLabel = () => {
    // Make sure only one window is open
    if (desktop.contains(clockEl)) return;

    clockEl = createClockEl();
    createDraggable(clockEl);
    desktop.append(clockEl);
};

sayingWordsLabel.addEventListener('click', clickQuoteLabel);
clockLabel.addEventListener('click', clickClockLabel);
