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

const getTimetableDoc = (userId) => doc(db, 'timetable', userId);

router.get('/timetable/:userId', async (req, res) => {
  const userId = req.params.userId;

  const timetableDoc = getTimetableDoc(userId);
  const timetableSnapshot = await getDoc(timetableDoc);

  const { entryIdCounter, timetableMap } = timetableSnapshot.data();

  res.status(200).send({ entryIdCounter, timetableMap });
});

router.delete('/timetable/:userId/:key', async (req, res) => {
  const { userId, key } = req.params;

  const timetableDoc = getTimetableDoc(userId);

  await updateDoc(timetableDoc, {
    [`timetableMap.${key}`]: deleteField(),
  });

  res.status(200).send({ message: 'Deleted successfully.' });
});

router.put('/timetable/:userId', async (req, res) => {
  const { userId } = req.params;
  const newEntryObj = req.body;

  const timetableDoc = getTimetableDoc(userId);
  const timetableSnapshot = await getDoc(timetableDoc);

  if (!timetableSnapshot.exists()) {
    return res.status(404).send('No timetable exists.');
  }

  const timetableData = timetableSnapshot.data();
  timetableData.entryIdCounter = newEntryObj.key;
  timetableData.timetableMap[newEntryObj.key] = newEntryObj;

  await setDoc(timetableDoc, timetableData, { merge: true });

  res.status(200).send('Completed successfully.');
});

export default router;
