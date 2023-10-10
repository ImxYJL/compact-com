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
        '#768AB7',
        '#657BAE',
        '#3A4C74',
        '#3C4458',
        '#B0A2C8',
        '#8977AD',
        '#5A4E70',
        '#443B53',
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
    //한 셀 넓이 구하는거 안먹힘 ㅋㅋ 아래 코드 바탕으로 구해야ㅗ함

    const startCell = timetableEl.querySelector(`#td${day}-${startHour - 9}`);
    const endCell = timetableEl.querySelector(`#td${day}-${endHour - 9}`);
    const colorId = color.substr(1, 6); // # 제거

    // Create a div element for the entry
    const entry = document.createElement('div');
    entry.textContent = 'Your Entry Text'; // 원하는 텍스트 추가
    entry.style.position = 'absolute';
    // entry.style.top = '0';
    // entry.style.left = '0';
    entry.style.width = '100%';
    entry.style.height = '50%'; // 셀 높이와 너비를 가득 채우도록 조절
    //100퍼로 바꾸면 한칸이네

    entry.style.backgroundColor = color; // 원하는 배경색으로 변경
    entry.style.color = 'white'; // 텍스트 색상
    // entry.style.overflow = 'hidden';
    // entry.style.textOverflow = 'ellipsis';
    entry.style.whiteSpace = 'nowrap';
    //entry.style.display = ''; // ㅎ나마나 상관없는듯

    const cellRect = startCell.getBoundingClientRect();
    // setTimeout(() => { // 시간 지나도 0임
    //     console.log(cellRect);
    // }, 5000);

    entry.style.top = `${cellRect.top}px`; // px 없어도 동작
    //console.log(entry.style.top);
    entry.style.left = `${cellRect.left}px`;
    // console.log(`${cellRect.left}px`);

    if (startMinute === 30) {
        entry.style.top = '50%';
    }

    const M = endHour * 60 + endMinute - (startHour * 60 + startMinute);
    const a = M / 30;
    entry.style.height = `${50 * a}%`;
    // 여기서 height만 시간에 맞게 *n%배 해주면 됨

    // const endCellRect = endCell.getBoundingClientRect();
    // entry.style.bottom = `${endCellRect.top}px`;
    // // console.log(entry.style.top);
    // // console.log(endCellRect.top);
    // // console.log(endCell);
    // const height = `${entry.style.top - endCellRect.top}px`;
    // entry.style.height = height;

    // console.log(entry.style.top); //50퍼 ㅋㅋㅋㅋ

    // // Calculate the height of the cell based on start and end minutes
    // const cellHeight = (endHour - startHour) * 60 + (endMinute - startMinute);
    // entry.style.height = `${cellHeight}px`;

    // // Calculate the top offset for the entry based on start time
    // const topOffset =
    //     (startHour - 9) * 60 + startMinute + (startMinute === 30 ? 15 : 0);
    // entry.style.top = `${topOffset}px`;
    // console.log(topOffset);

    // // Calculate the bottom offset for the entry based on end time
    // const bottomOffset =
    //     (endHour - 9) * 60 + endMinute + (endMinute === 30 ? 15 : 0);
    // entry.style.bottom = `${cellHeight - bottomOffset}px`;

    // Append the entry to the startCell
    startCell.appendChild(entry);

    // Add a class for additional styling if needed
    entry.classList.add(`c${colorId}-entry`);

    // Add styling for the end cell if end time is 30 minutes
    if (endMinute === 30) {
        endCell.style.borderBottom = 'display';
    }
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
    addTimetableEntry(0, 9, 30, 12, 30, '#768AB7');

    addTimetableEntry(0, 13, 0, 14, 30, '#768AB7');

    // 화요일 15시~18시 추가
    addTimetableEntry(1, 16, 30, 18, 0, '#443B53');
    //    addTimetableEntry(0, 12, 30, 14, 0, '#3C4458');

    addTimetableEntry(3, 10, 0, 12, 0, '#443B53');
    addTimetableEntry(4, 10, 0, 18, 0, '#443B53');

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
