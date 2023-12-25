import api from '../utility/intercepter.js';
import { getDate } from '../utility/date.js';

const desktop = document.querySelector('#desktop');

let userId = '';

let lifeQuoteEl = null; // Life quote element (Root Element)
let tabListItems = null;
let contentBody = null;
let contextMenu = null;

let counter = 0;

let lifeQuoteMap = new Map();
const tabNameList = {
  todayQuote: "Today's Life Quote",
  edit: 'Edit',
  quoteList: 'Quote List',
  help: 'Help',
};

const isListTab = () => {
  return tabListItems[1].getAttribute('aria-selected') === 'true'
    ? true
    : false;
};

const setLifeQuoteContent = () => {
  contentBody.innerHTML = getInnerHtmlOfContentEl();

  if (lifeQuoteMap.size === 0) return;

  const keysArray = Array.from(lifeQuoteMap.keys());
  const randomIndex = Math.floor(Math.random() * keysArray.length);
  const randomKey = keysArray[randomIndex];

  const printTextEl = contentBody.querySelector('#lifequote-print');
  const textToPrint = lifeQuoteMap.get(randomKey).text;
  const authorToPrint = lifeQuoteMap.get(randomKey).author;

  printTextEl.textContent = textToPrint;
  printTextEl.insertAdjacentHTML('beforeend', `<br><br> - ${authorToPrint} -`);
  printTextEl.insertAdjacentHTML('afterend', `<br>`);
};

const clickEditInContextMenu = () => {
  const clickedRow = contentBody.querySelector('.highlighted');
  const selectedKey = Number(clickedRow.getAttribute('data-key'));

  tabListItems[1].setAttribute('aria-selected', 'false');
  tabListItems[2].setAttribute('aria-selected', 'true');

  setInputContent(selectedKey);
};

const deleteEntry = async (key) => {
  try {
    const response = await axios.delete(
      `http://localhost:3000/lifequote/${userId}/${key}`,
    );
  } catch (error) {
    console.error(error);
  }
};

const clickRemoveInContextMenu = () => {
  const clickedRow = contentBody.querySelector('.highlighted');
  const selectedKey = Number(clickedRow.getAttribute('data-key'));
  lifeQuoteMap.delete(selectedKey);

  deleteEntry(selectedKey);
  clickedRow.remove();
};

const clickLifeQuoteElWithContextMenu = () => {
  if (contextMenu !== null) contextMenu.remove();
};

const setContextMenuItem = () => {
  contextMenu.innerHTML = getInnerHtmlOfContextMenuEl();

  contextMenu
    .querySelector('#contextmenu-edit-li')
    .addEventListener('click', () => {
      clickEditInContextMenu();
      contextMenu.remove();
    });
  contextMenu
    .querySelector('#contextmenu-remove-li')
    .addEventListener('click', () => {
      clickRemoveInContextMenu();
      contextMenu.remove();
    });

  return contextMenu;
};

const getContextMenuPos = () => {
  const quoteTable = contentBody.querySelector('.sunken-panel');
  const clickedRow = contentBody.querySelector('.highlighted');

  contextMenu.style.left = quoteTable.getBoundingClientRect().left + 'px';
  contextMenu.style.top = clickedRow.getBoundingClientRect().bottom + 'px';
};

const setContextMenu = (e) => {
  e.preventDefault();

  // Create context menu
  contextMenu = document.createElement('div');
  contextMenu.id = 'context-menu';
  getContextMenuPos();

  desktop.appendChild(setContextMenuItem());
};

const dragLifeQuoteElWithContextMenu = () => {
  const clickedRow = contentBody.querySelector('.highlighted');

  // Not re-adjust contextMenu coordinates
  // if current tab is not quotelist or if no columns are selected
  if (!isListTab() || !clickedRow) return;
  getContextMenuPos();
};

const setTableEventListeners = () => {
  const fileListEl = contentBody.querySelector('#lifequote-filelist');
  const table = contentBody.querySelector('#lifequote-filelist-table');
  let highlighted = table.querySelector('.highlighted');

  const rightClickRow = (e) => {
    const clickedRow = e.target.parentElement;

    // Exit if contextMenu already exists or no column is selected
    if (document.querySelector('#context-menu') || !clickedRow) return;
    setContextMenu(e);
  };

  const clickRow = (e) => {
    // Check if there is already selected row
    if (highlighted) highlighted.classList.remove('highlighted');

    const clickedRow = e.target.parentElement;
    clickedRow.classList.add('highlighted');

    // Add right click event when normal click event occurs
    clickedRow.addEventListener('contextmenu', rightClickRow);
  };

  const clickQuoteListEl = (e) => {
    highlighted = table.querySelector('.highlighted'); // have to do this in real time

    if (highlighted && !table.contains(e.target)) {
      highlighted.classList.remove('highlighted');
    }
  };

  table.addEventListener('click', clickRow);
  fileListEl.addEventListener('click', clickQuoteListEl);

  // Add event listeners required when a context menu exists
  lifeQuoteEl.addEventListener('dragend', dragLifeQuoteElWithContextMenu);
  lifeQuoteEl.addEventListener('click', clickLifeQuoteElWithContextMenu);
};

// Check length of the text and readjust it if it exceeds the limit
const cutTextToPrint = (text, max) => {
  const check = text.length > max ? true : false;

  if (check) return text.slice(0, max) + '...';
  else return text;
};

const printQuoteMap = (key, item) => {
  const tBody = contentBody.querySelector('tbody');
  const row = tBody.insertRow();

  const lifeQuoteCell = row.insertCell(0);
  lifeQuoteCell.textContent = cutTextToPrint(item.text, 12);

  const authorCell = row.insertCell(1);
  authorCell.textContent = cutTextToPrint(item.author, 6);

  const dateCell = row.insertCell(2);
  dateCell.textContent = item.date;

  lifeQuoteCell.parentElement.setAttribute('data-key', key);
};

// Set default file list styles
const setFileListContent = async () => {
  contentBody.innerHTML = getInnerHtmlOfFileListEl();

  await fetchLifeQuoteData();

  lifeQuoteMap.forEach((item, key) => {
    printQuoteMap(key, item);
  });
  setTableEventListeners();
};

const fetchLifeQuoteData = async () => {
  let lifequoteData = null;
  try {
    const response = await api.get(`http://localhost:3000/lifequote/${userId}`);
    lifequoteData = response.data;
  } catch (error) {
    console.error(error);
  }

  counter = lifequoteData.counter;
  lifeQuoteMap = new Map(Object.entries(lifequoteData.lifequoteMap));

  return lifeQuoteMap;
};

// Create a new word item
const createQuote = async (selectedKey, textEl, authorEl) => {
  if (textEl.value.trim().length === 0 || authorEl.value.trim().length === 0) {
    textEl.value = authorEl.value = '';
    alert('Please enter texts.');
    return;
  }

  const key = selectedKey ? selectedKey : ++counter;
  const today = getDate();
  const newQuote = {
    key: key,
    text: textEl.value,
    author: authorEl.value,
    date: `${today.day}, ${today.month}/${today.date}/${today.year}`,
  };

  try {
    lifeQuoteMap.set(key, newQuote);
    await axios.put(`http://localhost:3000/lifequote/${userId}`, newQuote);
  } catch (err) {
    alert(`${err.name}: ${err.message}`);
    setInputContent();
  }

  alert('It has been saved.');
  textEl.value = authorEl.value = '';
};

const setInputContent = (selectedKey) => {
  contentBody.innerHTML = getInnerHtmlOfInputEl();

  const textEl = contentBody.querySelector('#lifequote-textarea');
  const authorEl = contentBody.querySelector('input');

  // Setting the contents of the row selected from fileList
  if (selectedKey) {
    textEl.value = lifeQuoteMap.get(selectedKey).text;
    authorEl.value = lifeQuoteMap.get(selectedKey).author;
  }

  const saveBtn = contentBody.querySelector('#lifequote-save-btn');
  const clearBtn = contentBody.querySelector('#lifequote-clear-btn');
  saveBtn.addEventListener('click', () => {
    createQuote(selectedKey, textEl, authorEl);
  });

  clearBtn.addEventListener('click', () => {
    textEl.value = authorEl.value = '';
  });
};

const setHelpContent = () => {
  contentBody.innerHTML = getInnerHtmlOfHelpEl();
};

const clickTab = (e) => {
  // Initialize the status of the all opened tabs
  tabListItems.forEach((item) => item.setAttribute('aria-selected', 'false'));

  // Change the clicked tab to selected state
  const clickedTab = e.currentTarget;
  clickedTab.setAttribute('aria-selected', 'true');

  const tabContent = clickedTab.querySelector('a').textContent.trim();
  switch (tabContent) {
    case tabNameList.todayQuote:
      setLifeQuoteContent();
      break;
    case tabNameList.edit:
      setInputContent();
      break;
    case tabNameList.quoteList:
      setFileListContent();
      break;
    case tabNameList.help:
      setHelpContent();
      break;
    default:
      contentBody.innerHTML = `<p>Error</p>`;
  }
};

const createlifeQuoteEl = async () => {
  lifeQuoteEl = document.createElement('div');
  lifeQuoteEl.id = 'lifequote-window';
  lifeQuoteEl.className = 'window';
  lifeQuoteEl.draggable = true;
  lifeQuoteEl.innerHTML = getInnerHtmlOfLifeQuoteEl();

  // Initialize some of the global variables
  userId = localStorage.getItem('userId');
  tabListItems = lifeQuoteEl.querySelectorAll('#lifequote-tablist li');
  contentBody = lifeQuoteEl.querySelector('#lifequote-body .window-body');

  await fetchLifeQuoteData();
  if (lifeQuoteMap.size > 0) setLifeQuoteContent();

  tabListItems.forEach((item) => {
    item.addEventListener('click', clickTab);
  });

  return lifeQuoteEl;
};

/* Functions to get each innerHtml  */
const getInnerHtmlOfLifeQuoteEl = () => {
  return `
        <div class="title-bar">
            <div class="title-bar-text">Life Quote</div>
            <div class="title-bar-controls">
                <button id ="close-btn" aria-label="Close"></button>
            </div>
        </div>
        <div id="lifequote-body" class="window-body">
            <ul id="lifequote-tablist" role="tablist">
                <li id="lifequote-main-tab" role="tab" aria-selected="true">
                    <a href="#tabs">Today's Life Quote </a>
                </li>
                <li id="lifequote-list-tab" role="tab"><a href="#tabs">Quote List</a></li>
                <li id="lifequote-edit-tab" role="tab"><a href="#tabs">Edit</a></li>
                <li id="lifequote-help-tab" role="tab"><a href="#tabs">Help</a></li>
            </ul>
            <div id="lifequote-content-body" class="window" role="tabpanel">
                <div class="window-body">
                    <div id="content-container">
                        <p id="lifequote-print">Please add a new quote.</p>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const getInnerHtmlOfContentEl = () => {
  return `
        <div id="content-container">
            <p id="lifequote-print">Please add a new quote.</p>
        </div>
    `;
};

const getInnerHtmlOfContextMenuEl = () => {
  return `
        <ul>
            <li id ='contextmenu-edit-li'>Edit</li>
            <li id ='contextmenu-remove-li'>Remove</li>
        </ul>
    `;
};

const getInnerHtmlOfInputEl = () => {
  return `
        <div>
            <div class="status-bar">
                <button id="lifequote-save-btn">🖫 SAVE</button> 
                <button id="lifequote-clear-btn">☒ CLEAR</button>
            </div>
            <div class="field-row">
                <label for="author">Author</label>
                <input id ="author" type="text"/>
            </div>
            <div class="field-row-stacked">
                <textarea id="lifequote-textarea"></textarea>
            </div>
            <div class="status-bar">
                <p class="status-bar-field">Press HELP for help</p>
                <p class="status-bar-field">Slide 3</p>
                <p class="status-bar-field">CPU Usage: 14%</p>
            </div>
        </div>
        `;
};

const getInnerHtmlOfFileListEl = () => {
  return `
        <div id ="lifequote-filelist" class="sunken-panel">
            <table id="lifequote-filelist-table" class="interactive">
                <thead>
                    <tr>
                        <th>Life Quote</th>
                        <th>Author</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        </div>
    `;
};

const getInnerHtmlOfHelpEl = () => {
  return `
        <div id="lifequote-help">
            <p>This is a help page.</p>
            <ul class="tree-view">
                <li>
                    Today's Life Quote
                    <ul>
                        <li>Prints registered sayings randomly.</li>
                    </ul>
                </li>
                <li>
                    Quote List
                        <ul>
                        <details>
                            <summary>Outline</summary>   
                            <ul>
                                <li>You can check registered quotes.</li>
                                <li>Only quotes of 12 characters or less and author of 6 characters or less are displayed.</li>
                            </ul>
                        </ul>
                        <ul>
                            <details>
                                <summary>Edit, Delete</summary>   
                                <ul>
                                    <li>First, click on the column you want to edit/delete.</li>
                                    <li>You can then right-click to edit/delete.</li>
                                </ul>
                            </details>
                        </ul>
                    </details>
                </li>
                <li>
                    Edit
                    <ul>
                        <li>You can add/edit quotes.</li>
                    </ul>
                </li>
            </ul>
        </div>
    `;
};

export { createlifeQuoteEl };
