import express from 'express';
import db from '../firebase.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { userId, password } = req.body;
  const userDoc = doc(db, 'user', userId);

  const userSnapshot = await getDoc(userDoc);
  if (userSnapshot.exists()) {
    res.status(400).send('이미 존재하는 ID입니다.');
    return;
  }

  await setDoc(userDoc, { password, entryIdCounter: 0 });

  res.status(200).send('회원가입이 완료되었습니다.');
});

router.post('/login', async (req, res) => {
  const { userId, password } = req.body;
  const userDoc = doc(db, 'user', userId);

  const userSnapshot = await getDoc(userDoc);
  if (userSnapshot.exists() && userSnapshot.data().password === password) {
    res.status(200).send('로그인에 성공하였습니다.');
    return;
  }
  res.status(401).send('아이디 또는 비밀번호가 잘못되었습니다.');
});

export default router;
