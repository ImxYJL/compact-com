import express from 'express';
import db from '../firebase.js';
import jwt from 'jsonwebtoken';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const SECRET_KEY = 'your-secret-key';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { userId, password } = req.body;
  const userDoc = doc(db, 'user', userId);

  const userSnapshot = await getDoc(userDoc);
  if (userSnapshot.exists()) {
    res.status(400).send('이미 존재하는 ID입니다.');
    return;
  }

  await setDoc(userDoc, { password });

  // 새로운 timetable 생성하고 entryIdCounter를 1로 초기화
  const timetableCollection = collection(db, 'timetable');
  const timetableDocRef = await addDoc(timetableCollection, {
    userId,
    entryIdCounter: 1,
    timetableMap: {
      key: newEntryObj, // Assuming you have a unique identifier for the new entry
    },
  });

  res.status(200).send('회원가입이 완료되었습니다.');
});

router.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  const userDoc = doc(db, 'user', userId);

  const userSnapshot = await getDoc(userDoc);
  if (userSnapshot.exists() && userSnapshot.data().password === password) {
    // 로그인에 성공하면 JWT 토큰을 생성합니다.
    const accessToken = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '7d' });

    res.status(200).send({
      message: '로그인에 성공하였습니다.',
      accessToken,
      refreshToken,
    });
    // res.status(200).send({
    //   message: '로그인 성공',
    //   userId: userId, // cut?
    // });
    // res.status(200).send('로그인에 성공하였습니다.');
    return;
  }
  res.status(401).send('아이디 또는 비밀번호가 잘못되었습니다.');
});

export default router;
