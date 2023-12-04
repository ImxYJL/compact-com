const desktopEl = document.querySelector('#desktop');
const logInEl = document.querySelector('#login-body');
const signUpEl = document.querySelector('#signup-body');

const clickLoginBtn = async () => {
  const userId = document.querySelector('#login-userid').value;
  const password = document.querySelector('#login-password').value;

  if (!userId || !password) {
    alert('모든 필드를 입력해주세요.');
    return;
  }

  try {
    await axios
      .post('http://localhost:3000/login', {
        userId,
        password,
      })
      .then((response) => {
        const data = response.data;
        console.log(data);

        // 받은 토큰을 스토리지에 저장
        sessionStorage.setItem('accessToken', data.accessToken);
        sessionStorage.setItem('refreshToken', data.refreshToken);
      })
      .catch((error) => {
        console.error('Error:', error);
      });

    alert('로그인 성공');

    setInputsEmpty();

    window.location.href = 'index.html';
  } catch (error) {
    if (error.response && error.response.status === 400) {
      alert('Id 혹은 비밀번호를 확인해주세요.');
      return;
    }
    console.error('에러:', error);
  }
};

const clickBackBtn = () => {
  signUpEl.classList.add('hidden');
  logInEl.classList.remove('hidden');
};

// 회원가입
const clickOKBtn = async () => {
  const userId = document.querySelector('#signup-userid').value;
  const password = document.querySelector('#signup-password').value;
  const passwordRetry = document.querySelector('#signup-password-retry').value;

  if (!userId || !password || !passwordRetry) {
    alert('모든 필드를 입력해주세요.');
    return;
  }

  if (password !== passwordRetry) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  try {
    const response = await axios.post('http://localhost:3000/signup', {
      userId,
      password,
    });
    alert('회원가입에 성공하였습니다.');

    setInputsEmpty();

    clickBackBtn(); // 회원가입 후 로그인 화면으로 돌아가기
  } catch (error) {
    if (error.response && error.response.status === 400) {
      alert('이미 존재하는 ID입니다.');
      return;
    }
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

  const loginBtn = document.querySelector('#login-btn');
  loginBtn.addEventListener('click', clickLoginBtn);
};

const setInputsEmpty = () => {
  const inputElements = document.querySelectorAll('input');
  inputElements.forEach((element) => {
    element.value = '';
  });
};

setStartWindow();
