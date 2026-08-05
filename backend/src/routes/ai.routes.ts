import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Public route for chat assistant
router.post('/search', AIController.searchProperties);

// Internal CRM route for recommendations
router.get('/recommendations/:clientId', requireAuth, AIController.getRecommendations);

export default router;
