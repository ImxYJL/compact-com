import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import lifeQuoteRoutes from './routes/lifequote_router.js';
import userRoutes from './routes/user-router.js';
import timetableRoutes from './routes/timetable-router.js';

const app = express();

// CORS
app.use(
  cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

app.use(bodyParser.json());

app.use('/', userRoutes);
app.use('/', timetableRoutes);
app.use('/', lifeQuoteRoutes);

app.listen(3000, async () => {
  console.log('Server is running on port 3000');
});
