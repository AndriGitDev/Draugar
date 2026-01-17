import { Router, type Router as RouterType } from 'express';
import healthRouter from './health';
import usersRouter from './users';
import invitesRouter from './invites';
import authRouter from './auth';
import { cryptoRouter } from './crypto';
import { authMiddleware } from '../middleware/auth';

const router: RouterType = Router();

router.use('/health', healthRouter);
router.use('/users', usersRouter);
router.use('/invites', invitesRouter);
router.use('/auth', authRouter);
router.use('/crypto', authMiddleware, cryptoRouter);

export default router;
