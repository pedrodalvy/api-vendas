import { NextFunction, Request, Response } from 'express';
import { AppError } from '@shared/errors/AppError';
import { verify } from 'jsonwebtoken';

interface ITokenPayload {
  iat: number;
  ext: number;
  sub: string;
}

export function isAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT Token is missing.');
  }

  const token = authHeader.split(' ').pop();

  try {
    const decodedToken = verify(String(token), String(process.env.SECRET_KEY));
    const { sub } = decodedToken as ITokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch {
    throw new AppError('Invalid JWT Token.');
  }
}
