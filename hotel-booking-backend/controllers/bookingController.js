import pool from '../config/db.js';

export const createBooking = async (req, res) => {
  try {
    const {
      roomId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      specialRequests,
    } = req.body;

    const [rooms] = await pool.query('SELECT * FROM rooms WHERE room_id = ?', [roomId]);

    if (rooms.length === 0) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const room = rooms[0];

    if (!room.available) {
      return res.status(400).json({ message: 'Room is not available' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const numberOfNights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalPrice = numberOfNights * room.price;

    const [result] = await pool.query(
      `INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date, number_of_guests, number_of_nights, total_price, special_requests) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.user_id,
        roomId,
        checkIn,
        checkOut,
        numberOfGuests,
        numberOfNights,
        totalPrice,
        specialRequests || null
      ]
    );

    const bookingId = result.insertId;

    const [booking] = await pool.query(
      `SELECT b.*, r.name as roomName, r.type, r.price, u.name as userName, u.email 
       FROM bookings b
       JOIN rooms r ON b.room_id = r.room_id
       JOIN users u ON b.user_id = u.user_id
       WHERE b.booking_id = ?`,
      [bookingId]
    );

    res.status(201).json(booking[0]);
  } catch (error) {
    console.error('Create Booking error:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getUserBookings = async (req, res) => {
  try {
    console.log('📋 Fetching bookings for user:', req.user.user_id);

    const [bookings] = await pool.query(
      `SELECT 
        b.booking_id,
        b.user_id,
        b.room_id,
        b.check_in_date,
        b.check_out_date,
        b.number_of_guests,
        b.number_of_nights,
        b.total_price,
        b.status,
        b.payment_status,
        b.special_requests,
        b.created_at,
        r.name as roomName,
        r.type,
        r.price,
        r.images
       FROM bookings b
       LEFT JOIN rooms r ON b.room_id = r.room_id
       WHERE b.user_id = ?
       ORDER BY b.created_at DESC`,
      [req.user.user_id]
    );

    console.log(`✅ Found ${bookings.length} bookings`);

    const formattedBookings = bookings.map(booking => {
      try {
        return {
          ...booking,
          images: booking.images ? JSON.parse(booking.images) : []
        };
      } catch (e) {
        console.error('Error parsing images for booking:', booking.booking_id);
        return {
          ...booking,
          images: []
        };
      }
    });

    res.json(formattedBookings);
  } catch (error) {
    console.error('❌ Get User Bookings error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to fetch bookings',
      error: error.message 
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const [bookings] = await pool.query(
      `SELECT b.*, u.name as userName, u.email, u.phone, r.name as roomName, r.type, r.price
       FROM bookings b
       JOIN users u ON b.user_id = u.user_id
       JOIN rooms r ON b.room_id = r.room_id
       ORDER BY b.created_at DESC`
    );

    res.json(bookings);
  } catch (error) {
    console.error('Get All Bookings error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    console.log('📋 Fetching booking ID:', req.params.id);
    console.log('👤 User ID:', req.user.user_id);

    const [bookings] = await pool.query(
      `SELECT 
        b.booking_id,
        b.user_id,
        b.room_id,
        b.check_in_date,
        b.check_out_date,
        b.number_of_guests,
        b.number_of_nights,
        b.total_price,
        b.status,
        b.payment_status,
        b.special_requests,
        b.created_at,
        b.updated_at,
        u.name as userName,
        u.email,
        u.phone,
        r.name as roomName,
        r.type,
        r.price,
        r.images
       FROM bookings b
       LEFT JOIN users u ON b.user_id = u.user_id
       LEFT JOIN rooms r ON b.room_id = r.room_id
       WHERE b.booking_id = ?`,
      [req.params.id]
    );

    if (bookings.length === 0) {
      console.log('❌ Booking not found');
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = bookings[0];

    if (
      booking.user_id !== req.user.user_id &&
      req.user.role !== 'admin'
    ) {
      console.log('❌ Not authorized to view this booking');
      return res.status(403).json({ message: 'Not authorized' });
    }

    let images = [];
    if (booking.images) {
      try {
        images = JSON.parse(booking.images);
      } catch (e) {
        if (typeof booking.images === 'string') {
          images = [booking.images];
        }
      }
    }

    const formattedBooking = {
      ...booking,
      images
    };

    console.log('✅ Booking found:', booking.booking_id);
    res.json(formattedBooking);
  } catch (error) {
    console.error('❌ Get Booking by ID error:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      message: 'Failed to fetch booking',
      error: error.message 
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const updateFields = [];
    const updateValues = [];

    if (status) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (paymentStatus) {
      updateFields.push('payment_status = ?');
      updateValues.push(paymentStatus);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    updateValues.push(req.params.id);

    const [result] = await pool.query(
      `UPDATE bookings SET ${updateFields.join(', ')} WHERE booking_id = ?`,
      updateValues
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const [updatedBooking] = await pool.query(
      'SELECT * FROM bookings WHERE booking_id = ?',
      [req.params.id]
    );

    res.json(updatedBooking[0]);
  } catch (error) {
    console.error('Update Booking Status error:', error);
    res.status(400).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const [bookings] = await pool.query(
      'SELECT * FROM bookings WHERE booking_id = ?',
      [req.params.id]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const booking = bookings[0];

    if (booking.user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await pool.query(
      "UPDATE bookings SET status = 'Cancelled' WHERE booking_id = ?",
      [req.params.id]
    );

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Cancel Booking error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const updatePayment = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const bookingId = req.params.id;

    console.log(`💳 Admin ${req.user.user_id} updating payment for booking ${bookingId} to ${paymentStatus}`);

    if (!['Pending', 'Paid', 'Refunded'].includes(paymentStatus)) {
      return res.status(400).json({ message: 'Invalid payment status' });
    }

    const [bookings] = await pool.query(
      'SELECT * FROM bookings WHERE booking_id = ?',
      [bookingId]
    );

    if (bookings.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await pool.query(
      'UPDATE bookings SET payment_status = ?, updated_at = CURRENT_TIMESTAMP WHERE booking_id = ?',
      [paymentStatus, bookingId]
    );

    if (paymentStatus === 'Paid') {
      await pool.query(
        'UPDATE bookings SET status = ? WHERE booking_id = ? AND status = ?',
        ['Confirmed', bookingId, 'Pending']
      );
    }

    console.log(`✅ Payment status updated to ${paymentStatus}`);

    res.json({ message: 'Payment status updated successfully', paymentStatus });
  } catch (error) {
    console.error('❌ Update Payment error:', error.message);
    res.status(500).json({ message: error.message });
  }
};
