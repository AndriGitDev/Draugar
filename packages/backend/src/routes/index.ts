import { Router, type Router as RouterType } from 'express';
import healthRouter from './health';
import usersRouter from './users';
import invitesRouter from './invites';

const router: RouterType = Router();

router.use('/health', healthRouter);
router.use('/users', usersRouter);
router.use('/invites', invitesRouter);

export default router;
