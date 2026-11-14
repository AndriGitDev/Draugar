import { rateLimit } from 'express-rate-limit';

// Join and validation share a budget, so switching endpoints cannot double
// the number of guesses. Keep Express's default trust proxy=false: arbitrary
// forwarded headers must not let a client choose its own rate-limit identity.
export const inviteRedemptionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many invite attempts. Please try again later.' },
});

export const inviteCreationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'Too many invite requests. Please try again later.' },
});
