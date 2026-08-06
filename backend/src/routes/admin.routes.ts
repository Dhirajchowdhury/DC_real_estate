import { Router } from 'express';
import { AdminController } from '../controllers/admin.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Authentication required for all admin endpoints
router.use(requireAuth);

// ===================================================
// SHARED ENDPOINTS (ADMIN & SUPER_ADMIN)
// ===================================================
const sharedAuth = requireRole(['ADMIN', 'SUPER_ADMIN']);

router.get('/stats', sharedAuth, AdminController.getDashboardStats);
router.get('/dashboard', sharedAuth, AdminController.getDashboardStats);
router.get('/users', sharedAuth, AdminController.getUsers);

// ===================================================
// SUPER ADMIN ONLY ENDPOINTS
// ===================================================
const superAdminAuth = requireRole(['SUPER_ADMIN']);

// Broker Request Approvals / Rejections
router.get('/broker-requests', superAdminAuth, AdminController.getPendingBrokerRequests);
router.post('/broker-requests/:requestId/approve', superAdminAuth, AdminController.approveBrokerRequest);
router.post('/approve-broker/:requestId', superAdminAuth, AdminController.approveBrokerRequest);
router.post('/broker-requests/:requestId/reject', superAdminAuth, AdminController.rejectBrokerRequest);

// Admin / User Role Management
router.post('/create-admin', superAdminAuth, AdminController.createAdmin);
router.post('/users', superAdminAuth, AdminController.createAdmin);
router.delete('/users/:id', superAdminAuth, AdminController.deleteAdmin);
router.patch('/users/:id/role', superAdminAuth, AdminController.updateUserRole);

// System Settings & Audit Logs
router.get('/settings', superAdminAuth, AdminController.getSettings);
router.put('/settings/:key', superAdminAuth, AdminController.updateSetting);
router.get('/audit-logs', superAdminAuth, AdminController.getAuditLogs);

export default router;
