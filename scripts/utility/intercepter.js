import axios from '../../node_modules/axios/dist/esm/axios.min.js';

const api = axios.create({
  baseURL: 'http://localhost:3000', // 서버 주소
  timeout: 5000,
});

// 요청 전에 실행할 인터셉터
api.interceptors.request.use(
  async (config) => {
    try {
      // ... 기존 코드 ...
      const accessToken = sessionStorage.getItem('accessToken');
      const refreshToken = sessionStorage.getItem('refreshToken');

      if (accessToken && refreshToken) {
        const decoded = decodeJwt(accessToken);
        const currentTime = Date.now().valueOf() / 1000;

        // access 토큰이 만료되었을 경우
        if (decoded.exp < currentTime) {
          // 새로운 액세스 토큰을 요청
          const response = await api.post('/token', { token: refreshToken });
          accessToken = response.data.accessToken; // 새로운 액세스 토큰 저장

          sessionStorage.setItem('accessToken', accessToken);
        }
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    } catch (error) {
      console.error('인터셉터 에러:', error);
      throw error; // 에러를 다시 던져서 요청을 중단시킵니다.
    }
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 응답 전에 실행할 인터셉터
api.interceptors.response.use(
  (response) => {
    if (response.data.accessToken) {
      const newAccessToken = response.data.accessToken;
      sessionStorage.removeItem('accessToken');
      sessionStorage.setItem('accessToken', newAccessToken);
    }
    return response;
  },
  (error) => {
    // Refresh 토큰이 유효하지 않을 경우
    if (
      error.response.status === 403 &&
      error.response.data === 'Invalid refresh token'
    ) {
      // 로그인 페이지로 리다이렉트하거나, 로그인 상태 초기화 등의 조치를 취합니다.
      // 예: window.location.href = '/login';
      window.location.href = 'index.html';
    }
    return Promise.reject(error);
  },
);

function decodeJwt(token) {
  try {
    // 토큰을 "."으로 분리
    const [header, payload, signature] = token.split('.');
    // 페이로드를 Base64Url에서 Base64로 변환
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    // Base64를 디코딩하여 JSON 문자열로 변환
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );
    // JSON 문자열을 객체로 변환
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT 디코딩 실패: ', error);
    return null;
  }
}

export default api;
