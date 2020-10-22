const express = require('express');
const bookingController = require('../controllers/booking');
const isAuth = require('../middlewares/is-auth');

const router = express.Router();


router.get('/bookings', isAuth, bookingController.getAllBookings);
router.get('/booking', isAuth, bookingController.getBooking);
router.put('/booking', isAuth, bookingController.updateBooking);

module.exports = router;
