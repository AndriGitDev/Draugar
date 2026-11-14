import { rateLimit } from 'express-rate-limit';

// Profile reads and crypto registration share a budget, so switching routes
// cannot bypass it. Keep trust proxy=false: forwarded headers are not identity.
// Run this before authentication to bound rejected requests as well.
export const authenticatedApiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many API requests. Please try again later.' },
});
