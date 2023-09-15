const clickWindowEl = () => {
    const openEls = document.querySelectorAll('.window');
    openEls.forEach((elem) => {
        elem.addEventListener('click', () => {
            // 모든 요소의 z-index를 초기화합니다.
            openEls.forEach((e) => {
                e.style.zIndex = '0';
            });

            // 클릭한 요소의 z-index를 가장 높게 설정합니다.
            elem.style.zIndex = '1';
        });
    });
};

const clickCloseBtn = (elem, timerId) => {
    elem.querySelector('#close-btn').addEventListener('click', () => {
        if (!!timerId) clearInterval(timerId);
        elem.remove();
    });
};

export { clickWindowEl, clickCloseBtn };
