import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import routes from '@shared/http/routes';
import { AppError } from '@shared/errors/AppError';

const app = express();

app.use(cors());
app.use(express.json());

app.use(routes);

app.use(
  (error: Error, req: Request, res: Response, next: NextFunction): Response => {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    return res.status(500).json({
      status: error,
      message: 'Internal server error.',
    });
  },
);

app.listen(3333, () => {
  // eslint-disable-next-line no-console
  console.log('Server started on port 3333. 🚀');
});
