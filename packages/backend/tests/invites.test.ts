import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { test } from 'node:test';
import express from 'express';
import { Pool } from 'pg';

test('an invite has one concurrent winner and failed joins roll back', {
  skip: !process.env.TEST_DATABASE_URL && 'Set TEST_DATABASE_URL to run the PostgreSQL integration test',
}, async (t) => {
  const url = new URL(process.env.TEST_DATABASE_URL!);
  assert.match(url.pathname, /_test$/);
  assert.ok(['localhost', '127.0.0.1'].includes(url.hostname));
  const admin = new Pool({ connectionString: url.toString() });
  const schema = 'security_' + randomUUID().replaceAll('-', '');
  await admin.query(`CREATE SCHEMA ${schema}`);
  t.after(async () => { await admin.query(`DROP SCHEMA ${schema} CASCADE`); await admin.end(); });
  url.searchParams.set('options', `-csearch_path=${schema}`);
  process.env.DATABASE_URL = url.toString();
  process.env.JWT_SECRET = 'synthetic-integration-key-with-at-least-32-bytes';
  process.env.NODE_ENV = 'production';
  const { pool } = await import('../src/db');
  t.after(() => pool.end());
  await pool.query(`
    CREATE TABLE users (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL,
      public_key text, created_at timestamp NOT NULL DEFAULT now());
    CREATE TABLE invite_codes (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), code text UNIQUE NOT NULL,
      created_by uuid REFERENCES users(id), used_by uuid REFERENCES users(id),
      created_at timestamp NOT NULL DEFAULT now(), expires_at timestamp);
    CREATE FUNCTION guard_test_user() RETURNS trigger LANGUAGE plpgsql AS $$
      BEGIN
        IF NEW.name = 'reject-this-user' THEN RAISE EXCEPTION 'synthetic insert failure'; END IF;
        PERFORM pg_sleep(0.05);
        RETURN NEW;
      END;
    $$;
    CREATE TRIGGER delay_test_user BEFORE INSERT ON users FOR EACH ROW EXECUTE FUNCTION guard_test_user();
    INSERT INTO invite_codes(code) VALUES ('ONCEONLY'), ('ROLLBACK');
    INSERT INTO invite_codes(code, expires_at) VALUES ('EXPIRED', now() - interval '1 hour');
  `);
  const { default: authRouter } = await import('../src/routes/auth');
  const { errorHandler } = await import('../src/middleware/errorHandler');
  const app = express(); app.use(express.json()); app.use('/api/auth', authRouter); app.use(errorHandler);
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(async () => { server.closeAllConnections(); await new Promise<void>((resolve) => server.close(() => resolve())); });
  const address = server.address(); assert.ok(address && typeof address === 'object');
  const join = (code: string, name = 'Test') => fetch(`http://127.0.0.1:${address.port}/api/auth/join`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, name }),
  });
  const attempts = await Promise.all(Array.from({ length: 12 }, (_, i) => join('ONCEONLY', `User ${i}`)));
  assert.equal(attempts.filter((r) => r.status === 201).length, 1);
  assert.equal(attempts.filter((r) => r.status === 400).length, 11);
  assert.equal(Number((await pool.query('SELECT count(*) FROM users')).rows[0].count), 1);
  const response = attempts.find((r) => r.status === 201)!;
  const payload = await response.json() as { token: string; user: { id: string } };
  assert.ok(payload.token);
  assert.equal((await pool.query("SELECT used_by FROM invite_codes WHERE code = 'ONCEONLY'")).rows[0].used_by, payload.user.id);
  assert.equal((await join('ROLLBACK', 'reject-this-user')).status, 500);
  assert.equal((await pool.query("SELECT used_by FROM invite_codes WHERE code = 'ROLLBACK'")).rows[0].used_by, null);
  assert.equal((await join('ROLLBACK')).status, 201);
  assert.equal((await join('EXPIRED')).status, 400);
});
