import express from 'express';
import db from '../firebase.js';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const router = express.Router();

router.get('/lifequote/:userId', async (req, res) => {
  const userId = req.params.userId;

  const lifeQuoteDoc = doc(db, 'lifequote', userId);
  const lifeQuoteSnapshot = await getDoc(lifeQuoteDoc);

  const counter = lifeQuoteSnapshot.data().counter;
  const quoteMap = lifeQuoteSnapshot.data().quoteMap;

  res.status(200).send({ counter, quoteMap });
});

router.put('/lifequote/:userId', async (req, res) => {
  const userId = req.params.userId;
  const newQuoteObj = req.body;

  const lifeQuoteDoc = doc(db, 'lifequote', userId);
  const lifeQuoteSnapshot = await getDoc(lifeQuoteDoc);

  if (!lifeQuoteSnapshot.exists()) {
    res.status(404).send('생명의 명언이 존재하지 않습니다.');
    return;
  }

  const lifeQuoteData = lifeQuoteSnapshot.data();
  lifeQuoteData.counter = newQuoteObj.key;
  lifeQuoteData.lifeQuoteMap[newQuoteObj.key] = newQuoteObj;
  await setDoc(lifeQuoteDoc, lifeQuoteData, { merge: true });

  res.status(200).send('생명의 명언이 성공적으로 수정되었습니다.');
});

export default router;
