// import axios from 'axios';

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
const clickOKBtn = async () => {
  const userName = document.querySelector('#signup-username').value;
  const password = document.querySelector('#signup-password').value;
  const passwordRetry = document.querySelector('#signup-password-retry').value;

  // 비밀번호 확인
  if (password !== passwordRetry) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  // 서버에 전송
  try {
    const response = await axios.post('http://localhost:3000/signup', {
      userName,
      password,
    });
    alert('회원가입에 성공하였습니다.');
    clickBackBtn(); // 회원가입 후 로그인 화면으로 돌아가기
  } catch (error) {
    console.error('에러:', error);
  }
};

const clickSignUpBtn = () => {
  signUpEl.classList.remove('hidden');
  logInEl.classList.add('hidden');
};

const setStartWindow = () => {
  const signUpBtn = document.querySelector('#signup-btn');
  signUpBtn.addEventListener('click', clickSignUpBtn);

  const backBtn = document.querySelector('#back-btn');
  backBtn.addEventListener('click', clickBackBtn);

  const okBtn = document.querySelector('#ok-btn');
  okBtn.addEventListener('click', clickOKBtn);
};

setStartWindow();
