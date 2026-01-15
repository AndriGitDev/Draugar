import type { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

interface ErrorResponse {
  error: true;
  message: string;
  statusCode: number;
  stack?: string;
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const isDev = process.env.NODE_ENV !== 'production';

  if (err instanceof ApiError) {
    // Known operational error
    const response: ErrorResponse = {
      error: true,
      message: err.message,
      statusCode: err.statusCode,
    };

    if (isDev) {
      response.stack = err.stack;
      console.error(`[error] ${err.statusCode} - ${err.message}`);
      console.error(err.stack);
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Unknown error - log full details and return generic message
  console.error('[error] Unexpected error:', err);
  if (isDev) {
    console.error(err.stack);
  }

  const response: ErrorResponse = {
    error: true,
    message: isDev ? err.message : 'Internal server error',
    statusCode: 500,
  };

  if (isDev) {
    response.stack = err.stack;
  }

  res.status(500).json(response);
}
