import { type Request, type Response, type NextFunction, type RequestHandler } from 'express';
export declare const catchAsync: (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => RequestHandler;
//# sourceMappingURL=catchAsync.d.ts.map