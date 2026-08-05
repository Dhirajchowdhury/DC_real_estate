import { Router } from 'express';
import { ClientController } from '../controllers/client.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.post('/', ClientController.create);
router.get('/', ClientController.list);
router.get('/:id', ClientController.getOne);
router.patch('/:id/stage', ClientController.updateStage);

export default router;
