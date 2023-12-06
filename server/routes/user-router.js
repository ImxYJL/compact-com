import express from 'express';
import db from '../firebase.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const SECRET_KEY = process.env.SECRET_KEY;

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { userId, password } = req.body;
  const userDoc = doc(db, 'user', userId);

  const userSnapshot = await getDoc(userDoc);
  if (userSnapshot.exists()) {
    res.status(400).send('이미 존재하는 ID입니다.');
    return;
  }

  // 비밀번호를 암호화합니다.
  const hashedPassword = await bcrypt.hash(password, 10);
  await setDoc(userDoc, { password: hashedPassword });

  const timetableDoc = doc(db, 'timetable', userId);
  await setDoc(timetableDoc, {
    entryIdCounter: 1,
    timetableMap: {},
  });

  res.status(200).send('회원가입이 완료되었습니다.');
});

router.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  const userDoc = doc(db, 'user', userId);

  const userSnapshot = await getDoc(userDoc);
  if (userSnapshot.exists()) {
    const match = await bcrypt.compare(password, userSnapshot.data().password);

    if (match) {
      // 로그인에 성공하면 JWT 토큰을 생성
      const accessToken = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
      const refreshToken = jwt.sign({ userId }, SECRET_KEY, {
        expiresIn: '7d',
      });

      res.status(200).send({
        message: '로그인에 성공하였습니다.',
        accessToken,
        refreshToken,
      });

      return;
    }
  }
  res.status(401).send('아이디 또는 비밀번호가 잘못되었습니다.');
});

router.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res.status(403).json('Refresh token is required');
  }

  try {
    const payload = jwt.verify(refreshToken, SECRET_KEY);

    // Refresh 토큰이 유효하면 새로운 Access 토큰을 발급
    const accessToken = jwt.sign({ userId: payload.userId }, SECRET_KEY, {
      expiresIn: '1h',
    });
    res.status(200).json({ accessToken });
  } catch (error) {
    console.error(error);
    return res.status(403).json('Invalid refresh token');
  }
});

export default router;
