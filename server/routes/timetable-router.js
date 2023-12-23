import express from 'express';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteField, 
} from 'firebase/firestore';
import db from '../firebase.js';

const router = express.Router();

router.get('/timetable/:userId', async (req, res) => {
  const userId = req.params.userId;

  const timetableDoc = doc(db, 'timetable', userId);
  const timetableSnapshot = await getDoc(timetableDoc);
  //const timetableDoc = doc(db, 'timetable'); // id 명시 없음: 자동생성

  const entryIdCounter = timetableSnapshot.data().entryIdCounter;
  const timetableMap = timetableSnapshot.data().timetableMap;

  res.status(200).send({ entryIdCounter, timetableMap });
});

router.delete('/timetable/:userId/:key', async (req, res) => {
  const userId = req.params.userId;
  const key = req.params.key;

  const timetableDoc = doc(db, 'timetable', userId);

  await updateDoc(timetableDoc, {
    [`timetableMap.${key}`]: deleteField(),
  });

  res.status(200).send({ message: 'Deleted successfully' });
});

router.put('/timetable/:userId', async (req, res) => {
  const userId = req.params.userId;
  const newEntryObj = req.body;

  const timetableDoc = doc(db, 'timetable', userId);
  const timetableSnapshot = await getDoc(timetableDoc);

  if (!timetableSnapshot.exists()) {
    res.status(404).send('시간표가 존재하지 않습니다.');
    return;
  }

  // 시간표 데이터를 수정합니다.
  const timetableData = timetableSnapshot.data();
  timetableData.entryIdCounter = newEntryObj.key;
  timetableData.timetableMap[newEntryObj.key] = newEntryObj;
  await setDoc(timetableDoc, timetableData, { merge: true });

  res.status(200).send('시간표가 성공적으로 수정되었습니다.');
});

export default router;
