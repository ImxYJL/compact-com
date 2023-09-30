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
        initialX = currentX;
        initialY = currentY;
        active = false;
    };

    const drag = (e) => {
        if (active) {
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

    dragItem.addEventListener('dragstart', dragStart);
    desktop.addEventListener('drop', dragEnd);
    desktop.addEventListener('dragover', drag);
};

export { createDraggable };
