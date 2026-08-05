import { Router } from 'express';
import { PublicController } from '../controllers/public.controller';

const router = Router();

router.get('/properties', PublicController.getProperties);
router.get('/properties/:slug', PublicController.getPropertyBySlug);
router.post('/inquiry', PublicController.submitInquiry);

export default router;
