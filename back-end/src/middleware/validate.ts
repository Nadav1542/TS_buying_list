import { type Request, type Response, type NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';

export const validate = (schema: ZodObject<any>) => 
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      req.body = await schema.parseAsync(req.body);
      next(); 
    } catch (error) {
      if (error instanceof ZodError) {
        const issueSummary = error.issues.map((issue) => issue.message).join('; ');
        return next(new AppError(issueSummary || 'Validation failed', 400));
      }
      next(error);
    }
};