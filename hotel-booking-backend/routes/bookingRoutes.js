import express from 'express';
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  updatePayment,
} from '../controllers/bookingController.js';
import { protect, admin} from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.route('/')
  .post(protect, createBooking);

router.get('/user', protect, getUserBookings);
router.get('/admin', protect, admin, getAllBookings);

router.route('/:id')
  .get(protect, getBookingById)
  .put(protect, admin, updateBookingStatus)
  .delete(protect, cancelBooking);

router.put('/:id/payment', protect, admin, updatePayment);

export default router;