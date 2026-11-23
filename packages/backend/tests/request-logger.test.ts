import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { test } from 'node:test';
import type { Request, Response } from 'express';
import { requestLogger } from '../src/middleware/requestLogger';

test('request fields cannot add log lines or terminal control sequences', (t) => {
  const messages: string[] = [];
  t.mock.method(console, 'log', (message: string) => messages.push(message));
  const request = {
    method: 'GET',
    originalUrl: '/path?value=one\r\nFORGED\u001b]8;;https://example.invalid\u0007\u0000\u2028NEXT\u2029END',
  } as Request;
  const response = Object.assign(new EventEmitter(), { statusCode: 200 });
  let nextCalls = 0;
  requestLogger(request, response as unknown as Response, () => { nextCalls++; });
  assert.equal(nextCalls, 1);
  assert.equal(messages.length, 0);
  response.emit('finish');
  assert.equal(messages.length, 1);
  assert.equal(messages[0].split(/[\r\n\u2028\u2029]/).length, 1);
  assert.ok(!messages[0].includes('\u001b]8;;'));
  assert.ok(!messages[0].includes('\u0000'));
  assert.ok(messages[0].includes('FORGED\\u001b'));
});

test('normal request details, status and next handling remain available', (t) => {
  const messages: string[] = [];
  t.mock.method(console, 'log', (message: string) => messages.push(message));
  const response = Object.assign(new EventEmitter(), { statusCode: 404 });
  let nextCalls = 0;
  requestLogger({ method: 'POST', originalUrl: '/api/items?page=2' } as Request,
    response as unknown as Response, () => { nextCalls++; });
  response.emit('finish');
  assert.equal(nextCalls, 1);
  assert.ok(messages[0].includes('POST'));
  assert.ok(messages[0].includes('/api/items?page=2'));
  assert.ok(messages[0].includes('404'));
});
