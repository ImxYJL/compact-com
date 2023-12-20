import { createDraggable } from './utility/drag-event.js';
import { clickCloseBtn, clickWindowEl } from './utility/click-event.js';
import { createlifeQuoteEl } from './component/lifequote.js';
import { createClockEl, TIMERID } from './component/clock.js';
import { createTimetableEl } from './component/timetable.js';

// Desktop Element: to append a new tab
const desktop = document.querySelector('#desktop');

// Get Desktop Items
const lifequoteLabel = document.querySelector('#life-quote');
const clockLabel = document.querySelector('#clock');
const timetableLabel = document.querySelector('#timetable');

const OPEN_EL_LIST = new Set();

// Elements will be created by click label
let clockEl = null;
let quoteEl = null;
let timetableEl = null;

// Handlers for content (label) click
const clickQuoteLabel = async () => {
  // Make sure only one window is open
  if (desktop.contains(quoteEl)) return;

  quoteEl = await createlifeQuoteEl(); // timetable이랑 구조 달라서 그렇다
  setAllListenerForWindowEl(quoteEl);
  addWindowElToDesktop(quoteEl);
};

const clickClockLabel = () => {
  if (desktop.contains(clockEl)) return;

  clockEl = createClockEl();
  setAllListenerForWindowEl(clockEl);
  addWindowElToDesktop(clockEl);
};

const clickTimetableLabel = () => {
  if (desktop.contains(timetableEl)) return;

  timetableEl = createTimetableEl();
  setAllListenerForWindowEl(timetableEl);
  addWindowElToDesktop(timetableEl);
};

const setAllListenerForWindowEl = (elem) => {
  clickWindowEl(elem);
  clickCloseBtn(elem, TIMERID);
  createDraggable(elem);
};

const addWindowElToDesktop = (elem) => {
  desktop.append(elem);
  OPEN_EL_LIST.add(elem);
};

lifequoteLabel.addEventListener('click', clickQuoteLabel);
clockLabel.addEventListener('click', clickClockLabel);
timetableLabel.addEventListener('click', clickTimetableLabel);

export { OPEN_EL_LIST };
