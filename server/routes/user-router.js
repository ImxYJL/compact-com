import express from 'express';
import db from '../firebase.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import session from 'express-session';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const SECRET_KEY = process.env.SECRET_KEY;

const router = express.Router();

router.use(
  session({
    secret: SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }),
);

const getDocFromDb = async (collection, userId) => {
  const docRef = doc(db, collection, userId);
  const docSnap = await getDoc(docRef);

  return docSnap;
};

router.post('/data', (req, res) => {
  const token = req.headers.authorization.split(' ')[1];

  try {
    jwt.verify(token, SECRET_KEY);
    res.json({ status: 'success', message: 'Succeed' });
  } catch (error) {
    res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
});

router.post('/signup', async (req, res) => {
  const { userId, password } = req.body;

  const userSnap = await getDocFromDb('user', userId);
  if (userSnap.exists()) {
    return res
      .status(400)
      .json({ status: 'error', message: 'This ID already exists.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await setDoc(doc(db, 'user', userId), { password: hashedPassword });

  await setDoc(doc(db, 'timetable', userId), {
    entryIdCounter: 0,
    timetableMap: {},
  });

  await setDoc(doc(db, 'lifequote', userId), {
    counter: 0,
    lifequoteMap: {},
  });

  res.status(200).json({ status: 'success', message: 'Completed sign up.' });
});

router.post('/login', async (req, res) => {
  const { userId, password } = req.body;

  const userSnap = await getDocFromDb('user', userId);
  if (
    !userSnap.exists() ||
    !(await bcrypt.compare(password, userSnap.data().password))
  ) {
    return res
      .status(401)
      .json({ status: 'error', message: 'Your ID or password is incorrect.' });
  }

  const accessToken = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '30s' });
  const refreshToken = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1m' });

  //req.session.userId = userId;

  res.status(200).json({
    status: 'success',
    message: 'Succeed login',
    accessToken,
    refreshToken,
  });
});

router.post('/token', (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) {
    return res
      .status(403)
      .json({ status: 'error', message: 'Refresh token is required' });
  }

  try {
    const payload = jwt.verify(refreshToken, SECRET_KEY);
    const accessToken = jwt.sign({ userId: payload.userId }, SECRET_KEY, {
      expiresIn: '30s',
    });
    res.status(200).json({ status: 'success', accessToken });
  } catch (error) {
    return res
      .status(403)
      .json({ status: 'error', message: 'Invalid refresh token' });
  }
});

export default router;
