import { Router } from 'express';
import { BrokerController } from '../controllers/broker.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth, requireRole(['BROKER', 'SUPER_ADMIN']));

router.get('/stats', BrokerController.getDashboardStats);
router.get('/properties', BrokerController.getMyProperties);

export default router;
