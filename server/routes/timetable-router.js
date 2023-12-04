import express from 'express';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import db from '../firebase.js';

const router = express.Router();

router.post('/:userId', async (req, res) => {
  const { userId } = req.params;
  const newEntryObj = req.body;

  //const userDoc = doc(db, 'user', userId);
  const timetableDoc = doc(db, 'timetable'); // id 명시 없음: 자동생성

  //const userSnapshot = await getDoc(userDoc);
  //const entryIdCounter = userSnapshot.data().entryIdCounter;

  //newEntryObj.key = entryIdCounter;

  // newEntryObj를 timetableMap에 추가
  await updateDoc(timetableDoc, {
    [`timetableMap.${newEntryObj.key}`]: newEntryObj,
  });

  res.status(200).send('newEntryObj가 추가되었습니다.');
});

export default router;
