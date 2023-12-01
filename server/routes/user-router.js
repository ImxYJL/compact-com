import express from 'express';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import db from '../firebase.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { userId, password } = req.body;
  const userDoc = doc(db, 'users', userId);

  await setDoc(userDoc, { password, entryIdCounter: 0 });

  res.status(200).send('회원가입이 완료되었습니다.');
});

router.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  const userDoc = doc(db, 'users', userId);

  const userSnapshot = await getDoc(userDoc);
  if (userSnapshot.exists() && userSnapshot.data().password === password) {
    res.status(200).send('로그인에 성공하였습니다.');
  } else {
    res.status(401).send('아이디 또는 비밀번호가 잘못되었습니다.');
  }
});

export default router;
