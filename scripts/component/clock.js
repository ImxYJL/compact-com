import { getDate, getTime } from '../utility/date.js';

let TIMERID = null; // for clearInterval()
let clockEl = null;
let printTimeEl = null;
let printDateEl = null;

// Get and set real-time datas and display it on the screen
const setTime = () => {
  printTimeEl.innerText = getTime();
};

const setDate = () => {
  const dateInfo = getDate();
  printDateEl.innerText = `
        ${dateInfo.day}, ${dateInfo.month} ${dateInfo.date}
    `;
};

// Set the timer and call it by setInterval (every sec)
const initClock = () => {
  setTime();
  setDate();

  TIMERID = setInterval(() => {
    setTime();
    setDate();
  }, 1000);
};

const attachFullTimer = () => {
  printTimeEl = clockEl.querySelector('#clock-time-print');
  printDateEl = clockEl.querySelector('#clock-date-print'); //#date-print로 하니까 컨테이너 무시됨

  //덮어쓰기 때문인듯?
  initClock();
};

const createClockEl = () => {
  clockEl = document.createElement('div');
  clockEl.id = 'clock-window';
  clockEl.className = 'window';
  clockEl.draggable = true;
  clockEl.innerHTML = getInnerHtmlOfClockEl();

  attachFullTimer();

  return clockEl;
};

const getInnerHtmlOfClockEl = () => {
  return `
        <div class="title-bar">
                <div class="title-bar-text">Clock</div>
                    <div class="title-bar-controls">
                        <button id ="close-btn" aria-label="Close"></button>
                </div>
            </div>
        <div id="clock-body">
            <div id = "clock-content-body"class="window-body">
                <div id="clock-time-print">0</div>
                <div id ="clock-date-print">0</div>
            </div>
        </div>
    `;
};

export { createClockEl, TIMERID };
