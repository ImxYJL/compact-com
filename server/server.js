import express from 'express';
import bodyParser from 'body-parser';
// import cors from 'cors';
import userRoutes from './routes/user-router.js';
import timetableRoutes from './routes/timetable-router.js';
import db from './firebase.js';
import { collection, addDoc } from 'firebase/firestore';
// import { MongoClient } from 'mongodb';
// import { Express } from 'express';
// import { BodyParser } from 'body-parser';

const app = express();
// CORS 설정
// app.use(
//   cors({
//     origin: 'http://127.0.0.1:5500', // 접근 권한을 부여하는 도메인
//     credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
//     optionsSuccessStatus: 200, // 응답 상태 200으로 설정
//   }),
// );

app.use(bodyParser.json());
app.use('./routes/user-router', userRoutes);
app.use('./routes/timetable-router', timetableRoutes);

const addDummyData = async () => {
  const dummyData = {
    userName: 'dummyUser',
    password: 'dummyPassword',
  };

  try {
    await addDoc(collection(db, 'users'), dummyData);
    console.log('더미 데이터가 성공적으로 추가되었습니다.');
  } catch (error) {
    console.error('더미 데이터 추가 실패:', error);
  }
};

//let users = []; // 사용자 정보 저장

// app.post('/signup', async (req, res) => {
//   const { userName, password } = req.body;

//   // Firestore에 사용자 정보 저장
//   try {
//     const userDoc = doc(db, 'users', userName);
//     await setDoc(userDoc, { userName, password });
//     res.status(200).json({ success: true });
//     console.log('ㅇㅋ');
//   } catch (error) {
//     res.status(500).json({ error: '서버 에러: ' + error });
//   }

//   // // 이미 가입된 사용자인지 확인
//   // const existingUser = users.find((user) => user.userName === userName);
//   // if (existingUser) {
//   //   res.status(400).json({ error: '이미 가입된 사용자입니다.' });
//   //   return;
//   // }

//   // // 사용자 정보 저장
//   // users.push({ userName, password });
//   // res.status(200).json({ success: true });

//   // users.forEach((user) => console.log(user));
// });

//db

app.listen(3000, async () => {
  console.log('Server is running on port 3000');
  await addDummyData();
});

// 디비
//const uri = 'mongodb://127.0.0.1:27017';
// const uri = 'mongodb://root:gag5126@127.0.0.1:27017/admin';
// const client = new MongoClient(uri);

// client.connect((err) => {
//   if (err) {
//     console.error('Failed to connect to the database.', err);
//     process.exit(1);
//   }

//   console.log('Successfully connected to the database.');
//   const database = client.db('mydatabase');
//   const collection = database.collection('users');

//   // MongoDB 작업 수행 예시
//   collection.find({}).toArray((err, items) => {
//     if (err) {
//       console.error('Failed to retrieve items.', err);
//     } else {
//       console.log('Items:', items);
//     }
//   });
// });
