import { Router, type Router as RouterType } from 'express';
import healthRouter from './health';
import usersRouter from './users';

const router: RouterType = Router();

router.use('/health', healthRouter);
router.use('/users', usersRouter);

export default router;
