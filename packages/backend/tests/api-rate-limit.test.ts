import assert from 'node:assert/strict';
import { once } from 'node:events';
import { test } from 'node:test';
import express from 'express';
import { authenticatedApiLimiter } from '../src/middleware/apiRateLimit';

test('profile and crypto routes share a budget before authentication, independent of forwarded headers', async (t) => {
  const app = express();
  let authenticationCalls = 0;
  for (const path of ['/api/auth/me', '/api/crypto/register-key']) {
    app.all(path, authenticatedApiLimiter, (_req, res) => {
      authenticationCalls++;
      res.status(401).json({ error: 'Synthetic authentication rejection' });
    });
  }
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(async () => {
    server.closeAllConnections();
    await new Promise<void>((resolve) => server.close(() => resolve()));
  });
  const address = server.address(); assert.ok(address && typeof address === 'object');
  for (let i = 0; i <= 120; i++) {
    const path = i % 2 ? '/api/auth/me' : '/api/crypto/register-key';
    const response = await fetch(`http://127.0.0.1:${address.port}${path}`, {
      method: i % 2 ? 'GET' : 'POST',
      headers: { 'X-Forwarded-For': `192.0.2.${i % 250 + 1}` },
    });
    assert.equal(response.status, i < 120 ? 401 : 429);
    if (i === 120) assert.ok(Number(response.headers.get('Retry-After')) > 0);
    await response.arrayBuffer();
  }
  assert.equal(authenticationCalls, 120);
});
