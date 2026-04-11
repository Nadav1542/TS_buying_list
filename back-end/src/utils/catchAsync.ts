import { type Request, type Response, type NextFunction, type RequestHandler } from 'express';

// Enforce an async Express handler signature so rejected promises can be forwarded.
export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): RequestHandler => {
  return (req, res, next) => {
    // Forward async errors to Express error middleware.
    fn(req, res, next).catch(next);
  };
};