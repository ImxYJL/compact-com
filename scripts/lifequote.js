import { getDate } from './utility/date.js';

// HTML 요소 선택
const desktop = document.querySelector('#desktop');
let tabListItems = null;
let contentBody = null;
let lifeQuoteEl = null; // Life quote element (Root Element)
let contextMenu = null;

let counter = 1;
const lifeQuoteMap = new Map();

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

    // 줄바꿈 문자(\n)을 HTML 줄바꿈 태그(<br>)로 변환하여 출력합니다.
    printTextEl.innerHTML =
        textToPrint.replace(/\n/g, '<br>') + ` - ${authorToPrint} -`;
    // printTextEl.textContent = `${textToPrint}`;
};

const clickContextMenuItem = (e) => {
    const clickedRow = contentBody.querySelector('.highlighted');
    //console.log(clickedRow);
    const clickedKey = parseInt(clickedRow.getAttribute('data-key'));
    //console.log(clickedKey);

    if (e.target.id === 'contextmenu-edit-li') {
        // 리스트 탭의 선택 상태를 초기화하고 edit 탭으로 넘어감
        tabListItems[1].setAttribute('aria-selected', 'false');
        tabListItems[2].setAttribute('aria-selected', 'true');
        setInputContent(clickedKey);
    } else {
        //if (clickedKey !== -1)
        lifeQuoteMap.delete(clickedKey);
        clickedRow.remove(); // 표에서 클릭된 행을 삭제
        //console.log(`키 값 ${keyToDelete}을 가진 항목이 삭제되었습니다.`);
    }
    console.log(e.target.parentElement.parentElement);
    e.target.parentElement.remove();
};

const clickEditContextMenu = () => {
    const clickedRow = contentBody.querySelector('.highlighted');
    const clickedKey = parseInt(clickedRow.getAttribute('data-key'));
    tabListItems[1].setAttribute('aria-selected', 'false');
    tabListItems[2].setAttribute('aria-selected', 'true');
    setInputContent(clickedKey);
};

const clickRemoveContextMenu = () => {
    const clickedRow = contentBody.querySelector('.highlighted');
    const clickedKey = parseInt(clickedRow.getAttribute('data-key'));
    lifeQuoteMap.delete(clickedKey);
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
            clickEditContextMenu();
            contextMenu.remove();
        });
    contextMenu
        .querySelector('#contextmenu-remove-li')
        .addEventListener('click', () => {
            clickRemoveContextMenu();
            contextMenu.remove();
        });

    return contextMenu;
};

const getContextMenuPos = () => {
    contextMenu.classList.add('hidden');
    const quoteTable = contentBody.querySelector('.sunken-panel');
    const clickedRow = contentBody.querySelector('.highlighted');

    contextMenu.style.left = quoteTable.getBoundingClientRect().left + 'px';
    contextMenu.style.top = clickedRow.getBoundingClientRect().bottom + 'px';
    contextMenu.classList.remove('hidden');
};

const setContextMenu = (e) => {
    e.preventDefault();

    // 이미 메뉴가 존재하거나 선택된 열이 없으면 종료
    const clickedRow = e.target.parentElement;
    if (document.querySelector('#context-menu') || !clickedRow) return;

    // context menu 제작
    contextMenu = document.createElement('div');
    contextMenu.id = 'context-menu';
    getContextMenuPos();

    //contentBody.append(setContextMenuItem(contextMenu)); // 안됨
    desktop.append(setContextMenuItem());
};

const dragLifeQuoteElWithContextMenu = () => {
    console.log('ㅇ래');
    const clickedRow = contentBody.querySelector('.highlighted');
    // Quotelist가 아닌 다른 탭에 있거나 선택된 열이 없으면 contextMenu 좌표 재조정하지 않음
    if (!isListTab() || !clickedRow) return;
    getContextMenuPos();
};

const setTableEventListeners = () => {
    // 요소마다 핸들러를 할당하지 않고, 요소의 공통 조상에
    // 이벤트 핸들러를 하나만 할당해도 여러 요소를 한꺼번에 다룰 수 있다.
    const fileListEl = contentBody.querySelector('#lifequote-filelist');
    const table = contentBody.querySelector('.interactive');
    let highlighted = table.querySelector('.highlighted');
    //테이블에도 id 달아줘야하남..

    const rightClickRow = (e) => {
        const tr = contentBody.querySelector('tr');
        if (tr.contains(e.target)) return;
        setContextMenu(e);
    };
    const clickRow = (e) => {
        // 선택됐던 열 있는지 확인한 뒤 있다면 하이라이트 제거
        if (highlighted) highlighted.classList.remove('highlighted');
        console.log('clickedRow');

        // 새로 선택된 요소에 하이라이트
        const clickedRow = e.target.parentElement;
        clickedRow.classList.add('highlighted');

        // 클릭 이벤트가 일어났을 때 우측 클릭 이벤트 달기
        clickedRow.addEventListener('contextmenu', rightClickRow);
    };

    const clickQuoteListEl = (e) => {
        highlighted = table.querySelector('.highlighted');
        // 있을 때도 있고 없을 때도 있으므로 실시간으로 가져와야 함!

        if (highlighted && !table.contains(e.target))
            highlighted.classList.remove('highlighted');
    };

    table.addEventListener('click', clickRow);
    fileListEl.addEventListener('click', clickQuoteListEl);
    //마지막은 처음에 desktop, El에 달았는데 얘네는 초기화가 따로 안돼서 계속 리스너 중첩됨
    //얘랑 드래그 이벤트랑 아예 createElement할 때 리스너 붙여주고 변수들은 외부로 빼야하나

    // context menu가 존재할 경우 필요한 이벤트 리스너들 등록
    lifeQuoteEl.addEventListener('dragend', dragLifeQuoteElWithContextMenu);
    lifeQuoteEl.addEventListener('click', clickLifeQuoteElWithContextMenu);
};

// 텍스트가 지정한 길이를 넘는지 체크
// 함수이름 맘에안들어..
const checkTextMaxLen = (text, max) => {
    const check = text.length > max ? true : false;
    if (check) return text.slice(0, max) + '...';
    else return text;

    // ... <- 처리를 이 함수에서 할까말까
};

const getCuttedText = () => {};

const printQuoteMap = (key, item) => {
    //console.log(`키: ${key}, 객체: ${item}`);
    const tBody = contentBody.querySelector('tbody');
    const row = tBody.insertRow();

    const lifeQuoteCell = row.insertCell(0);
    lifeQuoteCell.textContent = checkTextMaxLen(item.text, 10);

    const authorCell = row.insertCell(1);
    authorCell.textContent = checkTextMaxLen(item.author, 6);

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

// create a new word item
const createQuote = (clickedKey, textEl, authorEl) => {
    // 입력창 비었는지 확인하는거 유틸로 빼도 될듯
    if (
        textEl.value.trim().length === 0 ||
        authorEl.value.trim().length === 0
    ) {
        textEl.value = authorEl.value = '';
        alert('Please enter texts.');
        return;
    }

    const key = clickedKey ? clickedKey : counter++;
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
        //console.log(err.message);
    }

    alert('It has been saved.');
    textEl.value = authorEl.value = '';
};

// 입력창 세팅
const setInputContent = (clickedKey) => {
    //폰트 크기 조절 있으면 좋을듯
    contentBody.innerHTML = getInnerHtmlOfInputEl();

    //console.log(clickedKey); // undefined or 1~
    const textEl = contentBody.querySelector('#lifequote-textarea');
    const authorEl = contentBody.querySelector('input');

    // FileList에서 선택한 요소가 있다면 해당 요소를 출력
    if (clickedKey) {
        textEl.value = lifeQuoteMap.get(clickedKey).text;
        authorEl.value = lifeQuoteMap.get(clickedKey).author;
    }

    const saveBtn = contentBody.querySelector('#lifequote-save-btn');
    const clearBtn = contentBody.querySelector('#lifequote-clear-btn');
    saveBtn.addEventListener('click', () =>
        createQuote(clickedKey, textEl, authorEl),
    );

    clearBtn.addEventListener('click', () => {
        textEl.value = authorEl.value = '';
    });

    // 입력 있는 채로 나가면 확인 모달 뜨는 것도 좋을듯
};

const setHelpContent = () => {
    contentBody.innerHTML = getInnerHtmlOfHelpEl();
};

// 각 탭을 클릭할 때 실행될 함수
const clickTab = (e) => {
    // 모든 탭의 선택 상태를 초기화
    tabListItems.forEach((item) => item.setAttribute('aria-selected', 'false'));

    // 클릭한 탭을 선택 상태로 변경
    const clickedTab = e.currentTarget;
    clickedTab.setAttribute('aria-selected', 'true');

    // 탭에 해당하는 내용을 가져와서 window-body에 표시
    const tabContent = clickedTab.querySelector('a').textContent.trim();
    switch (tabContent) {
        case "Today's Life Quote":
            setLifeQuoteContent();
            break;
        case 'Edit':
            setInputContent();
            break;
        case 'Quote List':
            setFileListContent();
            break;
        case 'Help':
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
    // lifeQuoteEl.className = 'lifequote-element';
    lifeQuoteEl.draggable = true;
    lifeQuoteEl.innerHTML = getInnerHtmlOfLifeQuoteEl();

    // HTML 요소 선택
    tabListItems = lifeQuoteEl.querySelectorAll('#lifequote-tablist li');
    contentBody = lifeQuoteEl.querySelector('#lifequote-body .window-body');

    // 각 탭에 이벤트 리스너 추가
    tabListItems.forEach((item) => {
        item.addEventListener('click', clickTab);
    });

    //console.log(desktop.querySelector('.window-element'));
    return lifeQuoteEl;
};

/* innerHtml 모음 */

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

// 메인 화면에 띄우는 엘리먼트
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
                <button id="lifequote-clear-btn"> CLEAR</button>
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
                    <tr data-key='0'>
                        <td>test Quote </td>
                        <td>test</td>
                        <td>test</td>
                    </tr>
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
                    <details open>
                        <summary>Quote List</summary>
                        <ul>
                            <details>
                                <summary>개요</summary>   
                                <ul>
                                    <li>등록된 명언들을 확인할 수 있습니다.</li>
                                    <li>명언 10자 이하, 작가 6자 이하까지만 표시합니다.</li>
                                </ul>
                            </details>
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
