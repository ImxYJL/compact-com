import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
// import { Express } from 'express';
// import { BodyParser } from 'body-parser';
// const express = require('express');
// const bodyParser = require('body-parser');

// CORS 설정
const app = express();
app.use(
  cors({
    origin: 'http://127.0.0.1:5500', // 접근 권한을 부여하는 도메인
    credentials: true, // 응답 헤더에 Access-Control-Allow-Credentials 추가
    optionsSuccessStatus: 200, // 응답 상태 200으로 설정
  }),
);

app.use(bodyParser.json());

let users = []; // 사용자 정보 저장

app.post('/signup', (req, res) => {
  const { userName, password } = req.body;

  // 이미 가입된 사용자인지 확인
  const existingUser = users.find((user) => user.userName === userName);
  if (existingUser) {
    res.status(400).json({ error: '이미 가입된 사용자입니다.' });
    return;
  }

  // 사용자 정보 저장
  users.push({ userName, password });
  res.status(200).json({ success: true });

  users.forEach((user) => console.log(user));
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
