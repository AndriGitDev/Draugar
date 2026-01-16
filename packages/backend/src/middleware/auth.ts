import type { Request, Response, NextFunction } from 'express';
import type { AuthPayload } from '@draugar/shared';
import { verifyToken } from '../utils/jwt';
import { ApiError } from '../utils/ApiError';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

/**
 * Auth middleware - verifies JWT token and attaches user to request
 * Extracts Bearer token from Authorization header
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.unauthorized('Missing or invalid authorization header');
    }

    const token = authHeader.slice(7); // Remove 'Bearer ' prefix

    if (!token) {
      throw ApiError.unauthorized('No token provided');
    }

    const payload = await verifyToken(token);
    req.user = {
      userId: payload.userId,
      name: payload.name,
    };

    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      // JWT verification errors (expired, invalid, etc.)
      next(ApiError.unauthorized('Invalid or expired token'));
    }
  }
}
