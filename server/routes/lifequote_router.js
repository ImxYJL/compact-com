import express from 'express';
import db from '../firebase.js';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteField,
} from 'firebase/firestore';

const router = express.Router();

router.get('/lifequote/:userId', async (req, res) => {
  const userId = req.params.userId;

  const lifequoteDoc = doc(db, 'lifequote', userId);
  const lifequoteSnapshot = await getDoc(lifequoteDoc);

  const counter = lifequoteSnapshot.data().counter;
  const lifequoteMap = lifequoteSnapshot.data().lifequoteMap;

  res.status(200).send({ counter, lifequoteMap });
});

router.delete('/lifequote/:userId/:key', async (req, res) => {
  const userId = req.params.userId;
  const key = req.params.key;

  const lifequoteDoc = doc(db, 'lifequote', userId);

  await updateDoc(lifequoteDoc, {
    [`lifequoteMap.${key}`]: deleteField(),
  });

  res.status(200).send({ message: 'Deleted successfully' });
});

router.put('/lifequote/:userId', async (req, res) => {
  const userId = req.params.userId;
  const newQuoteObj = req.body;

  const lifequoteDoc = doc(db, 'lifequote', userId);
  const lifequoteSnapshot = await getDoc(lifequoteDoc);

  const lifequoteData = lifequoteSnapshot.data();
  lifequoteData.counter = newQuoteObj.key;
  lifequoteData.lifequoteMap[newQuoteObj.key] = newQuoteObj;

  await setDoc(lifequoteDoc, lifequoteData, { merge: true });

  res.status(200).send('생명의 명언이 성공적으로 수정되었습니다.');
});

export default router;
