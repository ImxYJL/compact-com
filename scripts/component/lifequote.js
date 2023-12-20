import { getDate } from '../utility/date.js';

const desktop = document.querySelector('#desktop');
let lifeQuoteEl = null; // Life quote element (Root Element)
let tabListItems = null;
let contentBody = null;
let contextMenu = null;

let counter = 1;

const lifeQuoteMap = new Map();
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
  //printTextEl.innerHTML = textToPrint.replace(/\n/g, '<br>');  // 줄바꿈 문자(\n)를 HTML 줄바꿈 태그(<br>)로 변환
  printTextEl.insertAdjacentHTML('beforeend', `<br><br> - ${authorToPrint} -`);
  printTextEl.insertAdjacentHTML('afterend', `<br>`);
};

const clickEditInContextMenu = () => {
  const clickedRow = contentBody.querySelector('.highlighted');
  const selectedKey = parseInt(clickedRow.getAttribute('data-key'));

  tabListItems[1].setAttribute('aria-selected', 'false');
  tabListItems[2].setAttribute('aria-selected', 'true');

  setInputContent(selectedKey);
};

const clickRemoveInContextMenu = () => {
  const clickedRow = contentBody.querySelector('.highlighted');
  const selectedKey = parseInt(clickedRow.getAttribute('data-key'));
  lifeQuoteMap.delete(selectedKey);
  clickedRow.remove(); // 표에서 클릭된 행을 삭제
  //console.log(`키 값 ${keyToDelete}을 가진 항목이 삭제되었습니다.`);
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

  //contentBody.append(setContextMenuItem()); // 안됨
  desktop.appendChild(setContextMenuItem());
};

const dragLifeQuoteElWithContextMenu = () => {
  console.log('드래그메뉴');
  const clickedRow = contentBody.querySelector('.highlighted');
  // Not re-adjust contextMenu coordinates
  // if current tab is not quotelist or if no columns are selected
  if (!isListTab() || !clickedRow) return;
  getContextMenuPos();
};

const setTableEventListeners = () => {
  // 요소마다 핸들러를 할당하지 않고, 요소의 공통 조상에
  // 이벤트 핸들러를 하나만 할당해도 여러 요소를 한꺼번에 다룰 수 있다.
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

    if (highlighted && !table.contains(e.target))
      highlighted.classList.remove('highlighted');
  };

  // table.addEventListener('click', (e) => {
  //   console.log('tableclicktest');
  //   // Check if there is already selected row
  //   if (highlighted) highlighted.classList.remove('highlighted');

  //   const clickedRow = e.target.parentElement;
  //   clickedRow.classList.add('highlighted');

  //   // Add right click event when normal click event occurs
  //   clickedRow.addEventListener('contextmenu', rightClickRow);
  // });
  table.addEventListener('click', clickRow);
  fileListEl.addEventListener('click', clickQuoteListEl);
  //마지막은 처음에 desktop, El에 달았는데 얘네는 초기화가 따로 안돼서 계속 리스너 중첩됨
  //얘랑 드래그 이벤트랑 아예 createElement할 때 리스너 붙여주고 변수들은 외부로 빼야하나

  // Add event listeners required when a context menu exists
  // lifeQuoteEl.addEventListener('dragend', () => {
  //   console.log('드래그메뉴');
  //   const clickedRow = contentBody.querySelector('.highlighted');
  //   // Not re-adjust contextMenu coordinates
  //   // if current tab is not quotelist or if no columns are selected
  //   if (!isListTab() || !clickedRow) return;
  //   getContextMenuPos();
  // });
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

  //tr에 속성붙여
  lifeQuoteCell.parentElement.setAttribute('data-key', key);
};

// Set default file list styles
const setFileListContent = () => {
  contentBody.innerHTML = getInnerHtmlOfFileListEl();

  lifeQuoteMap.forEach((item, key) => {
    printQuoteMap(key, item);
  });
  setTableEventListeners();
};

// Create a new word item
const createQuote = (selectedKey, textEl, authorEl) => {
  // 입력창 비었는지 확인하는거 유틸로 빼도 될듯
  if (textEl.value.trim().length === 0 || authorEl.value.trim().length === 0) {
    textEl.value = authorEl.value = '';
    alert('Please enter texts.');
    return;
  }

  const key = selectedKey ? selectedKey : counter++;
  const today = getDate();
  const newQuote = {
    text: textEl.value,
    author: authorEl.value,
    date: `${today.day}, ${today.month}/${today.date}/${today.year}`,
  };

  try {
    lifeQuoteMap.set(key, newQuote);
  } catch (err) {
    alert(`${err.name}: ${err.message}`);
    setInputContent();
  }

  alert('It has been saved.');
  textEl.value = authorEl.value = '';
};

// 입력창 세팅
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

// 각 탭을 클릭할 때 실행될 함수
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

const createlifeQuoteEl = () => {
  // 이 생성 부분도 유틸로 빼면 좋을듯 다 똑같아서
  lifeQuoteEl = document.createElement('div');
  lifeQuoteEl.id = 'lifequote-window';
  lifeQuoteEl.className = 'window';
  lifeQuoteEl.draggable = true;
  lifeQuoteEl.innerHTML = getInnerHtmlOfLifeQuoteEl();

  // Initialize some of the global variables
  tabListItems = lifeQuoteEl.querySelectorAll('#lifequote-tablist li');
  contentBody = lifeQuoteEl.querySelector('#lifequote-body .window-body');

  tabListItems.forEach((item) => {
    item.addEventListener('click', clickTab);
  });
  return lifeQuoteEl;
};

/* Functions to get each innerHtml  */

// 전체 엘리먼트
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
            <p>도움말 페이지입니다.</p>
            <ul class="tree-view">
                <li>
                    Today's Life Quote
                    <ul>
                        <li>등록된 명언을 랜덤으로 출력합니다.</li>
                    </ul>
                </li>
                <li>
                    Quote List
                        <ul>
                        <details>
                            <summary>개요</summary>   
                            <ul>
                                <li>등록된 명언들을 확인할 수 있습니다.</li>
                                <li>명언 12자 이하, 작가 6자 이하까지만 표시합니다.</li>
                            </ul>
                        </ul>
                        <ul>
                            <details>
                                <summary>수정, 삭제</summary>   
                                <ul>
                                    <li>먼저 수정/삭제할 열을 클릭합니다.</li>
                                    <li>이후 마우스 우클릭을 하면 수정/삭제할 수 있습니다.</li>
                                </ul>
                            </details>
                        </ul>
                    </details>
                </li>
                <li>
                    Edit
                    <ul>
                        <li>명언을 추가/수정할 수 있습니다.</li>
                    </ul>
                </li>
            </ul>
        </div>
    `;
};

export { createlifeQuoteEl };
