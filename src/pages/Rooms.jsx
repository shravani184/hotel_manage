import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRooms, createBooking } from '../services/api';
import { useBooking } from '../context/BookingContext';

const Rooms = () => {
  const { user } = useBooking();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingRoom, setBookingRoom] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    numberOfGuests: 1,
    specialRequests: ''
  });

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await getRooms();
        setRooms(data);
      } catch (error) {
        console.error('Error fetching rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleBookNow = (room) => {
    if (!user) {
      alert('Please login to book a room');
      navigate('/login');
      return;
    }
    setBookingRoom(room);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createBooking({
        roomId: bookingRoom.room_id,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        numberOfGuests: bookingData.numberOfGuests,
        specialRequests: bookingData.specialRequests
      });

      alert('Booking successful! Check your dashboard.');
      setBookingRoom(null);
      setBookingData({
        checkInDate: '',
        checkOutDate: '',
        numberOfGuests: 1,
        specialRequests: ''
      });
      navigate('/dashboard');
    } catch (error) {
      alert(error.response?.data?.message || 'Booking failed. Please try again.');
      console.error('Booking error:', error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-12 text-center">
        <div className="text-6xl mb-4">⏳</div>
        <p className="text-xl text-gray-600">Loading rooms...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Available Rooms</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rooms.map((room) => (
          <div
            key={room.room_id}
            className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition overflow-hidden"
          >
            <div className="bg-gradient-to-br from-blue-400 to-purple-500 h-48 flex items-center justify-center">
              <span className="text-white text-6xl">🛏️</span>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-2xl font-bold text-gray-800">{room.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  room.available 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {room.available ? 'Available' : 'Booked'}
                </span>
              </div>
              
              <p className="text-gray-600 mb-4">
                <span className="font-semibold">Type:</span> {room.type} | 
                <span className="font-semibold"> Capacity:</span> {room.capacity} guests
              </p>
              
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-3xl font-bold text-blue-600">${room.price}</span>
                  <span className="text-gray-500"> / night</span>
                </div>
                
                <button
                  onClick={() => handleBookNow(room)}
                  disabled={!room.available}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${
                    room.available
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {room.available ? 'Book Now' : 'Unavailable'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {bookingRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Book {bookingRoom.name}</h2>
              <button 
                onClick={() => setBookingRoom(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Check-in Date</label>
                <input
                  type="date"
                  value={bookingData.checkInDate}
                  onChange={(e) => setBookingData({...bookingData, checkInDate: e.target.value})}
                  min={new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Check-out Date</label>
                <input
                  type="date"
                  value={bookingData.checkOutDate}
                  onChange={(e) => setBookingData({...bookingData, checkOutDate: e.target.value})}
                  min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Number of Guests</label>
                <input
                  type="number"
                  value={bookingData.numberOfGuests}
                  onChange={(e) => setBookingData({...bookingData, numberOfGuests: parseInt(e.target.value)})}
                  min="1"
                  max={bookingRoom.capacity}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-2">Special Requests (Optional)</label>
                <textarea
                  value={bookingData.specialRequests}
                  onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any special requirements?"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600 mb-2">
                  <span className="font-semibold">Price per night:</span> ${bookingRoom.price}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Estimated Total:</span> ${bookingRoom.price} × nights
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setBookingRoom(null)}
                  className="flex-1 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
