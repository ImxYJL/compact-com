import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import lifeQuoteRoutes from './routes/lifequote_router.js';
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

// dotenv.config();
// app.use(
//   session({
//     secret: process.env.SECRET_KEY, // 이 키를 통해 세션 ID를 암호화하여 저장합니다.
//     resave: false, // 세션 데이터가 변경되지 않았더라도 항상 저장할지 설정합니다.
//     saveUninitialized: true, // 세션이 필요하기 전까지 세션을 시작하지 않습니다.
//     cookie: { secure: true }, // HTTPS를 사용하는 경우에만 쿠키를 설정합니다.
//   }),
// );

app.use(bodyParser.json());

app.use('/', userRoutes);
app.use('/', timetableRoutes);
app.use('/', lifeQuoteRoutes);

app.listen(3000, async () => {
  console.log('Server is running on port 3000');
});
