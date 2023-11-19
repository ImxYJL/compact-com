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

const inputElements = {
  lectureName: null,
  professor: null,
  lectureRoom: null,
  dayOfWeek: null,
  startHour: null,
  endHour: null,
  endMinute: null,
  backgroundColor: null,
};

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
  ];

  // 색상 그리드 생성
  colors.forEach((color) => {
    const colorDiv = document.createElement('div');
    colorDiv.classList.add('color');
    colorDiv.style.backgroundColor = color;
    colorDiv.addEventListener('click', () => {
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

  timetableMap.forEach((entry) => {
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

  if (isOverlapping) throw new Error('Time selection is incorrect.');
};

const isInputsEmpty = () => {
  if (
    inputElements.lectureName.value.trim() === 0 ||
    inputElements.professor.value.trim() === 0 ||
    inputElements.lectureRoom.value.trim() === 0 ||
    inputElements.color.style.backgroundColor === ''
  ) {
    throw new Error('Please enter texts.');
  }
};

const isTimeValid = (startHour, startMinute, endHour, endMinute) => {
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;

  if (
    startHour === '18' ||
    (endHour === '18' && endMinute === '30') ||
    startTime >= endTime
  ) {
    throw new Error('Time selection is incorrect.');
  }

  // 시작 시간이 6시거나, 종료 시간이 6시 반인 경우 시간표에 표시 불가능
  // 그 외는 아래 조건에서 걸러짐

  // return startTime < endTime;
};

const createLectureItem = (entryObj) => {
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

const setTableEntry = () => {
  const day =
    inputElements.dayOfWeek.options[inputElements.dayOfWeek.selectedIndex]
      .value;
  const startHour =
    inputElements.startHour[inputElements.startHour.selectedIndex].value;

  const startMinute =
    inputElements.startMinute.options[inputElements.startMinute.selectedIndex]
      .value;
  const endHour =
    inputElements.endHour.options[inputElements.endHour.selectedIndex].value;
  const endMinute =
    inputElements.endMinute.options[inputElements.endMinute.selectedIndex]
      .value;

  // 입력 공백 체크
  try {
    isInputsEmpty();
    isTimeValid(startHour, startMinute, endHour, endMinute);
    isTimeOverlapping(day, startHour, startMinute, endHour, endMinute);
  } catch (error) {
    throw error;
  }

  const key = entryIdCounter++; // 이거 밑에서 어케썼는지 확인
  const newEntry = {
    lectureName: inputElements.lectureName.value,
    professor: inputElements.professor.value,
    lectureRoom: inputElements.lectureRoom.value,
    week: inputElements.dayOfWeek.options[inputElements.dayOfWeek.selectedIndex]
      .value,
    startTime: [startHour, startMinute],
    endTime: [endHour, endMinute],
    color: inputElements.color.style.backgroundColor,
  };

  try {
    timetableMap.set(key, newEntry);
  } catch (error) {
    throw error;
  }
  alert('It has been saved.');

  inputElements.lectureName.value =
    inputElements.professor.value =
    inputElements.lectureRoom.value =
    inputElements.professor.value =
      '';

  return key;
};

const clickSaveBtn = () => {
  let key;
  try {
    key = setTableEntry();
  } catch (error) {
    alert(error.message);
  }
  addTimetableEntry(key);
};

const setTimetableElListeners = () => {
  const tableBodyEl = timetableEl.querySelector('tbody');
  const lectureListEl = timetableEl.querySelector('#side-content-1');
  const editEl = timetableEl.querySelector('#side-content-2');

  radioButtonList[0].addEventListener('click', () => {
    //lectureListEl.classList.toggle('hidden'); //하자임
    editEl.classList.add('hidden');
    lectureListEl.classList.remove('hidden');
    radioButtonList[1].checked = false;
  });
  radioButtonList[1].addEventListener('click', () => {
    lectureListEl.classList.add('hidden');
    editEl.classList.remove('hidden');
    radioButtonList[0].checked = false;
  });

  const saveBtn = timetableEl.querySelector('#timetable-save-btn');
  saveBtn.addEventListener('click', clickSaveBtn);
};

const createTableEntry = (
  day,
  backgroundColor,
  startHour,
  startMinute,
  endHour,
  endMinute,
) => {
  const tableEntry = document.createElement('div');
  tableEntry.classList.add('table-entry');
  tableEntry.style.backgroundColor = backgroundColor;

  const startCell = timetableEl.querySelector(`#${day}-${startHour - 9}`);
  const endCell = timetableEl.querySelector(`#${day}-${endHour - 9}`);

  // Set coordinates of the entry
  const cellRect = startCell.getBoundingClientRect();
  tableEntry.style.top = cellRect.top; // px 없어도 동작
  tableEntry.style.left = cellRect.left;

  if (startMinute === 30) tableEntry.style.top = '50%';
  if (endMinute === 30) endCell.style.borderBottom = 'display';

  const lectureMinutes =
    convertTimeToMinutes(endHour, endMinute) -
    convertTimeToMinutes(startHour, startMinute);
  const magnification = lectureMinutes / 30;
  tableEntry.style.height = `${50 * magnification}%`; // 여기서 height만 시간에 맞게 *n%배 해주면 됨

  startCell.appendChild(tableEntry);

  return tableEntry;
};

const createLectureNameEl = (lectureName) => {
  const lectureNameEl = document.createElement('p');
  lectureNameEl.classList.add('timetable-lecture-title');
  lectureNameEl.textContent = lectureName;

  return lectureNameEl;
};

// 외 ㅇㄴ됢
const createLectureRoomEl = (lectureRoom) => {
  const lectureRoomEl = document.createElement('p');
  lectureRoomEl.classList.add('timetable-lecture-room');
  lectureRoomEl.textContent = lectureRoom;

  return lectureRoomEl;
};

const addTimetableEntry = (key) => {
  // 맵에서 꺼내옴
  let entryObj = null;
  try {
    entryObj = timetableMap.get(key);
  } catch (error) {
    alert(error.message);
    return;
  }

  const lectureName = entryObj['lectureName'];
  const lectureRoom = entryObj['lectureRoom'];
  const day = entryObj['week'];
  const startHour = parseInt(entryObj['startTime'][0]);
  const startMinute = parseInt(entryObj['startTime'][1]);
  const endHour = parseInt(entryObj['endTime'][0]);
  const endMinute = parseInt(entryObj['endTime'][1]);
  const backgroundColor = entryObj['color'];

  const tableEntry = createTableEntry(
    day,
    backgroundColor,
    startHour,
    startMinute,
    endHour,
    endMinute,
  );

  const lectureNameEl = createLectureNameEl(lectureName);
  //lectureNameP.id = `${entryIdCounter++};`; // 임시 아이디
  tableEntry.appendChild(lectureNameEl);

  // const lectureRoomP = document.createElement('p');
  // lectureRoomP.classList.add('timetable-lecture-room');
  // lectureRoomP.textContent = lectureRoom;

  const lectureRoomEl = createLectureRoomEl(lectureRoom);
  tableEntry.appendChild(lectureRoomEl);

  //
  if (day === today) createLectureItem(entryObj);

  // 타이틀 누르면 엔트리 삭제
  // 근데 걍 부모노드 하면 않됨?
  lectureNameEl.addEventListener('click', (e) => {
    //console.log(e.target);
    //console.log(e.target.parentNode);
    e.target.parentNode.remove();
  });
};

const setInputElements = () => {
  inputElements.lectureName = timetableEl.querySelector('#lecture-name');
  inputElements.professor = timetableEl.querySelector('#lecture-professor');
  inputElements.lectureRoom = timetableEl.querySelector('#lecture-room');
  inputElements.dayOfWeek = timetableEl.querySelector('#lecture-week');
  inputElements.startHour = timetableEl.querySelector('#start-time .time-h');
  inputElements.startMinute = timetableEl.querySelector('#start-time .time-m');
  inputElements.endHour = timetableEl.querySelector('#end-time .time-h');
  inputElements.endMinute = timetableEl.querySelector('#end-time .time-m');
  inputElements.color = timetableEl.querySelector('#selected-color');
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

  setInputElements();
  setTimetableElListeners();

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
