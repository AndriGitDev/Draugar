import { Router, type Router as RouterType } from 'express';
import { eq, and, isNull, or, gt } from 'drizzle-orm';
import { db, inviteCodes } from '../db';
import { generateInviteCode } from '../utils/inviteCode';
import { authMiddleware } from '../middleware/auth';
import { ApiError } from '../utils/ApiError';

const router: RouterType = Router();

/**
 * POST /api/invites - Create new invite code (protected)
 * Requires: Authorization: Bearer <token>
 * Body: { expiresInHours?: number } (optional, null = never expires)
 * Response: { code: string, expiresAt: string | null }
 */
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { expiresInHours } = req.body;

    const code = generateInviteCode();
    let expiresAt: Date | null = null;

    if (typeof expiresInHours === 'number' && expiresInHours > 0) {
      expiresAt = new Date(Date.now() + expiresInHours * 60 * 60 * 1000);
    }

    const [newInvite] = await db
      .insert(inviteCodes)
      .values({
        code,
        createdBy: req.user!.userId, // Set to authenticated user
        expiresAt,
      })
      .returning();

    res.status(201).json({
      code: newInvite.code,
      expiresAt: newInvite.expiresAt ? newInvite.expiresAt.toISOString() : null,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/invites/validate - Check if code is valid
 * Body: { code: string }
 * Response: { valid: boolean, code?: string }
 */
router.post('/validate', async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== 'string') {
      throw ApiError.badRequest('Invite code is required');
    }

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
      // Don't reveal whether code exists, is used, or expired
      res.json({ valid: false });
      return;
    }

    res.json({
      valid: true,
      code: invite.code,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
