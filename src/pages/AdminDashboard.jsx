import { useEffect, useState } from 'react';
import { getAllBookings, updatePaymentStatus } from '../services/api';
import { useBooking } from '../context/BookingContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useBooking();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); 

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookings();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async (bookingId) => {
    if (!window.confirm('Approve payment for this booking?')) return;

    try {
      await updatePaymentStatus(bookingId, 'Paid');
      await fetchBookings(); 
      alert('Payment approved successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to approve payment');
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'pending') return booking.status === 'Pending';
    if (filter === 'confirmed') return booking.status === 'Confirmed';
    if (filter === 'cancelled') return booking.status === 'Cancelled';
    return true;
  });

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    confirmed: bookings.filter(b => b.status === 'Confirmed').length,
    cancelled: bookings.filter(b => b.status === 'Cancelled').length,
    pendingPayments: bookings.filter(b => b.payment_status === 'Pending').length,
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <div className="text-6xl mb-4">⏳</div>
        <p className="text-xl text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Total Bookings</p>
          <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <p className="text-gray-600 text-sm">Pending</p>
          <p className="text-3xl font-bold text-yellow-700">{stats.pending}</p>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-6 border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Confirmed</p>
          <p className="text-3xl font-bold text-green-700">{stats.confirmed}</p>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-6 border-l-4 border-red-500">
          <p className="text-gray-600 text-sm">Cancelled</p>
          <p className="text-3xl font-bold text-red-700">{stats.cancelled}</p>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-6 border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Pending Payments</p>
          <p className="text-3xl font-bold text-blue-700">{stats.pendingPayments}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'pending'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'confirmed'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Confirmed ({stats.confirmed})
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === 'cancelled'
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cancelled ({stats.cancelled})
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-700">Booking ID</th>
                <th className="text-left p-4 font-semibold text-gray-700">Guest</th>
                <th className="text-left p-4 font-semibold text-gray-700">Room</th>
                <th className="text-left p-4 font-semibold text-gray-700">Dates</th>
                <th className="text-left p-4 font-semibold text-gray-700">Amount</th>
                <th className="text-left p-4 font-semibold text-gray-700">Status</th>
                <th className="text-left p-4 font-semibold text-gray-700">Payment</th>
                <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center p-8 text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking.booking_id} className="border-b hover:bg-gray-50">
                    <td className="p-4">#{booking.booking_id}</td>
                    <td className="p-4">
                      <div>
                        <p className="font-semibold">{booking.userName}</p>
                        <p className="text-sm text-gray-600">{booking.email}</p>
                      </div>
                    </td>
                    <td className="p-4">{booking.roomName}</td>
                    <td className="p-4 text-sm">
                      {new Date(booking.check_in_date).toLocaleDateString()} →<br/>
                      {new Date(booking.check_out_date).toLocaleDateString()}
                    </td>
                    <td className="p-4 font-semibold text-blue-600">${booking.total_price}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        booking.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        booking.payment_status === 'Paid' ? 'bg-green-100 text-green-700' :
                        booking.payment_status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {booking.payment_status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {booking.payment_status === 'Pending' && (
                          <button
                            onClick={() => handleApprovePayment(booking.booking_id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                          >
                            ✓ Approve Payment
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/bookings/${booking.booking_id}`)}
                          className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
