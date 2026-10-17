import 'dotenv/config';

export function requireJwtSecret(env: NodeJS.ProcessEnv = process.env): Uint8Array {
  const secret = env.JWT_SECRET;
  if (
    !secret?.trim() ||
    Buffer.byteLength(secret, 'utf8') < 32 ||
    secret.trim() === 'development-secret-change-in-production'
  ) {
    throw new Error('JWT_SECRET must be configured with at least 32 bytes of random key material');
  }
  return new TextEncoder().encode(secret);
}
