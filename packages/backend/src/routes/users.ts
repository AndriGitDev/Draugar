import { Router, type Router as RouterType } from 'express';
import { ApiError } from '../utils/ApiError';

const router: RouterType = Router();

// GET /users - list users (placeholder)
router.get('/', (req, res) => {
  res.json({ users: [] });
});

// GET /users/:id - get user (placeholder, demonstrates error handling)
router.get('/:id', (req, res, next) => {
  // Will query DB once auth is implemented
  next(ApiError.notFound(`User ${req.params.id} not found`));
});

export default router;
