import { Link, useNavigate } from 'react-router-dom'
import { useBooking } from '../context/BookingContext'

const Header = () => {
  const { user, logout } = useBooking()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <nav className="container mx-auto flex justify-between items-center px-6 py-4">
        <Link to="/" className="font-bold text-2xl text-blue-600 flex items-center hover:text-blue-700">
          <span role="img" aria-label="hotel" className="mr-2 text-3xl">🏨</span>
          CozyStay
        </Link>
        
        <div className="flex items-center gap-6">
          <Link to="/rooms" className="text-gray-700 hover:text-blue-600 font-medium transition">
            Rooms
          </Link>
          
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium transition">
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-medium transition">
                  Admin
                </Link>
              )}
              <span className="text-gray-600">Hello, {user.name}!</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-medium transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-medium transition shadow-md hover:shadow-lg"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

export default Header
