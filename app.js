import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
// import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import router from './routes/index.js';
import errorHandler from './middlewares/errorHandler.js';
import NotFound from './errors/notFound.js';

import 'dotenv/config';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

const { PORT = 3000, NODE_ENV, MONGO_URL } = process.env;
const app = express();

app.use(cors());
app.use(express.json());
// app.use(helmet());

app.use(limiter);

app.use(router);

app.use('*', (req, res, next) => {
  next(new NotFound('Page not found'));
});

app.use(errors());
app.use(errorHandler);

async function connect() {
  await mongoose.connect(MONGO_URL, {});

  await app.listen(PORT, () => {
    console.log(`connected! on port ${PORT}`);
  });
}

connect();
