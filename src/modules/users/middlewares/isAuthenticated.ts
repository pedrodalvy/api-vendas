import { NextFunction, Request, Response } from 'express';
import { AppError } from '@shared/errors/AppError';
import { verify } from 'jsonwebtoken';

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
    verify(String(token), String(process.env.SECRET_KEY));
    return next();
  } catch {
    throw new AppError('Invalid JWT Token.');
  }
}
