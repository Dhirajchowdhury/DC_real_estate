import { Router } from 'express';
import { CalendarController } from '../controllers/calendar.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.post('/', CalendarController.create);
router.get('/', CalendarController.list);

export default router;
