const desktopEl = document.querySelector('#desktop');
const logInEl = document.querySelector('#login-body');
const signUpEl = document.querySelector('#signup-body');

const clickLoginBtn = () => {};

const clickBackBtn = () => {
  // document.querySelector('#login-btn').addEventListener('click', () => {});
  signUpEl.classList.add('hidden');
  logInEl.classList.remove('hidden');
};

// 회원가입
const clickOKBtn = () => {};

const clickSignUpBtn = () => {
  signUpEl.classList.remove('hidden');
  logInEl.classList.add('hidden');
};

const setStartWindow = () => {
  const signUpBtn = document.querySelector('#signup-btn');
  signUpBtn.addEventListener('click', clickSignUpBtn);

  const backBtn = document.querySelector('#back-btn');
  backBtn.addEventListener('click', clickBackBtn);
};

setStartWindow();
