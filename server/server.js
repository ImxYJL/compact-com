import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import userRoutes from './routes/user-router.js';
import timetableRoutes from './routes/timetable-router.js';

const app = express();
// CORS 설정
app.use(
  cors({
    origin: 'http://127.0.0.1:5500', // 접근 권한을 부여하는 도메인
    credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
    optionsSuccessStatus: 200, // 응답 상태 200으로 설정
  }),
);

app.use(bodyParser.json());

app.use('/', userRoutes);
app.use('/', timetableRoutes);

app.listen(3000, async () => {
  console.log('Server is running on port 3000');
});
