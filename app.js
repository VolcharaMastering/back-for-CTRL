import express from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import helmet from 'helmet';
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

/** 
 * @description Middleware to process requests using CORS. 
 */ 
app.use(cors());
/** 
 * @description creating of Express app. 
 * @type {Object}
 */ 
app.use(express.json());
/** 
 * @description Middleware to set security headers. 
 */ 
app.use(helmet());
/** 
 * @description Middleware to limit the number of requests. 
 */ 
app.use(limiter);
/** 
 * @description Middleware to process requests. 
 */ 
app.use(router);
/** 
 * @description Middleware to process requests for non-existent routes.
 */ 
app.use('*', (req, res, next) => {
  next(new NotFound('Page not found'));
});

app.use(errors());
app.use(errorHandler);
/** 
 *  connect - connects to the database and starts the server. 
 */ 
async function connect() {
  try{
  await mongoose.connect(MONGO_URL);
  app.listen(PORT, () => {
    console.log(`connected! on port ${PORT}`);
  });
  }catch(err){
    console.log(err);
  }
}

connect();
