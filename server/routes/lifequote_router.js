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

const getLifequoteData = async (userId) => {
  const lifequoteDoc = doc(db, 'lifequote', userId);
  const lifequoteSnapshot = await getDoc(lifequoteDoc);

  return { doc: lifequoteDoc, data: lifequoteSnapshot.data() };
};

router.get('/lifequote/:userId', async (req, res) => {
  const { data } = await getLifequoteData(req.params.userId);

  const { counter, lifequoteMap } = data;
  res.status(200).json({ counter, lifequoteMap });
});

router.delete('/lifequote/:userId/:key', async (req, res) => {
  const { doc: lifequoteDoc } = await getLifequoteData(req.params.userId);

  await updateDoc(lifequoteDoc, {
    [`lifequoteMap.${req.params.key}`]: deleteField(),
  });

  res.status(200).json({ message: 'Deleted successfully' });
});

router.put('/lifequote/:userId', async (req, res) => {
  const { doc: lifequoteDoc, data: lifequoteData } = await getLifequoteData(
    req.params.userId,
  );
  const newQuoteObj = req.body;

  lifequoteData.counter = newQuoteObj.key;
  lifequoteData.lifequoteMap[newQuoteObj.key] = newQuoteObj;

  await setDoc(lifequoteDoc, lifequoteData, { merge: true });

  res.status(200).json({ message: 'Wrote successfully.' });
});

export default router;
