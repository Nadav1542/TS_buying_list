// src/middleware/errorHandler.ts
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError.js';

export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default values for unhandled errors
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Check if it is our custom operational error
  if (err instanceof AppError && err.isOperational) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    // This is an unexpected bug! 
    // In production, log this to an external service (e.g., Datadog, Sentry)
    console.error('💥 UNEXPECTED ERROR 💥', err);
  }

  // Send the standardized error response to the client
  res.status(statusCode).json({
    success: false,
    message: message,
    // Only send the stack trace if we are in development mode
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};