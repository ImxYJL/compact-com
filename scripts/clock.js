let timerId = null; // for clearInterval()

const dayOfWeeks = [
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

// Convert numeric data into easy-to-read word
const getDay = (dayNum) => dayOfWeeks[dayNum];
const getMonth = (monthNum) => months[monthNum];

// Get and set real-time datas and display it on the screen
const setTime = (printClockEl) => {
    const today = new Date();
    const hours = today.getHours();
    const minutes = today.getMinutes();
    const seconds = today.getSeconds();
    printClockEl.innerText = `${hours < 10 ? `0${hours}` : hours}:${
        minutes < 10 ? `0${minutes}` : minutes
    }:${seconds < 10 ? `0${seconds}` : seconds}`;
};

const setDate = (printDateEl) => {
    const today = new Date();
    const month = getMonth(today.getMonth());
    const date = today.getDate();
    const day = getDay(today.getDay()); // day of the week
    printDateEl.innerText = `${day}, ${month} ${date}`;
};

// Set the timer and call it by setInterval (every sec)
const initClock = (printClockEl, printDateEl) => {
    setTime(printClockEl);
    setDate(printDateEl);

    timerId = setInterval(() => {
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
        <div id="clock-window">
            <div class="title-bar">
                <div class="title-bar-text">Clock</div>
                    <div class="title-bar-controls">
                        <button id ="close-btn" aria-label="Close"></button>
                    </div>
                </div>
            <div class="window-body">
                <div id="clock-print">0</div>
                <div id="date-print">
                    <div id ="date-container">
                        <p id="date-print">0</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    attachFullTimer(clockEl);

    clockEl.querySelector('#close-btn').addEventListener('click', () => {
        clearInterval(timerId);
        clockEl.remove();
    });
    return clockEl;
};

export { createClockEl, initClock };
