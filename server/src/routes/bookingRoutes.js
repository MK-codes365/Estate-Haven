const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/', bookingController.createBooking);
router.post('/validate-promo', bookingController.validatePromo);
router.get('/reference/:reference', bookingController.getBookingByReference);

module.exports = router;

