import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingById, cancelBooking } from '../services/api';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        setLoading(true);
        const data = await getBookingById(id);
        setBooking(data);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Failed to load booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      setCancelling(true);
      await cancelBooking(id);
      alert('Booking cancelled successfully');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      alert(err.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <div className="text-6xl mb-4">⏳</div>
        <p className="text-xl text-gray-600">Loading booking details...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <div className="text-6xl mb-4">❌</div>
        <p className="text-xl text-red-600 mb-4">{error || 'Booking not found'}</p>
        <button
          onClick={() => navigate('/dashboard')}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Booking Details</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Status Banner */}
          <div className={`py-4 px-6 ${
            booking.status === 'Confirmed' ? 'bg-green-50 border-l-4 border-green-500' :
            booking.status === 'Pending' ? 'bg-yellow-50 border-l-4 border-yellow-500' :
            booking.status === 'Completed' ? 'bg-gray-50 border-l-4 border-gray-500' :
            'bg-red-50 border-l-4 border-red-500'
          }`}>
            <p className="text-sm text-gray-600">Booking Status</p>
            <p className={`text-2xl font-bold ${
              booking.status === 'Confirmed' ? 'text-green-700' :
              booking.status === 'Pending' ? 'text-yellow-700' :
              booking.status === 'Completed' ? 'text-gray-700' :
              'text-red-700'
            }`}>
              {booking.status}
            </p>
          </div>

          {/* Booking Info */}
          <div className="p-6 space-y-6">
            {/* Room Details */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Room Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Room Name</p>
                  <p className="text-lg font-semibold text-gray-800">{booking.roomName}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Room Type</p>
                  <p className="text-lg font-semibold text-gray-800">{booking.type}</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Stay Details */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Stay Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Check-in Date</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {new Date(booking.check_in_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Check-out Date</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {new Date(booking.check_out_date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Number of Guests</p>
                  <p className="text-lg font-semibold text-gray-800">{booking.number_of_guests}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Number of Nights</p>
                  <p className="text-lg font-semibold text-gray-800">{booking.number_of_nights}</p>
                </div>
              </div>
            </div>

            <hr className="border-gray-200" />

            {/* Payment Details */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Total Price</p>
                  <p className="text-3xl font-bold text-blue-600">${booking.total_price}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Payment Status</p>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                    booking.payment_status === 'Paid' ? 'bg-green-100 text-green-700' :
                    booking.payment_status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {booking.payment_status}
                  </span>
                </div>
              </div>
            </div>

            {/* Special Requests */}
            {booking.special_requests && (
              <>
                <hr className="border-gray-200" />
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Special Requests</h2>
                  <p className="text-gray-700">{booking.special_requests}</p>
                </div>
              </>
            )}

            {/* Booking Date */}
            <hr className="border-gray-200" />
            <div>
              <p className="text-gray-600 text-sm">Booking Created</p>
              <p className="text-gray-700">
                {new Date(booking.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              {booking.status === 'Pending' && (
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                  className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              )}
              {booking.status === 'Cancelled' && (
                <div className="flex-1 bg-gray-100 text-gray-600 px-6 py-3 rounded-lg text-center font-semibold">
                  Booking Cancelled
                </div>
              )}
              {booking.status === 'Completed' && (
                <button
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
                >
                  Leave a Review
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
