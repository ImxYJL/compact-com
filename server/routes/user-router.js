import express from 'express';
import db from '../firebase.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const SECRET_KEY = process.env.SECRET_KEY;

const router = express.Router();
router.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // HTTPS를 사용하지 않는 경우 secure: false로 설정해야 합니다. HTTPS를 사용하는 경우 true로 설정하세요.
  }),
);

router.post('/data', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  try {
    // 토큰을 검증합니다.
    jwt.verify(token, SECRET_KEY);

    // 데이터를 처리합니다.
    console.log(req.body);

    res.send('데이터를 성공적으로 받았습니다.');
  } catch (error) {
    // 토큰 검증이 실패한 경우
    res.status(401).send('Unauthorized');
  }
});

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

      console.log('안녕하세요');
      req.session.userId = userId; // 사용자 ID를 세션에 저장합니다.

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
