import { getDate } from './utility/date.js';

// HTML 요소 선택
let tabListItems = null;
let contentBody = null;
let lifeQuoteEl = null; // Life quote element (Root Element)

let counter = 1;
const lifeQuoteArr = [];

const setLifeQuoteContent = () => {
    contentBody.innerHTML = `
        <div class="window" role="tabpanel">
            <div class="window-body">
                <div id="content-container">
                    <p>the tab content</p>
                </div>
                <button>OK</button>
            </div>
        </div>
    `;

    if (lifeQuoteArr.length === 0) return;

    const randomIndex = Math.floor(Math.random() * lifeQuoteArr.length);
    const printTextEl = contentBody.querySelector('.window-body p');
    printTextEl.innerHTML = lifeQuoteArr[randomIndex].text;
};

const setContextMenu = () => {};

const setEventListener = () => {
    const table = contentBody.querySelector('.interactive');
    table.addEventListener('click', (e) => {
        //alert('test');

        //e.target.;
        if (e.target.tagName === 'TD') {
            //console.log('선택된 행:', event.target);
            const clickedRow = e.target.parentElement; // 클릭된 행
            clickedRow.addEventListener('mousedown', (e) => {
                e.preventDefault();
                if (e.button === 2) {
                    //alert('right');
                    setContextMenu();
                }
            });

            //다른곳 클릭하면 선택 해제되게끔 돌려야함
            clickedRow.classList.toggle('highlighted');

            // const keyToDelete = parseInt(clickedRow.getAttribute('data-key')); // 클릭된 행의 key 값
            // // 배열에서 해당 key 값을 가진 객체를 찾아 제거
            // const indexToRemove = lifeQuoteArr.findIndex(
            //     (item) => item.key === keyToDelete,
            // );
            // if (indexToRemove !== -1) {
            //     lifeQuoteArr.splice(indexToRemove, 1);
            // }

            // // 표에서 클릭된 행을 삭제
            // clickedRow.remove();
            // //console.log(`키 값 ${keyToDelete}을 가진 항목이 삭제되었습니다.`);
        }
    });
};

const printQuoteArr = (item) => {
    const tBody = contentBody.querySelector('tbody');
    const row = tBody.insertRow();

    const lifeQuoteCell = row.insertCell(0);
    lifeQuoteCell.textContent = item.text;

    const authorCell = row.insertCell(1);
    authorCell.textContent = item.author;

    const dateCell = row.insertCell(2);
    dateCell.textContent = item.date;

    //tr에 속성붙여줌
    lifeQuoteCell.parentElement.setAttribute('data-key', item.key);
};

// Set default file list styles
const setFileList = () => {
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
                        <td>test Quote</td>
                        <td>test</td>
                        <td>test</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;

    lifeQuoteArr.forEach(printQuoteArr);
    setEventListener();
};

// create a new word item
const createQuote = () => {
    // Get content
    let text = contentBody.querySelector('#ws-textarea').value;
    let author = contentBody.querySelector('input').value;
    if (text.trim().length === 0 || author.trim().length === 0) {
        author = text = ''; //커서 돌리고 싶은데 안되네
        alert('Please enter texts.');
        return;
    }

    const today = getDate();
    const newQuote = {
        key: counter++,
        text: text,
        author: author,
        date: `${today.day}, ${today.month}/${today.date}/${today.year}`,
    };

    // try- catch?
    lifeQuoteArr.push(newQuote);
    text = author = '';
    alert('It has been saved.');
};

// 입력창 세팅
const setInputContent = () => {
    //버튼에 클래스 추가해서 스타일링해주자
    //폰트 크기 조절 있으면 좋을듯
    contentBody.innerHTML = `
        <div>
            <div class="status-bar">
                <button id="ws-save-btn">🖫 SAVE</button> 
                <button> CLEAR</button>
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

    const saveBtn = contentBody.querySelector('#ws-save-btn');
    saveBtn.addEventListener('click', createQuote);
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
        case 'File List':
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
        <div class="window-body">
            <ul role="tablist">
                <li role="tab" aria-selected="true">
                    <a href="#tabs">Today's Wise Saying</a>
                </li>
                <li role="tab"><a href="#tabs">File List</a></li>
                <li role="tab"><a href="#tabs">Edit</a></li>
                <li role="tab"><a href="#tabs">Help</a></li>
            </ul>
            <div class="window" role="tabpanel">
                <div class="window-body">
                    <div id="content-container">
                        <p>the tab content</p>
                    </div>
                    <button>OK</button>
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
