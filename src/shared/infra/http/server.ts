import 'reflect-metadata';
import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { errors } from 'celebrate';
import routes from '@shared/infra/http/routes';
import { AppError } from '@shared/errors/AppError';
import '@shared/infra/typeorm';
import '@shared/container';
import { uploadConfig } from '@config/upload';
import { pagination } from 'typeorm-pagination';
import rateLimiter from '@shared/infra/http/middlewares/rateLimiter';
import { env } from 'node:process';

const app = express();

app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(pagination);
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use(errors());

app.use(
  (error: Error, req: Request, res: Response, next: NextFunction): Response => {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    const isProduction = env.APP_ENV === 'production';

    return res.status(500).json({
      status: 'error',
      message: isProduction ? 'Internal server error.' : error,
    });
  },
);

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('Server started on port 3333. 🚀');
});
