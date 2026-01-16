import crypto from 'crypto';

/**
 * Characters used for invite code generation
 * Excludes ambiguous characters: 0/O, 1/l/I
 * Total 32 characters: 24 letters + 8 digits
 */
const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

/**
 * Generates a secure 8-character invite code
 * Uses crypto.randomBytes for cryptographic randomness
 *
 * @returns 8-character alphanumeric code (e.g., "K7HM3NP2")
 */
export function generateInviteCode(): string {
  const bytes = crypto.randomBytes(8);
  let code = '';

  for (let i = 0; i < 8; i++) {
    // Use modulo to map byte value to charset index
    const index = bytes[i] % CHARSET.length;
    code += CHARSET[index];
  }

  return code;
}
