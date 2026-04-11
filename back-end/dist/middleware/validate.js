import {} from 'express';
import { ZodObject, ZodError } from 'zod';
import { AppError } from '../utils/AppError.js';
export const validate = (schema) => async (req, res, next) => {
    try {
        req.body = await schema.parseAsync(req.body);
        next();
    }
    catch (error) {
        if (error instanceof ZodError) {
            const issueSummary = error.issues.map((issue) => issue.message).join('; ');
            return next(new AppError(issueSummary || 'Validation failed', 400));
        }
        next(error);
    }
};
//# sourceMappingURL=validate.js.map