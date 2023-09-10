import { createWordsEl } from './wisesaying.js';
import { createClockEl, initClock } from './clock.js';

// Desktop Element: to append a new tab
const desktop = document.querySelector('#desktop');

// Get Desktop Items
const sayingWordsLabel = document.querySelector('#wise-saying');
const clockLabel = document.querySelector('#clock');

// Elements will be created by click label
let clockEl = null;
let wordsEl = null;

// Handlers for content (label) click
const clickSayingWordsLabel = () => {
    wordsEl = createWordsEl();
    desktop.append(wordsEl);
};

const clickClockLabel = () => {
    // Make sure only one window is open
    if (desktop.contains(clockEl)) return;

    clockEl = createClockEl();
    desktop.append(clockEl);

    // Set the timer after creating DOM elements
    const printTimeEl = clockEl.querySelector('#clock-print');
    const printDateEl = clockEl.querySelector('#date-print');
    initClock(printTimeEl, printDateEl);
};

sayingWordsLabel.addEventListener('click', clickSayingWordsLabel);
clockLabel.addEventListener('click', clickClockLabel);
