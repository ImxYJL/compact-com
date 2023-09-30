import { getDate, getTime } from './utility/date.js';

let TIMERID = null; // for clearInterval()

// Get and set real-time datas and display it on the screen
const setTime = (printClockEl) => {
    printClockEl.innerText = getTime();
};

const setDate = (printDateEl) => {
    const dateInfo = getDate();
    printDateEl.innerText = `
        ${dateInfo.day}, ${dateInfo.month} ${dateInfo.date}
    `;
};

// Set the timer and call it by setInterval (every sec)
const initClock = (printClockEl, printDateEl) => {
    setTime(printClockEl);
    setDate(printDateEl);

    TIMERID = setInterval(() => {
        setTime(printClockEl);
        setDate(printDateEl);
    }, 1000);
};

const attachFullTimer = (clockEl) => {
    const printTimeEl = clockEl.querySelector('#clock-print');
    const printDateEl = clockEl.querySelector('#date-container'); //#date-print로 하니까 컨테이너 무시됨

    //덮어쓰기 때문인듯?
    initClock(printTimeEl, printDateEl);
};

const createClockEl = () => {
    const clockEl = document.createElement('div');
    clockEl.className = 'window';
    clockEl.draggable = true;
    clockEl.innerHTML = `
        <div class="title-bar">
                <div class="title-bar-text">Clock</div>
                    <div class="title-bar-controls">
                        <button id ="close-btn" aria-label="Close"></button>
                </div>
            </div>
        <div id="clock-window">
            <div class="window-body">
                <div id="clock-print">0</div>
                <div id ="date-container">
                    <p id="date-print"></p>
                </div>
            </div>
        </div>
    `;

    attachFullTimer(clockEl);

    return clockEl;
};

export { createClockEl, initClock, TIMERID };
