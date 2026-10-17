import assert from 'node:assert/strict';
import { test } from 'node:test';
import { SignJWT } from 'jose';
import { requireJwtSecret } from '../src/config';

test('missing, short and former development keys fail closed', () => {
  for (const value of [undefined, '', ' '.repeat(40), 'short', 'development-secret-change-in-production']) {
    assert.throws(() => requireJwtSecret({ JWT_SECRET: value }), /JWT_SECRET/);
  }
});

test('configured tokens round-trip while forged and expired tokens are rejected', async () => {
  process.env.JWT_SECRET = 'synthetic-test-key-with-at-least-32-bytes';
  const { signToken, verifyToken } = await import('../src/utils/jwt');
  const token = await signToken({ userId: 'test-user', name: 'Test' });
  assert.equal((await verifyToken(token)).userId, 'test-user');
  const forgery = await new SignJWT({ userId: 'test-user', name: 'Test' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('1h')
    .sign(new TextEncoder().encode('development-secret-change-in-production'));
  await assert.rejects(verifyToken(forgery));
  const expired = await new SignJWT({ userId: 'test-user', name: 'Test' })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(1)
    .sign(requireJwtSecret());
  await assert.rejects(verifyToken(expired));
});
