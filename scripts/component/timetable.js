import { getDate } from '../utility/date.js';

let timetableEl = null;
let radioButtonList = null;
let lectureItemsEl = null;
let tableBodyEl = null;
let today = getDate()['day'];
//6시반 예외처리

let entryIdCounter = 1;
const timetableMap = new Map();
const lectureItemList = [];
const dayList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hourList = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];

const convertTimeToMinutes = (hour, minute) => {
    return parseInt(hour) * 60 + parseInt(minute);
};

const setTimeSelector = () => {
    const hourSelectorList = timetableEl.querySelectorAll('.time-h');

    hourSelectorList.forEach((hourSelector) => {
        hourList.forEach((hour) => {
            const row = document.createElement('option');
            row.textContent = hour;
            hourSelector.appendChild(row);
        });
    });
    // for (const hourSelector of hourSelectorList) {
    //     for (const time of hourList) {
    //         const row = document.createElement('option');
    //         row.textContent = time;
    //         hourSelector.appendChild(row);
    //     }
    // }
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

    hourList.forEach((hour) => {
        if (hour === 18) return;
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        timeCell.textContent = hour + ':00';
        timeCell.classList.add('time-cell');
        row.appendChild(timeCell);

        dayList.forEach((day) => {
            const cell = document.createElement('td');
            cell.id = `${day}-${hour - 9}`;

            row.appendChild(cell);
        });

        tbody.appendChild(row);
    });

    // for (const time of hourList) {
    //     const row = document.createElement('tr');
    //     const timeCell = document.createElement('td');
    //     timeCell.textContent = time + ':00';
    //     timeCell.classList.add('time-cell');
    //     row.appendChild(timeCell);

    //     dayList.forEach((day) => {
    //         const cell = document.createElement('td');
    //         cell.id = `td${day}-${time - 9}`;

    //         row.appendChild(cell);
    //     });

    // for (let i = 0; i < 5; i++) {
    //     const cell = document.createElement('td');
    //     cell.id = `td${i}-${time - 9}`;

    //     row.appendChild(cell);
    // }
    //}
};

const setLectureItemList = () => {
    // 처음에만 호출하기 (create에서)
    timetableMap.forEach((entry) => {
        if (entry.week === today) lectureItemList.push(entry);
    });
    //console.log(lectureItemList);
    lectureItemList.forEach((entry) => {
        createLectureItem(entry);
    });
};

const clickRadioBtn = (e) => {
    const lectureListEl = timetableEl.querySelector('#side-content-1');
    const editEl = timetableEl.querySelector('#side-content-2');

    lectureListEl.classList.toggle('hidden');
    editEl.classList.toggle('hidden');
};

const isTimeOverlapping = (day, startHour, startMinute, endHour, endMinute) => {
    const newStartMinutes = convertTimeToMinutes(startHour, startMinute);
    const newEndMinutes = convertTimeToMinutes(endHour, endMinute);
    let isOverlapping = false;

    timetableMap.forEach((entry, key) => {
        if (entry.week === day) {
            // 요일이 같은 경우에만 검사
            const [existingStartHour, existingStartMinute] = entry.startTime;
            const [existingEndHour, existingEndMinute] = entry.endTime;
            const existingStart = convertTimeToMinutes(
                existingStartHour,
                existingStartMinute,
            );
            const existingEnd = convertTimeToMinutes(
                existingEndHour,
                existingEndMinute,
            );

            // 새로운 요소의 시작 시간과 종료 시간이 기존 요소와 겹치는지 확인
            if (existingStart < newEndMinutes && newStartMinutes < existingEnd)
                isOverlapping = true;
        }
    });
    return isOverlapping; //forEach쓰면 리턴 안먹힘ㄷ
};

const isInputsEmpty = (
    lectureNameEl,
    professorEl,
    lectureRoomEl,
    selectedColorEl,
) => {
    return !(
        lectureNameEl.value.trim() === 0 ||
        professorEl.value.trim() === 0 ||
        lectureRoomEl.value.trim() === 0 ||
        selectedColorEl.style.backgroundColor === ''
    );
};

const isTimeValid = (startHour, startMinute, endHour, endMinute) => {
    //console.log(startHour);
    //console.log(typeof startHour); // string
    if (startHour === '18' || (endHour === '18' && endMinute === '30'))
        return false;
    // 시작 시간이 6시거나, 종료 시간이 6시 반인 경우 시간표에 표시 불가능
    // 그 외는 아래 조건에서 걸러짐

    //명시적 형변환 해주기 vs 태초에 숫자로 넣기
    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;
    console.log(startTime, endTime);
    return startTime < endTime;
};

const createLectureItem = (
    entryObj,
    // lectureName,
    // lectureRoom,
    // startHour,
    // startMinute,
    // endHour,
    // endMinute,
) => {
    //console.log(typeof endHour);
    const divider = document.createElement('label');
    divider.classList.add('divider');
    lectureItemsEl.appendChild(divider);

    const lectureItemEl = document.createElement('div');
    lectureItemEl.class = 'lecture-item';
    lectureItemEl.innerHTML = getInnerHtmlOfLectureItem();

    lectureItemEl.querySelector('.lecture-item-title').textContent =
        entryObj['lectureName'];
    lectureItemEl.querySelector('.lecture-item-time').textContent = `${
        entryObj['startTime'][0]
    }
        : ${entryObj['startTime'][1] === '0' ? '00' : entryObj['startTime'][1]} 
        ~${entryObj['endTime'][0]} : ${
            entryObj['endTime'][1] === '0' ? '00' : entryObj['endTime'][1]
        }`;
    lectureItemEl.querySelector('.lecture-item-place').textContent =
        entryObj['lectureRoom'];
    lectureItemsEl.appendChild(lectureItemEl);
    lectureItemsEl.appendChild(divider);
};

{
    /* <label class="lecture-item-title"></label>
            <label class="lecture-item-time"></label>
            <label class="lecture-item-place"></label> */
}

const createTableEntry = () => {
    const lectureNameEl = timetableEl.querySelector('#lecture-name');
    const professorEl = timetableEl.querySelector('#lecture-professor');
    const lectureRoomEl = timetableEl.querySelector('#lecture-room');
    const weekEl = timetableEl.querySelector('#lecture-week');
    const startHourEl = timetableEl.querySelector('#start-time .time-h');
    const startMinuteEl = timetableEl.querySelector('#start-time .time-m');
    const endHourEl = timetableEl.querySelector('#end-time .time-h');
    const endMinuteEl = timetableEl.querySelector('#end-time .time-m');
    const selectedColorEl = timetableEl.querySelector('#selected-color');

    const day = weekEl.options[weekEl.selectedIndex].value;
    const startHour = startHourEl.options[startHourEl.selectedIndex].value;
    const startMinute =
        startMinuteEl.options[startMinuteEl.selectedIndex].value;
    const endHour = endHourEl.options[endHourEl.selectedIndex].value;
    const endMinute = endMinuteEl.options[endMinuteEl.selectedIndex].value;

    // 입력 공백 체크
    if (
        !isInputsEmpty(
            lectureNameEl,
            professorEl,
            lectureRoomEl,
            selectedColorEl,
        )
    ) {
        alert('Please enter texts.');
        return;
    }

    // 시간 유효성 체크
    if (!isTimeValid(startHour, startMinute, endHour, endMinute)) {
        alert('Time selection is incorrect.');
        return;
    }

    if (isTimeOverlapping(day, startHour, startMinute, endHour, endMinute)) {
        alert('Time selection is incorrect.');
        return;
    }

    const key = entryIdCounter++; // 이거 밑에서 어케썼는지 확인
    const newEntry = {
        lectureName: lectureNameEl.value,
        professor: professorEl.value,
        lectureRoom: lectureRoomEl.value,
        week: weekEl.options[weekEl.selectedIndex].value,
        startTime: [startHour, startMinute], // H, M
        endTime: [endHour, endMinute],
        color: selectedColorEl.style.backgroundColor,
    };

    try {
        timetableMap.set(key, newEntry); // 백엔드에서는 시간 겹치면 실패 띄우기, 아니면 기존내용 지운다던가..
    } catch (err) {
        alert(`${err.name}: ${err.message}`);
        console.log(err);
        //alert(); // 겹치는 시간이 있어서 실패했다고 띄우기
    }

    alert('It has been saved.');
    lectureNameEl.value =
        professorEl.value =
        lectureRoomEl.value =
        professorEl.value =
            '';
    return key;
};

const clickSaveBtn = () => {
    //createNewEntry();
    addTimetableEntry(createTableEntry());
    // 여기서 백엔드 요청
};
const setTimetableElListeners = () => {
    const tableBodyEl = timetableEl.querySelector('tbody');
    const lectureListEl = timetableEl.querySelector('#side-content-1');
    const editEl = timetableEl.querySelector('#side-content-2');
    //const sideFuncList = timetableEl.querySelectorAll('.field-row input');

    //console.log(tableBodyEl);
    // tableBodyEl.addEventListener('click', (e) => {
    //     console.log(e.target);
    //     //console.log(e.target.parentNode);
    //     // if (tableBodyEl.contains()) {
    //     //     consoe;
    //     // }
    // });

    radioButtonList[0].addEventListener('click', () => {
        //lectureListEl.classList.toggle('hidden'); //하자임
        editEl.classList.add('hidden');
        lectureListEl.classList.remove('hidden');
        radioButtonList[1].checked = false;
    });
    radioButtonList[1].addEventListener('click', () => {
        //editEl.classList.toggle('hidden');
        lectureListEl.classList.add('hidden');
        editEl.classList.remove('hidden');
        radioButtonList[0].checked = false;
    });

    const saveBtn = timetableEl.querySelector('#timetable-save-btn');
    saveBtn.addEventListener('click', clickSaveBtn);
};

const addTimetableEntry = (key) => {
    // 맵에서 꺼내옴
    let entryObj = null;
    if (timetableMap.has(key)) {
        entryObj = timetableMap.get(key);
        console.log(entryObj);
    } else {
        alert('error');
        return;
    }

    // 그냥 저장할때 int 형변환해버릴까
    const lectureName = entryObj['lectureName'];
    const lectureRoom = entryObj['lectureRoom'];
    const day = entryObj['week'];
    const startHour = parseInt(entryObj['startTime'][0]);
    const startMinute = parseInt(entryObj['startTime'][1]);
    const endHour = parseInt(entryObj['endTime'][0]);
    const endMinute = parseInt(entryObj['endTime'][1]);
    const color = entryObj['color'];

    //console.log(day, startHour, startMinute, endHour, endMinute);

    //한 셀 넓이 구하는거 안먹힘 ㅋㅋ 아래 코드 바탕으로 구해야ㅗ함

    console.log(`#${day}-${endHour - 9}`);
    const startCell = timetableEl.querySelector(`#${day}-${startHour - 9}`);
    const endCell = timetableEl.querySelector(`#${day}-${endHour - 9}`);

    // Create a div element for the entry
    const tableEntry = document.createElement('div');
    // 이벤트리스너때문에 신중하게//
    tableEntry.classList.add('table-entry');
    tableEntry.style.backgroundColor = color; // 원하는 배경색으로 변경

    const cellRect = startCell.getBoundingClientRect();
    tableEntry.style.top = cellRect.top; // px 없어도 동작
    tableEntry.style.left = cellRect.left;

    if (startMinute === 30) tableEntry.style.top = '50%';

    // Add styling for the end cell if end time is 30 minutes
    if (endMinute === 30) endCell.style.borderBottom = 'display';

    const lectureMinutes =
        convertTimeToMinutes(endHour, endMinute) -
        convertTimeToMinutes(startHour, startMinute);
    // const lectureMinutes =
    //     endHour * 60 + endMinute - (startHour * 60 + startMinute);
    const magnification = lectureMinutes / 30;
    console.log(magnification);
    tableEntry.style.height = `${50 * magnification}%`; // 여기서 height만 시간에 맞게 *n%배 해주면 됨

    startCell.appendChild(tableEntry);

    const lectureNameP = document.createElement('p');
    lectureNameP.classList.add('timetable-lecture-title');
    lectureNameP.textContent = lectureName;
    //lectureNameP.id = `${entryIdCounter++};`; // 임시 아이디
    tableEntry.appendChild(lectureNameP);

    const lectureRoomP = document.createElement('p');
    lectureRoomP.classList.add('timetable-lecture-room');
    lectureRoomP.textContent = lectureRoom;

    tableEntry.appendChild(lectureRoomP);
    // createLectureItem(
    //     lectureName,
    //     lectureRoom,
    //     startHour,
    //     startMinute,
    //     endHour,
    //     endMinute,
    // );

    if (day === today) createLectureItem(entryObj);

    lectureNameP.addEventListener('click', (e) => {
        console.log(e.target);
        console.log(e.target.parentNode);
        e.target.parentNode.remove();
        //tableBodyEl.remove(e.target.parentNode); // 대참사
    });
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
    setLectureItemList();

    radioButtonList = timetableEl.querySelectorAll('.radiobtn');
    tableBodyEl = timetableEl.querySelector('tbody');
    lectureItemsEl = timetableEl.querySelector('#lecture-list');
    setTimetableElListeners();

    //console.log(today);

    // 월요일 9시~10시 반 추가
    // addTimetableEntry(0, 9, 30, 12, 30, '#768AB7');

    // addTimetableEntry(0, 13, 0, 14, 30, '#768AB7');

    // // 화요일 15시~18시 추가
    // addTimetableEntry(1, 16, 30, 18, 0, '#443B53');
    // //    addTimetableEntry(0, 12, 30, 14, 0, '#3C4458');

    //addTimetableEntry(2, 10, 0, 10, 30, '#3C4458');

    // addTimetableEntry(3, 10, 0, 12, 0, '#443B53');
    // addTimetableEntry(4, 10, 0, 18, 0, '#443B53');

    return timetableEl;
};

const getInnerHtmlOfLectureItem = () => {
    return `
        <label class="lecture-item-title"></label>
        <label class="lecture-item-time"></label>
        <label class="lecture-item-place"></label>
    `;
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
                                    <input id="radio13" class="radiobtn" type="radio" checked>
                                    <label for="radio13">Today's Lecture</label>
                                </div>
                                <div class="field-row">
                                    <input id="radio14" class="radiobtn" type="radio" name="fieldset-example2">
                                    <label for="radio14">Edit Timetable</label>
                                </div>
                            </fieldset>
                            <div id="side-content-container">
                                <div id="side-content-1" class="visible">
                                    <label class="sdie-content-title">Today's Lectures</label>
                                    <div id ="lecture-list">
                                        <label class="divider"></label>
                                    </div>
                                </div>
                                <div id="side-content-2" class="hidden">
                                <label class="sdie-content-title">Edit Timetable</label>
                                    <div id ="lecture-edit-container" >
                                        <label for="lecture-name">Lecture Name</label>
                                        <input id ="lecture-name" type="text"/>
                                        <label for="lecture-professor">Professor</label>
                                        <input id ="lecture-professor" type="text"/>
                                        <label for="lecture-room">Lecture Room</label>
                                        <input id ="lecture-room" type="text"/>
                                        <label for="lecture-week">Week</label>
                                            <select id="lecture-week">
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
                                            <div id="selected-color" class="selected-color"></div>
                                        </div>
                                        <button id ="timetable-save-btn">Save</button>
                                    </div>
                            </div>
                            </div>
                                
                    </div>
            </div>
        </div>
    `;
};

export { createTimetableEl };
