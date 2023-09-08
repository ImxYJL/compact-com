import { createWordsEl } from './wisesaying.js';
import { createClockEl, initClock } from './clock.js';

// Desktop Element: to append a new tab
const desktop = document.querySelector('#desktop');

// Get Desktop Items
const sayingWordsLabel = document.querySelector('#wise-saying');
const clockLabel = document.querySelector('#clock');

//Elements will be created by click label
let clockEl = null;
let wordsEl = null;

// Handlers for content (label) click
const clickSayingWordsLabel = () => {
    wordsEl = createWordsEl();
    desktop.append(wordsEl);
};

const clickClockLabel = () => {
    if (desktop.contains(clockEl)) return;

    clockEl = createClockEl();
    desktop.append(clockEl);

    //DOM 생성 이후에 달아줘야 하기 때문에 여기서 시계 그려줘야 함
    const printTimeEl = clockEl.querySelector('p');
    const printDateEl = clockEl.querySelector('#date');
    initClock(printTimeEl, printDateEl);
};

sayingWordsLabel.addEventListener('click', clickSayingWordsLabel);
clockLabel.addEventListener('click', clickClockLabel);
