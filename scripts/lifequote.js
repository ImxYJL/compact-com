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
//class window-body 지우고싶
const setLifeQuoteContent = () => {
    contentBody.innerHTML = `
        <div id="content-container">
            <p id="print-lifequote">the tab content</p>
        </div>
    `;

    if (lifeQuoteMap.size === 0) return;

    const keysArray = Array.from(lifeQuoteMap.keys());
    const randomIndex = Math.floor(Math.random() * keysArray.length);
    const randomKey = keysArray[randomIndex];
    const printTextEl = contentBody.querySelector('#print-lifequote');
    const textToPrint = lifeQuoteMap.get(randomKey).text;
    printTextEl.textContent = `${textToPrint}`;
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
    contextMenu.innerHTML = `
        <ul>
            <li id ='edit-li'>Edit</li>
            <li id ='remove-li'>Remove</li>
        </ul>
    `;
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

const getContextMenuPos = (e, contextMenu) => {
    const quoteTable = contentBody.querySelector('.sunken-panel');
    const selectedRow = contentBody.querySelector('.highlighted');
    contextMenu.style.left = quoteTable.getBoundingClientRect().left + 'px';
    contextMenu.style.top = selectedRow.getBoundingClientRect().bottom + 'px';
};

const setContextMenu = (e) => {
    e.preventDefault();
    if (document.querySelector('#context-menu')) return;

    const contextMenu = document.createElement('div');
    contextMenu.id = 'context-menu';
    contextMenu.className = 'hidden';

    getContextMenuPos(e, contextMenu);

    //contentBody.append(setContextMenuItem(contextMenu)); // 안됨
    desktop.append(setContextMenuItem(contextMenu));
    contextMenu.classList.remove('hidden');

    // document.addEventListener('click', () => {
    //     clickedRow.classList.remove('highlighted');
    //     contextMenu.remove();
    //     //contextMenu.classList.add('hidden');
    // });
    //contextMenu.classList.add('hidden');

    // 드래그될 때 contextMenu 위치 재조정될 수 있게
    // 추측컨대 따로 위치설정 안하면 자동조정이고 하면 리스너 필요함
    lifeQuoteEl.addEventListener('dragend', (e) => {
        // document에 다는게 좋긴 한데 그럼 창 닫을 때 지워줘야 함
        // (나중에 고치자)
        // Quotelist에 있는 상황이 아니라면 contextMenu 좌표 재조정하지 않음
        if (!isListTab()) return;
        getContextMenuPos(e, contextMenu);
    });
};

const setEventListener = () => {
    // 요소마다 핸들러를 할당하지 않고, 요소의 공통 조상에
    // 이벤트 핸들러를 하나만 할당해도 여러 요소를 한꺼번에 다룰 수 있다.
    const table = contentBody.querySelector('.interactive');

    table.addEventListener('click', (e) => {
        // 선택됐던 열 있는지 확인한 뒤 하이라이트 제거
        const highlighted = table.querySelector('.highlighted');
        if (highlighted) highlighted.classList.remove('highlighted');

        const clickedRow = e.target.parentElement;
        clickedRow.classList.add('highlighted');

        // 하이라이트 해제 이벤트 어떻게 하냐 ㅜㅠㅠ
        lifeQuoteEl.addEventListener('click', (e) => {
            //이 if문 함수로
            if (!isListTab()) return;

            const highlighted = table.querySelector('.highlighted');
            if (highlighted && !table.contains(e.target))
                highlighted.classList.remove('highlighted');
        });

        // 이거 내부도 테스트해야 함
        clickedRow.addEventListener('contextmenu', (e) => {
            console.log('in setEventListener');
            setEventListener();
            setContextMenu(e);
        });
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
const setFileList = () => {
    // 여기 스타일도 css로 빼줘야겠네...
    contentBody.innerHTML = `
        <div class="sunken-panel" style="height: 120px; width: 240px;">
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

    lifeQuoteMap.forEach((item, key) => {
        // 순서주의.. 바꾸면 안됨
        //console.log(`키: ${key}, 객체: ${item}`);
        printQuoteMap(key, item);
    });
    setEventListener();
};

// create a new word item
const createQuote = (clickedKey) => {
    // Get content\
    let key = null;
    let text = contentBody.querySelector('#ws-textarea').value;
    let author = contentBody.querySelector('input').value;

    if (text.trim().length === 0 || author.trim().length === 0) {
        author = text = ''; //커서 돌리고 싶은데 안되네
        alert('Please enter texts.');
        return;
    }

    const today = getDate();
    const newQuote = {
        text: text,
        author: author,
        date: `${today.day}, ${today.month}/${today.date}/${today.year}`,
    };

    try {
        key = clickedKey ? clickedKey : counter++;
        lifeQuoteMap.set(key, newQuote);
        //console.log(key);
        text = author = '';
    } catch (err) {
        alert(`${err.name}: ${err.message}`);
        setInputContent();
        //console.log(err.message);
    }
    alert('It has been saved.');
};

// 입력창 세팅
const setInputContent = (clickedKey) => {
    //console.log(clickedKey); // undefined or 1~

    //버튼에 클래스 추가해서 스타일링해주자
    //폰트 크기 조절 있으면 좋을듯
    contentBody.innerHTML = `
        <div>
            <div class="status-bar">
                <button id="ws-save-btn">🖫 SAVE</button> 
                <button id="ws-clear-btn"> CLEAR</button>
            </div>
            <div class="field-row">
                <label for="author">Author</label>
                <input id ="author" type="text"/>
            </div>
            <div class="field-row-stacked">
                <textarea id="ws-textarea" rows="8"></textarea>
            </div>
            <div class="status-bar">
                <p class="status-bar-field">Press HELP for help</p>
                <p class="status-bar-field">Slide 3</p>
                <p class="status-bar-field">CPU Usage: 14%</p>
            </div>
        </div>
    `;

    if (clickedKey) {
        const text = contentBody.querySelector('#ws-textarea');
        const author = contentBody.querySelector('input');

        text.value = lifeQuoteMap.get(clickedKey).text;
        author.value = lifeQuoteMap.get(clickedKey).author;
    }

    const saveBtn = contentBody.querySelector('#ws-save-btn');
    saveBtn.addEventListener('click', () => createQuote(clickedKey));
    const clearBtn = contentBody.querySelector('#ws-clear-btn');
};

const setHelpContent = () => {
    contentBody.innerHTML = `
        <div>
            <p>도움말 페이지입니다.</p>
        </div>
    `;
};

// 각 탭을 클릭할 때 실행될 함수
const clickTab = (e) => {
    // 모든 탭의 선택 상태를 초기화
    tabListItems.forEach((item) => item.setAttribute('aria-selected', 'false'));

    // 클릭한 탭을 선택 상태로 변경
    e.currentTarget.setAttribute('aria-selected', 'true');

    // 탭에 해당하는 내용을 가져와서 window-body에 표시
    const tabContent = e.currentTarget.querySelector('a').textContent;
    switch (tabContent) {
        case "Today's Wise Saying":
            setLifeQuoteContent();
            break;
        case 'Edit':
            setInputContent();
            break;
        case 'Quote List':
            setFileList();
            break;
        case 'Help':
            setHelpContent();
            break;
        default:
            contentBody.innerHTML = `<p>Error</p>`;
    }
};

const createlifeQuoteEl = () => {
    lifeQuoteEl = document.createElement('div');
    lifeQuoteEl.className = 'window';
    lifeQuoteEl.draggable = true;
    lifeQuoteEl.innerHTML = `
        <div class="title-bar">
            <div class="title-bar-text">Wise Saying</div>
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
            <div class="window" role="tabpanel">
                <div class="window-body">
                    <div id="content-container">
                        <p id="print-lifequote">the tab content</p>
                    </div>
                </div>
            </div>
        </div>
    `;

    // HTML 요소 선택
    tabListItems = lifeQuoteEl.querySelectorAll('ul[role="tablist"] li');
    contentBody = lifeQuoteEl.querySelector('.window-body .window-body');

    // 각 탭에 이벤트 리스너 추가
    tabListItems.forEach((item) => {
        item.addEventListener('click', clickTab);
    });

    return lifeQuoteEl;
};

export { createlifeQuoteEl };
