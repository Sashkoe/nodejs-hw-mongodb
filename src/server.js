import express from 'express';
import env from './utils/env.js';
import cors from 'cors';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';
import router from './routes/index.js';
import cookieParser from 'cookie-parser';
// import pino from 'pino-http';

const PORT = Number(env('PORT', '3000'));

export default function setupServer() {
  const app = express();

  // app.use(
  //   pino({
  //     transport: { target: 'pino-pretty' },
  //   }),
  // );

  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.use(router);
  app.use('*', notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
