import { createDraggable } from './dragcontroller.js';
import { createWordsEl } from './wisesaying.js';
import { createClockEl } from './clock.js';

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
    if (desktop.contains(wordsEl)) return;

    wordsEl = createWordsEl();
    createDraggable(wordsEl);
    desktop.append(wordsEl);
};

const clickClockLabel = () => {
    // Make sure only one window is open
    if (desktop.contains(clockEl)) return;

    clockEl = createClockEl();
    createDraggable(clockEl);
    desktop.append(clockEl);
};

sayingWordsLabel.addEventListener('click', clickSayingWordsLabel);
clockLabel.addEventListener('click', clickClockLabel);
