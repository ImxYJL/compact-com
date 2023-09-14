// HTML 요소 선택
let tabListItems = null;
let contentBody = null;
let lifeQuoteEl = null; // Life quote element (Root Element)

let counter = 1;
const lifeQuoteArr = [];

const setLifeQuoteContent = () => {
    if (lifeQuoteArr.length === 0) return;
    //랜덤으로 하나 출력
    //wiseSayingArr
};

const setEventListener = () => {
    // document.querySelectorAll('table.interactive').forEach((element) => {
    //     element.addEventListener('click', (event) => {
    //         const row = event.path.find(
    //             (element) =>
    //                 element.tagName === 'TR' &&
    //                 element.parentElement.tagName === 'TBODY',
    //         );
    //         if (row) {
    //             row.classList.toggle('highlighted');
    //         }
    //     });
    // });
};

const printQuoteArr = (item) => {
    const tBody = contentBody.querySelector('tbody');
    const row = tBody.insertRow();

    const lifeQuoteCell = row.insertCell(0);
    lifeQuoteCell.textContent = item.content;

    const WhoseCell = row.insertCell(1);
    WhoseCell.textContent = item.whose;

    const dateCell = row.insertCell(2);
    dateCell.textContent = item.date;

    setEventListener();
};

// Set default file list styles
const setFileList = () => {
    contentBody.innerHTML = `
        <div class="sunken-panel" style="height: 120px; width: 240px;">
            <table class="interactive">
                <thead>
                    <tr>
                        <th>Life Quote</th>
                        <th>Whose</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr></tr>
                </tbody>
            </table>
        </div>
    `;

    lifeQuoteArr.forEach(printQuoteArr);
};

// create a new word item
const createQuote = () => {
    // Get content
    let content = contentBody.querySelector('#ws-textarea').value;
    let whose = contentBody.querySelector('input').value;
    if (content.trim().length === 0 || whose.trim().length === 0) {
        whose = content = ''; //커서 돌리고 싶은데 안되네
        alert('Please enter texts.');
        return;
    }

    // Get date
    const today = printDay();

    // Set newWord object and push to array
    const newQuote = {
        key: counter++,
        content: content,
        whose: whose,
        date: today,
    };

    // try- catch?
    lifeQuoteArr.push(newQuote);
    content = whose = '';
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
                <label for="whose">a</label>
                <input id ="whose" type="text"/>
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
        case 'Wise Saying':
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

    lifeQuoteEl
        .querySelector('#close-btn')
        .addEventListener('click', () => lifeQuoteEl.remove());

    // HTML 요소 선택
    tabListItems = lifeQuoteEl.querySelectorAll('ul[role="tablist"] li');
    contentBody = lifeQuoteEl.querySelector('.window-body .window-body');

    //setWsContent();
    // 각 탭에 이벤트 리스너 추가
    tabListItems.forEach((item) => {
        item.addEventListener('click', clickTab);
    });

    return lifeQuoteEl;
};

// Functions and an array to get date information
const printDay = () => {
    const _today = new Date();
    const year = _today.getFullYear();
    const month = _today.getMonth() + 1;
    const date = _today.getDate();
    const day = getDay(_today.getDay());
    const today = `${day}, ${month}/${date}/${year}`;
    return today;
};

const dayOfWeeks = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

const getDay = (dayNum) => dayOfWeeks[dayNum];

export { createlifeQuoteEl };
