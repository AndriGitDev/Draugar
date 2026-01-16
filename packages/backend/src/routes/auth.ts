import { Router, type Router as RouterType } from 'express';
import { eq, and, isNull, or, gt } from 'drizzle-orm';
import type { AuthResponse } from '@draugar/shared';
import { db, inviteCodes, users } from '../db';
import { signToken } from '../utils/jwt';
import { authMiddleware } from '../middleware/auth';
import { ApiError } from '../utils/ApiError';

const router: RouterType = Router();

/**
 * POST /api/auth/join - Join with invite code
 * Body: { code: string, name: string }
 * Response: AuthResponse { token, user: { id, name } }
 */
router.post('/join', async (req, res, next) => {
  try {
    const { code, name } = req.body;

    if (!code || typeof code !== 'string') {
      throw ApiError.badRequest('Invite code is required');
    }

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      throw ApiError.badRequest('Name is required');
    }

    const trimmedName = name.trim();
    const normalizedCode = code.trim().toUpperCase();

    // Find the invite code: exists, not used, not expired
    const [invite] = await db
      .select()
      .from(inviteCodes)
      .where(
        and(
          eq(inviteCodes.code, normalizedCode),
          isNull(inviteCodes.usedBy),
          or(
            isNull(inviteCodes.expiresAt),
            gt(inviteCodes.expiresAt, new Date())
          )
        )
      )
      .limit(1);

    if (!invite) {
      throw ApiError.badRequest('Invalid or expired invite code');
    }

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        name: trimmedName,
      })
      .returning();

    // Mark invite code as used
    await db
      .update(inviteCodes)
      .set({ usedBy: newUser.id })
      .where(eq(inviteCodes.id, invite.id));

    // Sign JWT
    const token = await signToken({
      userId: newUser.id,
      name: newUser.name,
    });

    const response: AuthResponse = {
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
      },
    };

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me - Get current user (protected)
 * Requires: Authorization: Bearer <token>
 * Response: { id: string, name: string }
 */
router.get('/me', authMiddleware, async (req, res) => {
  // User is guaranteed to exist from authMiddleware
  res.json({
    id: req.user!.userId,
    name: req.user!.name,
  });
});

export default router;
