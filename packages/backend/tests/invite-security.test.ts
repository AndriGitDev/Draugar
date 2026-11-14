import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { once } from 'node:events';
import { test } from 'node:test';
import express from 'express';
import { inviteRedemptionLimiter } from '../src/middleware/inviteRateLimit';
import { generateInviteCode } from '../src/utils/inviteCode';

test('invite sampling uses the unbiased crypto API for every character', (t) => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const sample = t.mock.method(crypto, 'randomInt', (max: number) => {
    assert.equal(max, alphabet.length);
    return max - 1;
  });
  assert.equal(generateInviteCode(), alphabet.at(-1)!.repeat(8));
  assert.equal(sample.mock.callCount(), 8);
});

test('join and validation share a guessing budget and cannot trust spoofed forwarding headers', async (t) => {
  const app = express();
  let reachedHandler = 0;
  for (const path of ['/api/auth/join', '/api/invites/validate']) {
    app.post(path, inviteRedemptionLimiter, (_req, res) => {
      reachedHandler++;
      res.json({ ok: true });
    });
  }
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(async () => {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
  const address = server.address(); assert.ok(address && typeof address === 'object');
  for (let i = 0; i < 21; i++) {
    const response = await fetch(`http://127.0.0.1:${address.port}${i % 2 ? '/api/auth/join' : '/api/invites/validate'}`, {
      method: 'POST',
      headers: { 'X-Forwarded-For': `192.0.2.${i + 1}` },
    });
    assert.equal(response.status, i < 20 ? 200 : 429);
    if (i === 20) assert.ok(Number(response.headers.get('Retry-After')) > 0);
    await response.arrayBuffer();
  }
  assert.equal(reachedHandler, 20);
});
