// HTML 요소 선택
let tabListItems = null;
let windowBody = null;

// 각 탭을 클릭할 때 실행될 함수
function handleTabClick(event) {
    // 모든 탭의 선택 상태를 초기화
    tabListItems.forEach((item) => {
        item.setAttribute('aria-selected', 'false');
    });

    // 클릭한 탭을 선택 상태로 변경
    event.currentTarget.setAttribute('aria-selected', 'true');

    // 탭에 해당하는 내용을 가져와서 window-body에 표시
    const tabContent = event.currentTarget.querySelector('a').textContent;
    windowBody.innerHTML = `<p>${tabContent} contents</p>`;
}

const setList = () => {};

const createWordsEl = () => {
    const wordsEl = document.createElement('div');
    wordsEl.className = 'window';
    wordsEl.draggable = true;
    wordsEl.innerHTML = `
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
                <li role="tab"><a href="#tabs"></a></li>
            </ul>
            <div class="window" role="tabpanel">
                <div class="window-body">
                    <p>the tab content</p>
                </div>
            </div>
        </div>
    `;

    wordsEl.querySelector('#close-btn').addEventListener('click', () => {
        wordsEl.remove();
    });

    // HTML 요소 선택
    tabListItems = wordsEl.querySelectorAll('ul[role="tablist"] li');
    windowBody = wordsEl.querySelector('.window-body .window-body');

    // 각 탭에 이벤트 리스너 추가
    tabListItems.forEach((item) => {
        item.addEventListener('click', handleTabClick);
    });

    return wordsEl;
};

export { createWordsEl };
