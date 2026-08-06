import { Router } from 'express';
import { CalendarController } from '../controllers/calendar.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth, requireRole(['ADMIN', 'SUPER_ADMIN', 'BROKER']));

router.post('/', CalendarController.create);
router.get('/', CalendarController.list);

export default router;
