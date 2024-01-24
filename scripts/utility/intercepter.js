import axios from '../../node_modules/axios/dist/esm/axios.min.js';

const SESSION_STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
};

const api = axios.create({
  baseURL: 'http://localhost:3000', // server URL
  timeout: 5000,
});

const getDecodedJwt = (token) => {
  try {
    // split token
    const [header, payload, signature] = token.split('.');
    // convert payload : Base64Url -> Base64
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    // decode Base64: to JSON string
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    // JSON string -> Object
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error(`JWT decoding failed: ${error}`);
    return null;
  }
};

const handleRequest = async (config) => {
  let accessToken = sessionStorage.getItem(SESSION_STORAGE_KEYS.ACCESS_TOKEN);
  const refreshToken = sessionStorage.getItem(
    SESSION_STORAGE_KEYS.REFRESH_TOKEN,
  );

  if (accessToken && refreshToken) {
    const decoded = getDecodedJwt(accessToken);
    const currentTime = Date.now().valueOf() / 1000;

    if (decoded && decoded.exp < currentTime) {
      try {
        const response = await axios.post('http://localhost:3000/token', {
          token: refreshToken,
        });
        accessToken = response.data.accessToken;
        sessionStorage.setItem(SESSION_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      } catch (error) {
        handleRefreshTokenError(error); // Separate error handling function
        throw error;
      }
    }
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
};

// Function to handle refresh token error
const handleRefreshTokenError = (error) => {
  if (error.response && error.response.status === 403) {
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.REFRESH_TOKEN);
    alert('Please login again.');
    window.location.href = 'start.html';
  } else {
    console.error(`Error refreshing token: ${error}`);
  }
};

const handleResponse = (response) => {
  if (response.data.accessToken) {
    const newAccessToken = response.data.accessToken;
    sessionStorage.removeItem(SESSION_STORAGE_KEYS.ACCESS_TOKEN);
    sessionStorage.setItem(SESSION_STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);
  }

  return response;
};

const handleResponseError = (error) => {
  if (
    error.response.status === 403 &&
    error.response.data === 'Invalid refresh token'
  ) {
    window.location.href = 'start.html';
  }

  if (error.response.status === 401) {
    alert(error.response.data.message);
  }

  return Promise.reject(error);
};

api.interceptors.request.use(handleRequest, (error) => Promise.reject(error));
api.interceptors.response.use(handleResponse, handleResponseError);

export default api;
