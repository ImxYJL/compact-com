const desktopEl = document.querySelector('#desktop');
const logInEl = document.querySelector('#login-body');
const signUpEl = document.querySelector('#signup-body');

const clickLoginBtn = async () => {
  const userId = document.querySelector('#login-userid').value;
  const password = document.querySelector('#login-password').value;

  if (!userId || !password) {
    alert('Please fill out all fields.');
    return;
  }

  try {
    const response = await axios.post('http://localhost:3000/login', {
      userId,
      password,
    });

    const { accessToken, refreshToken } = response.data;
    sessionStorage.setItem('accessToken', accessToken);
    sessionStorage.setItem('refreshToken', refreshToken);
  } catch (error) {
    if (error.response) {
      alert(`Login failed: ${error.response.data}`);
      return;
    }
    alert(error);
  }

  localStorage.setItem('userId', userId); // To call API
  setInputsEmpty();
  window.location.href = 'index.html';
};

const clickBackBtn = () => {
  signUpEl.classList.add('hidden');
  logInEl.classList.remove('hidden');
};

// Sign up
const clickOKBtn = async () => {
  const userId = document.querySelector('#signup-userid').value;
  const password = document.querySelector('#signup-password').value;
  const passwordRetry = document.querySelector('#signup-password-retry').value;

  if (!userId || !password || !passwordRetry) {
    alert('Please fill out all fields.');
    return;
  }

  if (password !== passwordRetry) {
    alert('Passwords do not match.');
    return;
  }

  try {
    const response = await axios.post('http://localhost:3000/signup', {
      userId,
      password,
    });
    alert('You have successfully registered as a member.');

    setInputsEmpty();

    clickBackBtn(); // Return to login screen
  } catch (error) {
    if (error.response && error.response.status === 400) {
      alert('This ID already exists.');
      return;
    }
    console.error(error);
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
