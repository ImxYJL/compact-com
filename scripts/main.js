import { createWordsEl } from './wisesaying.js';
import { createClockEl, getTime, initClock } from './clock.js';

// Desktop Element: to append a new tab
const desktop = document.querySelector('#desktop');

// Get Desktop Items
const sayingWordsLabel = document.querySelector('#wise-saying');
const clockLabel = document.querySelector('#clock');

// Handlers for content (label) click
const clickSayingWordsLabel = () => {
    const wordsEl = createWordsEl();
    desktop.append(wordsEl);
};

let clockEl = null;
const clickClockLabel = () => {
    clockEl = createClockEl();
    //const clockEl = createClockEl();
    desktop.append(clockEl);

    //DOM 생성 이후에 달아줘야 하기 때문에 여기서 시계 그려줘야 함
    const printTimeEl = clockEl.querySelector('p');
    console.log(printTimeEl);
    getTime(printTimeEl);

    if (clockEl) initClock(printTimeEl);
};

sayingWordsLabel.addEventListener('click', clickSayingWordsLabel);
clockLabel.addEventListener('click', clickClockLabel);

// Handlers for close button click
//initClock(); -> 얘 어카지
() => {
    if (clockEl) initClock(printTimeEl);
};
