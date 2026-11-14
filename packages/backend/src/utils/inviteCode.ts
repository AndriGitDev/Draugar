import crypto from 'crypto';

/**
 * Characters used for invite code generation
 * Excludes ambiguous characters: 0/O, 1/l/I
 * Sample each character uniformly, regardless of alphabet length.
 */
const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * Generates a secure 8-character invite code
 * Uses crypto.randomInt to avoid modulo bias
 *
 * @returns 8-character alphanumeric code (e.g., "K7HM3NP2")
 */
export function generateInviteCode(): string {
  let code = '';

  for (let i = 0; i < 8; i++) {
    const index = crypto.randomInt(CHARSET.length);
    code += CHARSET[index];
  }

  return code;
}
