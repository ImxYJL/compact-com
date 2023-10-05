let timetableEl = null;

const getTable = () => {
    // 시간대 목록
    const timeSlots = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

    // 표 생성 함수

    const tbody = timetableEl.querySelector('tbody');

    for (const time of timeSlots) {
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        timeCell.textContent = time + ':00';
        row.appendChild(timeCell);

        for (let i = 0; i < 5; i++) {
            const cell = document.createElement('td');
            row.appendChild(cell);
        }

        tbody.appendChild(row);
    }
};

const createTimetableEl = () => {
    timetableEl = document.createElement('div');
    timetableEl.id = 'timetable-window';
    timetableEl.className = 'window';
    timetableEl.draggable = true;
    timetableEl.innerHTML = getInnerHtmlOfTimetableEl();
    getTable();

    return timetableEl;
};

const getInnerHtmlOfTimetableEl = () => {
    return `
        <div class="title-bar">
            <div class="title-bar-text">Timetable</div>
            <div class="title-bar-controls">
                <button id ="close-btn" aria-label="Close"></button>
            </div>
        </div>
        <div id="timetable-body" class="window-body">
            <div id="timetable-content-body" class="window" role="tabpanel">
                    <div id="timetable-container">          
                        <table id = "timetable-table">
                            <!-- <caption>Timetable</caption> -->
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Monday</th>
                                    <th>Tuesday</th>
                                    <th>Wednesday</th>
                                    <th>Thursday</th>
                                    <th>Friday</th>
                                </tr>
                            </thead>
                            <tbody id="timetable-body"></tbody>
                        </table>
                    </div>
                    <div id="timetable-side-container">
                            <fieldset>
                                <legend>Today's mood</legend>
                                <div class="field-row">
                                    <input id="radio13" type="radio" name="fieldset-example2">
                                    <label for="radio13">Claire Saffitz</label>
                                </div>
                                <div class="field-row">
                                    <input id="radio14" type="radio" name="fieldset-example2">
                                    <label for="radio14">Brad Leone</label>
                                </div>
                            </fieldset>
                            <fieldset>
                                <legend>Today's mood</legend>
                                <div id ="start-menu" class="window-box-shadow">
                                    <label for="">hello</label>
                                </div>
                            </fieldset>
                    </div>
            </div>
        </div>
    `;
};

export { createTimetableEl };
