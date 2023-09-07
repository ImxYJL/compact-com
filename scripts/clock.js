const getTime = (printClockEl) => {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    printClockEl.innerText = `${hours < 10 ? `0${hours}` : hours}:${
        minutes < 10 ? `0${minutes}` : minutes
    }:${seconds < 10 ? `0${seconds}` : seconds}`;
};

const initClock = (printClockEl) => {
    getTime(printClockEl);
    setInterval(getTime(printClockEl), 1000);
};

const createClockEl = () => {
    const clockEl = document.createElement('div');
    clockEl.className = 'window';
    clockEl.innerHTML = `
        <div class="title-bar">
            <div class="title-bar-text">Clock</div>
                <div class="title-bar-controls">
                    <!-- <button aria-label="Minimize"></button> -->
                    <!-- <button aria-label="Maximize"></button> -->
                    <button id ="clock-close-btn" aria-label="Close"></button>
                </div>
            </div>
        <div class="window-body">
            <div id="clock-print">
                <p>0</p>
            </div>
            <div id="date-print">
                <p>1</p>
            </div>
        </div>
    `;

    clockEl.querySelector('#clock-close-btn').addEventListener('click', () => {
        clockEl.remove();
    });

    return clockEl;
};

export { createClockEl, getTime, initClock };
