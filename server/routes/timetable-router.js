import express from 'express';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import db from '../firebase.js';

const router = express.Router();

router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const newEntryObj = req.body;

  const userDoc = doc(db, 'users', userId);
  const timetableDoc = doc(db, 'timetable', userId);

  const userSnapshot = await getDoc(userDoc);
  const entryIdCounter = userSnapshot.data().entryIdCounter;

  await updateDoc(userDoc, { entryIdCounter: entryIdCounter + 1 });

  newEntryObj.key = entryIdCounter;

  await updateDoc(timetableDoc, { timetable: arrayUnion(newEntryObj) });

  res.status(200).send('timetable이 추가되었습니다.');
});

export default router;
