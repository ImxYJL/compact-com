const desktop = document.querySelector('#desktop');

const createDraggable = (dragItem) => {
    let active = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const dragStart = (e) => {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === dragItem) active = true;
    };

    const dragEnd = () => {
        console.log('check');
        initialX = currentX;
        initialY = currentY;
        active = false;
    };

    const drag = (e) => {
        if (active) {
            //console.log('check');
            e.preventDefault();

            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            setTranslate(currentX, currentY, dragItem);
        }
    };

    const setTranslate = (xPos, yPos, el) => {
        el.style.transform = 'translate3d(' + xPos + 'px, ' + yPos + 'px, 0)';
    };

    // 드래그 아이템에 대한 이벤트 리스너를 추가하기 전에 이전 이벤트 리스너를 제거합니다.
    //무반응..ㅋㅋ

    dragItem.removeEventListener('dragstart', dragStart);
    desktop.removeEventListener('drop', dragEnd);
    desktop.removeEventListener('dragover', drag);

    dragItem.addEventListener('dragstart', dragStart);
    desktop.addEventListener('drop', dragEnd);
    desktop.addEventListener('dragover', drag);
};

export { createDraggable };
