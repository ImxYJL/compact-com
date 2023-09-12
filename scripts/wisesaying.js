const createWordsEl = () => {
    const wordsEl = document.createElement('div');
    wordsEl.className = 'window';
    wordsEl.draggable = true;
    // wordsEl.style.width = '800px';
    wordsEl.innerHTML = `
        <div class="title-bar">
            <div class="title-bar-text">Wise Saying</div>
            <div class="title-bar-controls">
                <!-- <button aria-label="Minimize"></button> -->
                <!-- <button aria-label="Maximize"></button> -->
                <button id ="close-btn" aria-label="Close"></button>
            </div>
        </div>
        <div class="window-body">
            <menu role="tablist">
                <li role="tab" aria-selected="true">
                    <a href="#tabs">Desktop</a>
                </li>
                <li role="tab"><a href="#tabs">My computer</a></li>
                <li role="tab"><a href="#tabs">Control panel</a></li>
                <li role="tab"><a href="#tabs">Devices manager</a></li>
                <li role="tab">
                    <a href="#tabs">Hardware profiles</a>
                </li>
            </menu>
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

    return wordsEl;
};

export { createWordsEl };
