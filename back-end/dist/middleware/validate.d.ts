import { type Request, type Response, type NextFunction } from 'express';
import { ZodObject } from 'zod';
export declare const validate: (schema: ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=validate.d.ts.map