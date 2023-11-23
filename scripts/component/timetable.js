import { getDate } from '../utility/date.js';

let timetableEl = null;
let radioButtonList = null;
let lectureItemsEl = null;
let tableBodyEl = null;
let today = getDate()['day'];

let entryIdCounter = 1;

const timetableMap = new Map();
let lectureItemList = [];

const dayList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const hourList = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
const colorList = [
  '#768AB7',
  '#657BAE',
  '#3A4C74',
  '#3C4458',
  '#B0A2C8',
  '#8977AD',
  '#5A4E70',
  '#443B53',
];

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
  return Number(hour) * 60 + Number(minute);
};

const createCell = (text, id) => {
  const cell = document.createElement('td');
  if (text) cell.textContent = text;
  if (id) cell.id = id;

  return cell;
};

const appendCellsToRow = (row, cellList) => {
  cellList.forEach((cell) => row.appendChild(cell));

  return row;
};

const setTable = () => {
  hourList.forEach((hour) => {
    if (hour === 18) return;

    const row = document.createElement('tr');
    const timeCell = createCell(`${hour}:00`);
    timeCell.classList.add('time-cell');

    const dayCellList = dayList.map((day) =>
      createCell(null, `${day}-${hour - 9}`),
    );
    appendCellsToRow(row, [timeCell, ...dayCellList]);

    tableBodyEl.appendChild(row);
  });
};

const createOption = (content) => {
  const option = document.createElement('option');
  option.textContent = content;

  return option;
};

const setTimeSelector = () => {
  const hourSelectorList = timetableEl.querySelectorAll('.time-h');

  hourSelectorList.forEach((hourSelector) => {
    hourList
      .map((hour) => createOption(hour))
      .forEach((option) => hourSelector.appendChild(option));
  });
};

const setColorPicker = () => {
  const colorGrid = timetableEl.querySelector('.color-grid');
  const selectedColor = timetableEl.querySelector('.selected-color');

  const createColorEl = (color) => {
    const colorEl = document.createElement('div');
    colorEl.classList.add('color');
    colorEl.style.backgroundColor = color;
    colorEl.addEventListener('click', () => {
      selectedColor.style.backgroundColor = color;
    });

    return colorEl;
  };

  colorList
    .map(createColorEl)
    .forEach((colorEl) => colorGrid.appendChild(colorEl));
};

const setTableEntries = () => {
  timetableMap.forEach((_, key) => {
    addTimetableEntry(key);
  });
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
    inputElements.lectureName.value.trim() === '' ||
    inputElements.professor.value.trim() === '' ||
    inputElements.lectureRoom.value.trim() === '' ||
    inputElements.color.style.backgroundColor === ''
  ) {
    throw new Error('Please enter texts.');
  }
};

const isTimeValid = (startHour, startMinute, endHour, endMinute) => {
  const startTime = startHour * 60 + startMinute;
  const endTime = endHour * 60 + endMinute;

  if (
    startHour === 18 ||
    (endHour === 18 && endMinute === 30) ||
    startTime >= endTime
  ) {
    throw new Error('Time selection is incorrect.');
  }

  // 시작 시간이 6시거나, 종료 시간이 6시 반인 경우 시간표에 표시 불가능
  // 그 외는 아래 조건에서 걸러짐
};

const createLectureItem = (entryObj) => {
  const divider = document.createElement('label');
  divider.classList.add('divider');
  lectureItemsEl.appendChild(divider);

  const lectureItemEl = document.createElement('div');
  lectureItemEl.id = `${entryObj['week']}-${entryObj['lectureName']}`;

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

  lectureItemEl.appendChild(divider);
  lectureItemsEl.appendChild(lectureItemEl);
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

  try {
    isInputsEmpty();
    isTimeValid(
      Number(startHour),
      Number(startMinute),
      Number(endHour),
      Number(endMinute),
    );
    isTimeOverlapping(day, startHour, startMinute, endHour, endMinute);
  } catch (error) {
    throw error;
  }

  const key = entryIdCounter++;
  const newEntry = {
    key: key,
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

  console.log(key);

  if (key !== undefined) {
    addTimetableEntry(key);
  }
};

const setTimetableElListeners = () => {
  const lectureListEl = timetableEl.querySelector('#side-content-1');
  const editEl = timetableEl.querySelector('#side-content-2');

  radioButtonList[0].addEventListener('click', () => {
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
  key,
  day,
  backgroundColor,
  startHour,
  startMinute,
  endHour,
  endMinute,
) => {
  const tableEntry = document.createElement('div');
  tableEntry.id = `${day}-${key}`;
  tableEntry.classList.add('table-entry');
  tableEntry.style.backgroundColor = backgroundColor;

  const startCell = timetableEl.querySelector(`#${day}-${startHour - 9}`);
  const endCell = timetableEl.querySelector(`#${day}-${endHour - 9}`);

  // Set coordinates of the entry
  const cellRect = startCell.getBoundingClientRect();
  tableEntry.style.position = 'absolute';
  tableEntry.style.width = '100%';
  tableEntry.style.height = '100%'; // 반이면 50, 풀이면 100

  tableEntry.style.top = '0px'; //`${cellRect.top}px`; //abs이므로 정시시작이라면 항상 0이어야 함
  //tableEntry.style.bottom = `${endCell.getBoundingClientRect().bottom}px`;
  // tableEntry.style.left = `${cellRect.left}px`; // 여기서는 left 없는게 정상작동이네..

  if (startMinute === 30) tableEntry.style.top = '50%';
  // if (endMinute === 30) endCell.style.borderBottom = 'display';
  // if (startMinute === 30) tableEntry.style.top = '50%';
  // if (endMinute === 30) endCell.style.borderBottom = 'display';

  const lectureMinutes =
    convertTimeToMinutes(endHour, endMinute) -
    convertTimeToMinutes(startHour, startMinute);
  const magnification = lectureMinutes / 30;
  tableEntry.style.height = `${50 * magnification + 0.8 * magnification}%`; // 여기서 height만 시간에 맞게 *n%배 해주면 됨

  startCell.appendChild(tableEntry);

  return tableEntry;
};

const createLectureNameEl = (lectureName) => {
  const lectureNameEl = document.createElement('p');
  lectureNameEl.classList.add('timetable-lecture-title');
  lectureNameEl.style.fontSize = '1em';
  lectureNameEl.textContent = lectureName;

  return lectureNameEl;
};

const createLectureRoomEl = (lectureRoom) => {
  const lectureRoomEl = document.createElement('p');
  lectureRoomEl.style.fontSize = '0.7em';
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
  const startHour = Number(entryObj['startTime'][0]);
  const startMinute = Number(entryObj['startTime'][1]);
  const endHour = Number(entryObj['endTime'][0]);
  const endMinute = Number(entryObj['endTime'][1]);
  const backgroundColor = entryObj['color'];

  const tableEntry = createTableEntry(
    key,
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

  const lectureRoomEl = createLectureRoomEl(lectureRoom);
  tableEntry.appendChild(lectureRoomEl);

  //
  if (day === today) createLectureItem(entryObj);

  // 타이틀 누르면 엔트리 삭제
  lectureNameEl.addEventListener('click', (e) => {
    const tableEntryToRemove = e.target.parentNode;
    const removeId = tableEntryToRemove.id;
    const keyToRemove = Number(removeId.split('-')[1]);

    if (day === today) {
      const todayLectureToRemove = lectureItemsEl.querySelector(
        `#${day}-${lectureName}`,
      );

      const tmp = timetableMap.get(keyToRemove);
      const index = lectureItemList.findIndex((obj) => obj === tmp);
      if (index !== -1) lectureItemList.splice(index, 1);
      todayLectureToRemove.remove();
    }
    timetableMap.delete(keyToRemove);
    tableEntryToRemove.remove();
  });
};

// 아이디 겹치는거 삭제요망

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

  radioButtonList = timetableEl.querySelectorAll('.radiobtn');
  tableBodyEl = timetableEl.querySelector('tbody');
  lectureItemsEl = timetableEl.querySelector('#lecture-list');

  setTable();
  setColorPicker();
  setTimeSelector();
  setInputElements();
  setTimetableElListeners();
  // setLectureItemList(); // setTableEntries에서 호출해서 필요x
  setTableEntries();

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
                                        <div id="start-time"class="time-row">
                                            <label>Start Time</label>
                                            <select class ="time-h"></select>
                                            <select class="time-m">
                                                <option>00</option>
                                                <option>30</option>
                                            </select>
                                        </div>
                                        <div id="end-time" class="time-row">
                                            <label>End Time</label>
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
