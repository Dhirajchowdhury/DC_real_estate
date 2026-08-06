import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth, requireRole(['ADMIN', 'SUPER_ADMIN', 'BROKER']));

router.post('/', ClientController.create);
router.get('/', ClientController.list);
router.get('/:id', ClientController.getOne);
router.patch('/:id/stage', ClientController.updateStage);

export default router;
