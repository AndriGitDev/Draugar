import { Router, type Router as RouterType } from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { WrappedGroupKey } from '@draugar/shared';
import { db, users, groups } from '../db';
import { eq } from 'drizzle-orm';
import {
  generateGroupKey,
  generateServerKeypair,
  createWrappedGroupKeyPackage,
} from '../crypto';

const router: RouterType = Router();

/**
 * POST /api/crypto/register-key
 * Register user's public key and return wrapped group key
 *
 * Body: { publicKey: string }
 * Returns: WrappedGroupKey
 *
 * Auth: Requires valid JWT (user must be authenticated)
 */
router.post('/register-key', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { publicKey } = req.body;
    if (!publicKey || typeof publicKey !== 'string') {
      return res.status(400).json({ error: 'publicKey required' });
    }

    // Validate public key format (base64, correct length ~44 chars for 32 bytes)
    if (publicKey.length < 40 || publicKey.length > 50) {
      return res.status(400).json({ error: 'Invalid public key format' });
    }

    // Store user's public key
    await db
      .update(users)
      .set({ publicKey })
      .where(eq(users.id, userId));

    // Get or create the group (single family group for now)
    let [group] = await db.select().from(groups).limit(1);

    if (!group) {
      // First user - create the group with encryption keys
      const serverKeypair = generateServerKeypair();
      const groupKey = generateGroupKey();

      const [newGroup] = await db
        .insert(groups)
        .values({
          name: 'Family',
          encryptionKey: groupKey,
          keyVersion: 1,
          serverPublicKey: serverKeypair.publicKey,
          serverSecretKey: serverKeypair.secretKey,
        })
        .returning();

      group = newGroup;
    }

    // Wrap the group key for this user
    const wrappedKey: WrappedGroupKey = createWrappedGroupKeyPackage(
      group.encryptionKey,
      publicKey,
      group.serverSecretKey,
      group.serverPublicKey,
      group.keyVersion
    );

    res.json(wrappedKey);
  } catch (error) {
    console.error('Error in register-key:', error);
    next(error);
  }
});

/**
 * GET /api/crypto/group-key
 * Get wrapped group key for authenticated user (for re-fetching after app restart)
 *
 * Returns: WrappedGroupKey or 404 if user hasn't registered public key
 */
router.get('/group-key', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get user's public key
    const [user] = await db
      .select({ publicKey: users.publicKey })
      .from(users)
      .where(eq(users.id, userId));

    if (!user?.publicKey) {
      return res.status(404).json({ error: 'Public key not registered' });
    }

    // Get the group
    const [group] = await db.select().from(groups).limit(1);

    if (!group) {
      return res.status(404).json({ error: 'No group exists' });
    }

    const wrappedKey: WrappedGroupKey = createWrappedGroupKeyPackage(
      group.encryptionKey,
      user.publicKey,
      group.serverSecretKey,
      group.serverPublicKey,
      group.keyVersion
    );

    res.json(wrappedKey);
  } catch (error) {
    console.error('Error in get-group-key:', error);
    next(error);
  }
});

export { router as cryptoRouter };
