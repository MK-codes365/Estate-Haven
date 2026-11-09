const express = require('express');
const router = express.Router();
const enquiryController = require('../controllers/enquiryController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

// Public endpoints (Guest or outside channel simulation)
router.post('/', enquiryController.createEnquiry);

// Staff / GM endpoints
router.get('/', authenticateToken, requireRole('reservations_staff', 'general_manager'), enquiryController.getEnquiries);
router.put('/:id', authenticateToken, requireRole('reservations_staff', 'general_manager'), enquiryController.updateEnquiry);
router.post('/:id/send-reply', authenticateToken, requireRole('reservations_staff', 'general_manager'), enquiryController.sendReply);

module.exports = router;

