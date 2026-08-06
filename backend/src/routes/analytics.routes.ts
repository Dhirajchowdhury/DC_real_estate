import { Router } from 'express';
import { AnalyticsController } from '../controllers/analytics.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth, requireRole(['ADMIN', 'SUPER_ADMIN']));
router.get('/dashboard', AnalyticsController.getDashboardMetrics);

export default router;
