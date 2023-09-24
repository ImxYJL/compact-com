import { getDate } from './utility/date.js';

// HTML 요소 선택
const desktop = document.querySelector('#desktop');
let tabListItems = null;
let contentBody = null;
let lifeQuoteEl = null; // Life quote element (Root Element)

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
    const printTextEl = contentBody.querySelector('#print-lifequote');
    const textToPrint = lifeQuoteMap.get(randomKey).text;
    const authorToPrint = lifeQuoteMap.get(randomKey).author;

    // 줄바꿈 문자(\n)을 HTML 줄바꿈 태그(<br>)로 변환하여 출력합니다.
    printTextEl.innerHTML =
        textToPrint.replace(/\n/g, '<br>') + `<br> - ${authorToPrint} -`;
    // printTextEl.textContent = `${textToPrint}`;
};

const clickContextMenuItem = (e) => {
    const clickedRow = contentBody.querySelector('.highlighted');
    //console.log(clickedRow);
    const clickedKey = parseInt(clickedRow.getAttribute('data-key'));
    //console.log(clickedKey);

    if (e.target.id === 'edit-li') {
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

const setContextMenuItem = (contextMenu) => {
    contextMenu.innerHTML = getInnerHtmlOfContextMenuEl();

    contextMenu.querySelector('#edit-li').addEventListener('click', () => {
        clickEditContextMenu();
        contextMenu.remove();
    });
    contextMenu.querySelector('#remove-li').addEventListener('click', () => {
        clickRemoveContextMenu();
        contextMenu.remove();
    });

    lifeQuoteEl.addEventListener('click', () => {
        contextMenu.remove();
    });

    return contextMenu;
};

const getContextMenuPos = (contextMenu) => {
    const quoteTable = contentBody.querySelector('.sunken-panel');
    const clickedRow = contentBody.querySelector('.highlighted');
    contextMenu.style.left = quoteTable.getBoundingClientRect().left + 'px';
    contextMenu.style.top = clickedRow.getBoundingClientRect().bottom + 'px';
};

const setContextMenu = (e) => {
    e.preventDefault();
    if (document.querySelector('#context-menu')) return;

    // 하이라이트된 열이 있는지 확인
    const clickedRow = contentBody.querySelector('.highlighted');
    if (!clickedRow) return;

    const contextMenu = document.createElement('div');
    contextMenu.id = 'context-menu';
    contextMenu.className = 'hidden';
    getContextMenuPos(contextMenu);

    //contentBody.append(setContextMenuItem(contextMenu)); // 안됨
    desktop.append(setContextMenuItem(contextMenu));
    contextMenu.classList.remove('hidden');

    // 드래그될 때 contextMenu 위치 재조정될 수 있게
    // 추측컨대 따로 위치설정 안하면 자동조정이고 하면 리스너 필요함

    if (lifeQuoteEl.classList.contains('hasListener')) return;
    lifeQuoteEl.classList.add('hasListener');

    lifeQuoteEl.addEventListener('dragend', () => {
        // document에 다는게 좋긴 한데 그럼 창 닫을 때 지워줘야 함
        // (나중에 고치자)

        console.log('contextM listener');
        const clickedRow = contentBody.querySelector('.highlighted');
        // Quotelist가 아닌 다른 탭에 있거나 선택된 열이 없으면 contextMenu 좌표 재조정하지 않음
        if (!isListTab() || !clickedRow) return;
        getContextMenuPos(contextMenu);
    });
};

const setTableEventListener = () => {
    // 요소마다 핸들러를 할당하지 않고, 요소의 공통 조상에
    // 이벤트 핸들러를 하나만 할당해도 여러 요소를 한꺼번에 다룰 수 있다.
    const table = contentBody.querySelector('.interactive');
    let highlighted = table.querySelector('.highlighted');
    //테이블에도 id 달아줘야하남..

    if (table.classList.contains('hasListener')) return;
    table.classList.add('hasListener');
    //탭 전환할때마다 이벤트 리스너 생성되므로 한 번ㅁㄴ 실행되게 하기
    //해당 엘리먼트에 '클래스명'을 부여해서 해당 클래스가 없으면 이벤트 바인딩
    //부모요소인 테이블에 클릭달고 이후에 세부처리닊 ㄱㅊ을듯?

    table.addEventListener('click', (e) => {
        // 선택됐던 열 있는지 확인한 뒤 하이라이트 제거
        if (highlighted) highlighted.classList.remove('highlighted');

        // 새로 선택된 요소에 하이라이트
        const clickedRow = e.target.parentElement;
        clickedRow.classList.add('highlighted');
        console.log(clickedRow);

        if (clickedRow.classList.contains('hasListener')) return;
        clickedRow.classList.add('hasListener');

        // 클릭 이벤트가 일어났을 때 우측 클릭 이벤트 달기
        clickedRow.addEventListener('contextmenu', (e) => {
            //console.log('in setEventListener-contextmenu');
            //console.log(clickedRow);
            //그렇다면 이것은 넘겨줘야 하는ㄱ ㅏ 아닌가...
            setContextMenu(e);
        });
    });

    // 명언 전체 창에도 하이라이트 해제 걸기
    lifeQuoteEl.addEventListener('click', (e) => {
        if (!isListTab()) return; // 리스트 탭일 때만 실행

        //console.log(highlighted); // 가져오기도 전인데 얘는 왜 잘나옴?
        // 하이라이트는 있을 때도 있고 없을 때도 있으므로 잘나왔다 안나왔ㄷ 하는게 정상입니다
        highlighted = table.querySelector('.highlighted'); // 실시간으로 가져와야 함!
        //console.log(highlighted);
        if (highlighted && !table.contains(e.target))
            highlighted.classList.remove('highlighted');
    });
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

    //console.log(item);
    //tr에 속성붙여줌
    lifeQuoteCell.parentElement.setAttribute('data-key', key);
};

// Set default file list styles
const setFileListContent = () => {
    contentBody.innerHTML = getInnerHtmlOfFileListEl();

    lifeQuoteMap.forEach((item, key) => {
        // 순서주의.. 바꾸면 안됨
        //console.log(`키: ${key}, 객체: ${item}`);
        printQuoteMap(key, item);
    });
    setTableEventListener();
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
    clearBtn.addEventListener(
        'click',
        () => (textEl.value = authorEl.value = ''),
    );
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
    const tabContent = clickedTab.querySelector('a').textContent;
    switch (tabContent) {
        case "Today's Wise Saying":
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
    lifeQuoteEl.className = 'window';
    lifeQuoteEl.draggable = true;
    lifeQuoteEl.innerHTML = getInnerHtmlOfLifeQuoteEl();

    // HTML 요소 선택
    tabListItems = lifeQuoteEl.querySelectorAll('#lifequote-tablist li');
    contentBody = lifeQuoteEl.querySelector('#window-wisesaying .window-body');

    // 각 탭에 이벤트 리스너 추가
    tabListItems.forEach((item) => {
        item.addEventListener('click', clickTab);
    });

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
        <div id="window-wisesaying" class="window-body">
            <ul id="lifequote-tablist" role="tablist">
                <li id="lifequote-main" role="tab" aria-selected="true">
                    <a href="#tabs">Today's Wise Saying</a>
                </li>
                <li id="lifequote-list" role="tab"><a href="#tabs">Quote List</a></li>
                <li id="lifequote-edit" role="tab"><a href="#tabs">Edit</a></li>
                <li id="lifequote-help" role="tab"><a href="#tabs">Help</a></li>
            </ul>
            <div id="lifequote-content-body" class="window" role="tabpanel">
                <div class="window-body">
                    <div id="content-container">
                        <p id="print-lifequote">Please add a new quote.</p>
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
            <p id="print-lifequote">the tab content</p>
        </div>
    `;
};

const getInnerHtmlOfContextMenuEl = () => {
    return `
        <ul>
            <li id ='edit-li'>Edit</li>
            <li id ='remove-li'>Remove</li>
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
        <div id = "lifequote-filelist" class="sunken-panel">
            <table class="interactive">
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
        <div id="">
            <p>도움말 페이지입니다.</p>
            <ul class="tree-view">
                <li>Table of Contents</li>
                <li>What is web development?</li>
                <li>
                    Today's Life Quote
                    <ul>
                        <li>등록된 명언을 랜덤으로 출력합니다.</li>
                        <li>Specificity</li>
                    </ul>
                </li>
                <li>
                    <details open>
        <summary>JavaScript</summary>
        <ul>
            <li>Avoid at all costs</li>
            <li>
            <details>
                <summary>Unless</summary>
                <ul>
                <li>Avoid</li>
                <li>
                    <details>
                    <summary>At</summary>
                    <ul>
                        <li>Avoid</li>
                        <li>At</li>
                        <li>All</li>
                        <li>Cost</li>
                    </ul>
                    </details>
                </li>
                <li>All</li>
                <li>Cost</li>
                </ul>
            </details>
            </li>
        </ul>
        </details>
    </li>
    <li>Special Thanks</li>
    </ul>
            </div>
    `;
};

export { createlifeQuoteEl };
