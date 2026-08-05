import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);
router.get('/dashboard', AnalyticsController.getDashboardMetrics);

export default router;
