import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';
export declare const globalErrorHandler: (err: Error | AppError, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map