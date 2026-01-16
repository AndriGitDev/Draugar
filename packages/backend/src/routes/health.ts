import { Router, type Router as RouterType } from 'express';

const router: RouterType = Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

export default router;
