import { getDate } from '../utility/date.js';
import api from '../utility/intercepter.js';

let userId = '';

let timetableEl = null;
let radioButtonList = null;
let lectureItemsEl = null;
let tableBodyEl = null;
let today = getDate()['day'];

let entryIdCounter = 0;

let timetableMap = new Map();

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
  color: null,
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
      createCell(null, `td-${day}-${hour - 9}`),
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
    setTableEntry(key);
  });
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

  /* Time can be expressed up to 18:00, 
    start time must be earlier than end time */
  if (
    startHour === 18 ||
    (endHour === 18 && endMinute === 30) ||
    startTime >= endTime
  ) {
    throw new Error('Time selection is incorrect.');
  }
};

const convertTimeToMinutes = (hour, minute) => {
  return Number(hour) * 60 + Number(minute);
};

const isTimeOverlapping = (day, startHour, startMinute, endHour, endMinute) => {
  const newStartMinutes = convertTimeToMinutes(startHour, startMinute);
  const newEndMinutes = convertTimeToMinutes(endHour, endMinute);
  let isOverlapping = false;

  timetableMap.forEach((entry) => {
    // Check if the day of the week is same as endtries already exist
    if (entry.day === day) {
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

      if (existingStart < newEndMinutes && newStartMinutes < existingEnd) {
        isOverlapping = true;
      }
    }
  });

  if (isOverlapping)
    throw new Error(
      'Time selection is incorrect. It overlaps with existing times.',
    );
};

const createDivider = () => {
  const divider = document.createElement('label');
  divider.classList.add('divider');

  return divider;
};

const formatTime = (entry) => {
  return `${entry['startTime'][0]} : ${formatMinute(entry['startTime'][1])} ~${
    entry['endTime'][0]
  } : ${formatMinute(entry['endTime'][1])}`;
};

const formatMinute = (minute) => {
  return minute === '0' ? '00' : minute;
};

const createLectureItemEl = (entry) => {
  const lectureItemEl = document.createElement('div');
  lectureItemEl.id = `${entry['day']}-${entry['lectureName']}`;
  lectureItemEl.class = 'lecture-item';
  lectureItemEl.innerHTML = getInnerHtmlOfLectureItem();

  lectureItemEl.querySelector('.lecture-item-title').textContent =
    entry['lectureName'];
  lectureItemEl.querySelector('.lecture-item-time').textContent =
    formatTime(entry);
  lectureItemEl.querySelector('.lecture-item-place').textContent =
    entry['lectureRoom'];

  return lectureItemEl;
};

const setLectureItem = (entry) => {
  const divider = createDivider();
  lectureItemsEl.appendChild(divider);

  const lectureItemEl = createLectureItemEl(entry);

  lectureItemEl.appendChild(divider);
  lectureItemsEl.appendChild(lectureItemEl);
};

const initInputValues = () => {
  inputElements.lectureName.value = '';
  inputElements.professor.value = '';
  inputElements.lectureRoom.value = '';
};

const isValidateInputs = () => {
  const { day, startHour, startMinute, endHour, endMinute } =
    getCurrentInputValues();

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
};

const getCurrentInputValues = () => {
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

  return { day, startHour, startMinute, endHour, endMinute };
};

const createTableEntryObj = () => {
  const { startHour, startMinute, endHour, endMinute } =
    getCurrentInputValues();

  const key = ++entryIdCounter;
  const newEntryObj = {
    key: key,
    lectureName: inputElements.lectureName.value,
    professor: inputElements.professor.value,
    lectureRoom: inputElements.lectureRoom.value,
    day: inputElements.dayOfWeek.options[inputElements.dayOfWeek.selectedIndex]
      .value,
    startTime: [startHour, startMinute],
    endTime: [endHour, endMinute],
    color: inputElements.color.style.backgroundColor,
  };

  return newEntryObj;
};

const sendEntryObj = async (newEntryObj) => {
  try {
    const response = await fetch(`http://localhost:3000/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEntryObj),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error('There has been a problem with your fetch operation:', error);
  }
};

const addEntryObj = () => {
  isValidateInputs();

  const newEntryObj = createTableEntryObj();
  try {
    timetableMap.set(newEntryObj.key, newEntryObj);

    axios.put(`http://localhost:3000/timetable/${userId}`, newEntryObj);
  } catch (error) {
    throw error;
  }

  alert('It has been saved.');
  initInputValues();

  return newEntryObj.key;
};

const clickSaveBtn = () => {
  let key;
  try {
    key = addEntryObj();
  } catch (error) {
    alert(error.message);
  }

  if (key !== null && key !== undefined) setTableEntry(key);
};

const setTimetableElListeners = () => {
  const contents = [
    {
      element: timetableEl.querySelector('#side-content-1'),
      myRadioButton: radioButtonList[0],
      otherRadioButton: radioButtonList[1],
    },
    {
      element: timetableEl.querySelector('#side-content-2'),
      myRadioButton: radioButtonList[1],
      otherRadioButton: radioButtonList[0],
    },
  ];

  contents.forEach((content) => {
    content.myRadioButton.addEventListener('click', () => {
      content.element.classList.remove('hidden');
      content.otherRadioButton.checked = false;
      contents
        .filter((con) => con !== content)
        .forEach((con) => con.element.classList.add('hidden'));
    });
  });

  const saveBtn = timetableEl.querySelector('#timetable-save-btn');
  saveBtn.addEventListener('click', clickSaveBtn);
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
  lectureRoomEl.classList.add('timetable-lecture-room');
  lectureRoomEl.textContent = lectureRoom;

  return lectureRoomEl;
};

const createTableEntryDiv = (key, entryObjValues) => {
  const tableEntry = document.createElement('div');
  tableEntry.id = `${entryObjValues.day}-${key}`;
  tableEntry.classList.add('table-entry');
  tableEntry.style.backgroundColor = entryObjValues.color;

  setTableEntryPosition(tableEntry, { ...entryObjValues });

  return tableEntry;
};

const setTableEntryPosition = (tableEntry, entryObjValues) => {
  const startCell = timetableEl.querySelector(
    `#td-${entryObjValues.day}-${entryObjValues.startHour - 9}`,
  );

  const lectureMinutes =
    convertTimeToMinutes(entryObjValues.endHour, entryObjValues.endMinute) -
    convertTimeToMinutes(entryObjValues.startHour, entryObjValues.startMinute);
  const magnification = lectureMinutes / 30;

  tableEntry.style.position = 'absolute';
  tableEntry.style.top = entryObjValues.startMinute === 30 ? '50%' : '0px';
  tableEntry.style.width = '100%';
  tableEntry.style.height = `${50 * magnification + 0.7 * magnification}%`; // 0.7: height correction value

  startCell.appendChild(tableEntry);
};

const getEntryObj = (key) => {
  let entryObj = null;
  try {
    entryObj = timetableMap.get(key);
  } catch (error) {
    alert(error.message);
    return;
  }

  return entryObj;
};

const getEntryObjValues = (entryObj) => {
  const { lectureName, lectureRoom, day, color } = entryObj;
  const [startHour, startMinute] = entryObj.startTime.map(Number);
  const [endHour, endMinute] = entryObj.endTime.map(Number);

  return {
    lectureName,
    lectureRoom,
    day,
    startHour,
    startMinute,
    endHour,
    endMinute,
    color,
  };
};

const removeTodayLecture = (entryObj) => {
  const todayLectureToRemove = lectureItemsEl.querySelector(
    `#${entryObj.day}-${entryObj.lectureName}`,
  );

  todayLectureToRemove.remove();
};

const deleteEntry = async (key) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/timetable/${userId}/${key}`,
    );
    console.log(response.data); // 서버로부터 온 응답을 출력합니다.
  } catch (error) {
    console.error(error); // 에러가 발생한 경우, 에러를 출력합니다.
  }
};

const setEntryRemoveListener = async (lectureNameEl, entryObj) => {
  lectureNameEl.addEventListener('click', (e) => {
    if (entryObj.day === today) removeTodayLecture({ ...entryObj });

    const tableEntryToRemove = e.target.parentNode;
    const idToRemove = tableEntryToRemove.id;
    const keyToRemove = Number(idToRemove.split('-')[1]);

    timetableMap.delete(keyToRemove);
    tableEntryToRemove.remove();
    deleteEntry(keyToRemove);
  });
};

const createTableEntry = (key, entryObj) => {
  const entryObjValues = getEntryObjValues({ ...entryObj });
  const newTableEntry = createTableEntryDiv(key, { ...entryObjValues });

  const lectureNameEl = createLectureNameEl(entryObjValues.lectureName);
  newTableEntry.appendChild(lectureNameEl);

  const lectureRoomEl = createLectureRoomEl(entryObjValues.lectureRoom);
  newTableEntry.appendChild(lectureRoomEl);

  setEntryRemoveListener(lectureNameEl, { ...entryObj });

  return newTableEntry;
};

const setTableEntry = (key) => {
  const entryObj = getEntryObj(key);
  if (!entryObj) return;

  createTableEntry(key, { ...entryObj });

  if (entryObj.day === today) setLectureItem({ ...entryObj });
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

const fetchTimetableData = async () => {
  let timetableData = null;
  try {
    const response = await api.get(`http://localhost:3000/timetable/${userId}`);
    timetableData = response.data;
  } catch (error) {
    alert('Data를 가져오는 데 실패했습니다. ERROR: ' + error);
  }

  entryIdCounter = timetableData.entryIdCounter;
  timetableMap = new Map(Object.entries(timetableData.timetableMap));

  return timetableData;
};

const setTimetableEl = async () => {
  radioButtonList = timetableEl.querySelectorAll('.radiobtn');
  tableBodyEl = timetableEl.querySelector('tbody');
  lectureItemsEl = timetableEl.querySelector('#lecture-list');

  userId = localStorage.getItem('userId');
  await fetchTimetableData();

  setTable();
  setColorPicker();
  setTimeSelector();
  setInputElements();
  setTimetableElListeners();
  setTableEntries();

  // (async () => {
  //   try {
  //     // 로컬 스토리지에서 토큰을 가져옵니다.
  //     const accessToken = sessionStorage.getItem('accessToken');
  //     // 토큰을 Authorization 헤더에 포함하여 요청을 보냅니다.
  //     const response = await api.post('http://localhost:3000/data', 'data', {
  //       headers: {
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     });

  //     // 응답을 처리합니다.
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error('에러:', error);
  //   }
  // })();
};

const createTimetableEl = () => {
  timetableEl = document.createElement('div');
  timetableEl.id = 'timetable-window';
  timetableEl.className = 'window';
  timetableEl.draggable = true;
  timetableEl.innerHTML = getInnerHtmlOfTimetableEl();

  setTimetableEl();

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
                                    <label for="radio14">Add Timetable Entry</label>
                                </div>
                            </fieldset>
                            <div id="side-content-container">
                                <div id="side-content-1" class="visible">
                                    <label class="side-content-title">Today's Lectures</label>
                                    <div id ="lecture-list">
                                        <label class="divider"></label>
                                    </div>
                                </div>
                                <div id="side-content-2" class="hidden">
                                <label class="side-content-title">Add Timetable Entry</label>
                                    <div id ="lecture-add-container" >
                                        <label for="lecture-name">Lecture Name</label>
                                        <input id ="lecture-name" type="text"/>
                                        <label for="lecture-professor">Professor</label>
                                        <input id ="lecture-professor" type="text"/>
                                        <label for="lecture-room">Lecture Room</label>
                                        <input id ="lecture-room" type="text"/>
                                        <label for="lecture-week">Day Of The Week</label>
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
