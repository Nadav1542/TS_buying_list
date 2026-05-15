import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export const requireListToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('X-List-Token');

  if (!token || token.trim().length === 0) {
    return next(new AppError('Missing list token', 400));
  }

  req.listToken = token.trim();
  next();
};
