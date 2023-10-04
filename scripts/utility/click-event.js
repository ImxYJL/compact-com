import { OPEN_EL_LIST } from '../main.js';

const clickWindowEl = (elem) => {
    elem.addEventListener('click', () => {
        OPEN_EL_LIST.forEach((elem) => {
            elem.style.zIndex = '0';
        });
        elem.style.zIndex = '1';
    });
};

const clickCloseBtn = (elem, TIMERID) => {
    elem.querySelector('#close-btn').addEventListener('click', () => {
        if (TIMERID) clearInterval(TIMERID);

        OPEN_EL_LIST.delete(elem);
        elem.remove();
    });
};

export { clickWindowEl, clickCloseBtn };
