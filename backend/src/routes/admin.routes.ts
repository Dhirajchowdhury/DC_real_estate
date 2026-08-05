import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth, requireRole(['SUPER_ADMIN']));

router.get('/stats', AdminController.getDashboardStats);
router.get('/broker-requests', AdminController.getPendingBrokerRequests);
router.post('/broker-requests/:requestId/approve', AdminController.approveBrokerRequest);

export default router;
