// src/utils/AppError.ts
export class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        // Mark this error as an expected operational error
        this.isOperational = true;
        // Capture the stack trace, excluding the constructor call from it
        Error.captureStackTrace(this, this.constructor);
    }
}
//# sourceMappingURL=AppError.js.map