const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

// Allotment matrix (Staff & GM)
router.get('/allotment-grid', authenticateToken, requireRole('reservations_staff', 'general_manager'), adminController.getAllotmentGrid);
router.post('/allotment-update', authenticateToken, requireRole('reservations_staff', 'general_manager'), adminController.updateDailyAllotment);

// PMS Export (Staff & GM)
router.get('/pms-export', authenticateToken, requireRole('reservations_staff', 'general_manager'), adminController.exportPMS);

// ROI Metrics & Overbooking Defense Test
router.get('/metrics', authenticateToken, requireRole('reservations_staff', 'general_manager'), adminController.getAdminMetrics);
router.post('/test-overbooking-defense', authenticateToken, requireRole('reservations_staff', 'general_manager'), adminController.testOverbookingDefense);

module.exports = router;

