import { Link } from 'react-router-dom'

const Home = () => (
  <div className="container mx-auto px-6 py-12">
    {/* Hero Section */}
    <div className="text-center mb-16">
      <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
        Welcome to <span className="text-blue-600">CozyStay</span>
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
        Enjoy a seamless hotel booking experience. Book rooms, manage reservations, 
        and explore premium amenities for your perfect stay.
      </p>
      <div className="flex gap-4 justify-center">
        <Link
          to="/rooms"
          className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 font-semibold text-lg shadow-lg hover:shadow-xl transition"
        >
          Browse Rooms
        </Link>
        <Link
          to="/signup"
          className="bg-white text-blue-600 border-2 border-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 font-semibold text-lg transition"
        >
          Get Started
        </Link>
      </div>
    </div>

    {/* Features Section */}
    <div className="grid md:grid-cols-3 gap-8 mb-16">
      <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition text-center">
        <div className="text-5xl mb-4">🛏️</div>
        <h3 className="text-2xl font-bold mb-3 text-gray-800">Luxury Rooms</h3>
        <p className="text-gray-600">
          Experience comfort and elegance in our carefully designed rooms with modern amenities.
        </p>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition text-center">
        <div className="text-5xl mb-4">⚡</div>
        <h3 className="text-2xl font-bold mb-3 text-gray-800">Easy Booking</h3>
        <p className="text-gray-600">
          Book your perfect room in seconds with our intuitive and streamlined booking system.
        </p>
      </div>
      
      <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition text-center">
        <div className="text-5xl mb-4">🌟</div>
        <h3 className="text-2xl font-bold mb-3 text-gray-800">Premium Service</h3>
        <p className="text-gray-600">
          24/7 customer support and exceptional hospitality to make your stay unforgettable.
        </p>
      </div>
    </div>

    {/* Image Gallery */}
    <div className="grid md:grid-cols-2 gap-6 mb-16">
      <div className="bg-gradient-to-br from-blue-400 to-blue-600 h-64 rounded-xl shadow-lg flex items-center justify-center">
        <span className="text-white text-6xl">🏨</span>
      </div>
      <div className="bg-gradient-to-br from-green-400 to-green-600 h-64 rounded-xl shadow-lg flex items-center justify-center">
        <span className="text-white text-6xl">🌴</span>
      </div>
    </div>

    {/* CTA Section */}
    <div className="bg-blue-600 text-white rounded-2xl p-12 text-center shadow-2xl">
      <h2 className="text-4xl font-bold mb-4">Ready for Your Next Adventure?</h2>
      <p className="text-xl mb-8 opacity-90">
        Book now and enjoy exclusive offers on your favorite rooms.
      </p>
      <Link
        to="/rooms"
        className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 font-bold text-lg shadow-lg transition"
      >
        Explore Rooms →
      </Link>
    </div>
  </div>
)

export default Home
