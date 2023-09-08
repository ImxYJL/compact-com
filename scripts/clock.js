let timerId = null;
const weekday = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

const getDay = (dayNum) => weekday[dayNum];
const getMonth = (monthNum) => months[monthNum];

const getTime = (printClockEl, printDateEl) => {
    const today = new Date();
    const month = getMonth(today.getMonth());
    const date = today.getDate();
    const day = getDay(today.getDay()); //요일
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();
    printClockEl.innerText = `${hours < 10 ? `0${hours}` : hours}:${
        minutes < 10 ? `0${minutes}` : minutes
    }:${seconds < 10 ? `0${seconds}` : seconds}`;
    printDateEl.innerText = `${day}, ${month} ${date}`;
};

const initClock = (printClockEl, printDateEl) => {
    getTime(printClockEl, printDateEl);
    timerId = setInterval(() => {
        getTime(printClockEl, printDateEl);
    }, 1000);
};

const createClockEl = () => {
    const clockEl = document.createElement('div');
    clockEl.className = 'window';
    // clockEl.style.height = '500px';
    clockEl.innerHTML = `
        <div class="title-bar">
            <div class="title-bar-text">Clock</div>
                <div class="title-bar-controls">
                    <button id ="clock-close-btn" aria-label="Close"></button>
                </div>
            </div>
        <div class="window-body">
            <div id="clock-container">
                <p id="clock-print">0</p>
            </div>
            <div id="date-print">
                <div id ="date-container">
                    <p id="date">0</p>
                </div>
            </div>
        </div>
    `;

    clockEl.querySelector('#clock-close-btn').addEventListener('click', () => {
        clearInterval(timerId);
        clockEl.remove();
    });

    return clockEl;
};

export { createClockEl, initClock };
