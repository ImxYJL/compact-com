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
                                <legend>Select Function</legend>
                                <div class="field-row">
                                    <input id="radio13" type="radio" name="fieldset-example2">
                                    <label for="radio13">Today's Lecture</label>
                                </div>
                                <div class="field-row">
                                    <input id="radio14" type="radio" name="fieldset-example2">
                                    <label for="radio14">Edit Timetable</label>
                                </div>
                            </fieldset>
                            <div id="side-content-container">
                                <div id="side-content-1" class="hidden">
                                    <label class="sdie-content-title">Today's Lectures</label>
                                    <div id ="lecture-list">
                                        <label class="divider"></label>
                                        <div class="lecture-item">

                                            <label class="lecture-item-title">Javascript</label>
                                            <label class="lecture-item-time">2:00~3:15</label>
                                            <label class="lecture-item-place">본관</label>
                                        </div>
                                        <label class="divider"></label>
                                        <div class="lecture-item">

                                            <label class="lecture-item-title">Javascript</label>
                                            <label class="lecture-item-time">2:00~3:15</label>
                                            <label class="lecture-item-place">본관</label>
                                        </div>
                                    </div>
                                </div>
                                <div id="side-content-2" class="visible">
                                <label class="sdie-content-title">Edit Timetable</label>
                                    <div id ="lecture-edit-container" >
                                        <label for="lecture-name">Name</label>
                                        <input id ="lecture-name" type="text"/>
                                        <label for="lecture-professor">Professor</label>
                                        <input id ="lecture-professor" type="text"/>
                                        <label for="lecture-location">Location</label>
                                        <input id ="lecture-location" type="text"/>
                                        <label for="lecture-week">Week</label>
                                            <select>
                                                <option>5 - Incredible!</option>
                                                <option>4 - Great!</option>
                                                <option>3 - Pretty good</option>
                                                <option>2 - Not so great</option>
                                                <option>1 - Unfortunate</option>
                                            </select>
                                        <label for="lecture-time">Time</label>
                                        <div class="time-row">
                                            <select>
                                                <option>5 - Incredible!</option>
                                                <option>4 - Great!</option>
                                            </select>
                                            <div>:</div>
                                            <select>
                                                <option>5 - Incredible!</option>
                                                <option>4 - Great!</option>
                                            </select>
                                        </div>
                                        <label for="lecture-color">Color</label>
                                        <div class="color-picker"></div>
                                    </div>
                            </div>
                            </div>
                                
                    </div>
            </div>
        </div>
    `;
};

export { createTimetableEl };
