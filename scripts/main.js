import { createWordsEl } from './wisesaying.js';
const sayingWordsLabel = document.getElementById('wise-saying');

const clickSayingWordsLabel = () => {
    createWordsEl();
};

sayingWordsLabel.addEventListener('click', clickSayingWordsLabel);
//const hello = "asdf";
