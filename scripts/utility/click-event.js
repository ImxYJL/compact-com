import { OPENELS } from '../main.js';

const clickWindowEl = (elem) => {
    elem.addEventListener('click', () => {
        // console.log('중복체크');
        OPENELS.forEach((elem) => {
            elem.style.zIndex = '0';
        });
        //console.log(e.target);
        elem.style.zIndex = '1';
    });
};

const clickCloseBtn = (elem, timerId) => {
    elem.querySelector('#close-btn').addEventListener('click', () => {
        if (!!timerId) clearInterval(timerId);

        OPENELS.delete(elem);
        elem.remove();
    });
};

export { clickWindowEl, clickCloseBtn };
