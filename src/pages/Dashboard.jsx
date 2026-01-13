import { useEffect, useState } from 'react';
import { useBooking } from '../context/BookingContext';
import { getUserBookings } from '../services/api';
import SidebarUser from '../components/SidebarUser';

const Dashboard = () => {
  const { user } = useBooking();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const data = await getUserBookings();
        setBookings(data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchBookings();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Please login to view your dashboard</h2>
        <a href="/login" className="text-blue-600 hover:underline">Go to Login</a>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <div className="flex gap-8">
        <SidebarUser />
        
        <div className="flex-1">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome back, {user?.name || 'Guest'}!
            </h1>
            <p className="text-gray-600">Manage your bookings and profile here.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Bookings</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⏳</div>
                <p className="text-xl text-gray-600">Loading bookings...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">❌</div>
                <p className="text-xl text-red-600">{error}</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <p className="text-xl text-gray-600 mb-6">No bookings yet</p>
                <a 
                  href="/rooms" 
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Browse Rooms
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.booking_id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800">
                          {booking.roomName || 'Room'}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {new Date(booking.check_in_date).toLocaleDateString()} → {new Date(booking.check_out_date).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        booking.status === 'Completed' ? 'bg-gray-100 text-gray-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-gray-600">
                          <span className="font-semibold">Guests:</span> {booking.number_of_guests} | 
                          <span className="font-semibold"> Nights:</span> {booking.number_of_nights}
                        </p>
                        <span className="text-2xl font-bold text-blue-600">${booking.total_price}</span>
                      </div>
                      <button 
  onClick={() => window.location.href = `/bookings/${booking.booking_id}`}
  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
>
  View Details
</button>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
