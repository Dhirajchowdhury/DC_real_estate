import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

// Admin routes for invoicing
router.post('/invoices', requireRole(['SUPER_ADMIN', 'ADMIN']), PaymentController.createInvoice);

// Public / Client routes for payment
router.post('/order', PaymentController.createPaymentOrder);
router.post('/verify', PaymentController.verifyPayment);

export default router;
