let timetableEl = null;
//6시반 예외처리

const hourList = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

const setTimeSelector = () => {
    const hourSelectorList = timetableEl.querySelectorAll('.time-h');

    for (const hourSelector of hourSelectorList) {
        for (const time of hourList) {
            const row = document.createElement('option');
            row.textContent = time;
            hourSelector.appendChild(row);
        }
    }
};

const setColorPicker = () => {
    const colorGrid = timetableEl.querySelector('.color-grid');
    const selectedColor = timetableEl.querySelector('.selected-color');

    const colors = [
        '#FF0000',
        '#FF7F00',
        '#FFFF00',
        '#00FF00',
        '#0000FF',
        '#8B00FF',
        '#FF00FF',
        '#000000',
        // 다른 원하는 색상을 추가할 수 있습니다.
    ];

    // 색상 그리드 생성
    colors.forEach((color) => {
        const colorDiv = document.createElement('div');
        colorDiv.classList.add('color');
        colorDiv.style.backgroundColor = color;
        colorDiv.addEventListener('click', () => {
            //e.target.style.border = '0.1em solid #000000';
            selectedColor.style.backgroundColor = color;
        });
        colorGrid.appendChild(colorDiv);
    });
};

const setTable = () => {
    const tbody = timetableEl.querySelector('tbody');

    for (const time of hourList) {
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        timeCell.textContent = time + ':00';
        row.appendChild(timeCell);

        for (let i = 0; i < 5; i++) {
            const cell = document.createElement('td');
            cell.id = `td${i}-${time - 9}`;
            row.appendChild(cell);
        }

        tbody.appendChild(row);
    }
};

const clickRadioBtn = () => {
    const lectureListEl = timetableEl.querySelector('#side-content-1');
    const editEl = timetableEl.querySelector('#side-content-2');
    lectureListEl.classList.toggle('hidden');
    editEl.classList.toggle('hidden');
};

const setTimetableElListeners = () => {
    // const lectureListEl = timetableEl.querySelector('#side-content-1');
    // const editEl = timetableEl.querySelector('#side-content-2');
    const sideFuncList = timetableEl.querySelectorAll('.field-row input');
    sideFuncList[0].addEventListener('click', clickRadioBtn);
    sideFuncList[1].addEventListener('click', clickRadioBtn);
};

const addTimetableEntry = (
    day,
    startHour,
    startMinute,
    endHour,
    endMinute,
    color,
) => {
    // ㅇ이디: 쿼리셀렉터에서 digit으로 시작하면 찾을 수 없음
    const startCell = timetableEl.querySelector(`#td${day}-${startHour - 9}`);
    const endCell = timetableEl.querySelector(`#td${day}-${endHour - 9}`);

    const cellRect = endCell.getBoundingClientRect();

    const relativeX = cellRect.left; // X 좌표
    const relativeY = cellRect.top; // Y 좌표
    console.log(relativeX, relativeY);

    const absoluteY = cellRect.top + window.scrollY;
    console.log(absoluteY);
    startMinute == 30
        ? startCell.classList.add('second-half')
        : startCell.classList.add('first-half');

    if (startMinute == 30) {
        startCell.style.borderBottom = 'none';
    }

    if (endMinute == 30) {
        endCell.classList.add('first-half');
    }

    // 이 부분에서 startCell과 endCell 사이에 스타일을 적용합니다.
    const startRowIndex = hourList.indexOf(startHour);
    const endRowIndex = hourList.indexOf(endHour);

    for (let i = startRowIndex + 1; i < endRowIndex; i++) {
        const cell = timetableEl.querySelector(`#td${day}-${i}`);
        cell.classList.add('first-half', 'second-half');
        cell.style.borderTopColor = color;
        cell.style.borderBottomColor = color;
        //cell.classList.add('second-half');
    }

    // 배경색을 동적으로 변경
    const firstHalfStyle = document.createElement('style');
    firstHalfStyle.innerHTML = `
        .first-half::before {
            background-color: ${color};
        }
    `;
    document.head.appendChild(firstHalfStyle);

    const secondHalfStyle = document.createElement('style');
    secondHalfStyle.innerHTML = `
        .second-half::after {
            background-color: ${color};
        }
    `;
    document.head.appendChild(secondHalfStyle);
};

const createTimetableEl = () => {
    timetableEl = document.createElement('div');
    timetableEl.id = 'timetable-window';
    timetableEl.className = 'window';
    timetableEl.draggable = true;
    timetableEl.innerHTML = getInnerHtmlOfTimetableEl();
    setTable();
    setColorPicker();
    setTimeSelector();

    setTimetableElListeners();

    // 월요일 9시~10시 반 추가
    addTimetableEntry(0, 9, 30, 12, 30, '#ede0de');

    // 화요일 15시~18시 추가
    addTimetableEntry(1, 16, 30, 18, 0, '#ede0de');

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
                                    <input id="radio13" type="radio" checked>
                                    <label for="radio13">Today's Lecture</label>
                                </div>
                                <div class="field-row">
                                    <input id="radio14" type="radio" name="fieldset-example2">
                                    <label for="radio14">Edit Timetable</label>
                                </div>
                            </fieldset>
                            <div id="side-content-container">
                                <div id="side-content-1" class="visible">
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
                                <div id="side-content-2" class="hidden">
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
                                                <option>Monday</option>
                                                <option>Tuesday</option>
                                                <option>Wednesday</option>
                                                <option>Thursday</option>
                                                <option>Friday</option>
                                            </select>
                                        <label for="lecture-time">Time</label>
                                        <div id="start-time"class="time-row">
                                            <select class ="time-h"></select>
                                            <select class="time-m">
                                                <option>00</option>
                                                <option>30</option>
                                            </select>
                                        </div>
                                        <div id="end-time" class="time-row">
                                            <select class ="time-h"></select>
                                            <select class="time-m">
                                                <option>00</option>
                                                <option>30</option>
                                            </select>
                                        </div>
                                        <label for="lecture-color">Color</label>
                                        <div class="color-picker">
                                            <div class="color-grid"></div>
                                            <div class="selected-color"></div>
                                        </div>
                                        <button>Save</button>
                                    </div>
                            </div>
                            </div>
                                
                    </div>
            </div>
        </div>
    `;
};

export { createTimetableEl };
