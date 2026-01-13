import { Link, useLocation } from 'react-router-dom'

const SidebarUser = () => {
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path

  return (
    <aside className="w-64 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800">User Panel</h2>
      <nav className="space-y-2">
        <Link
          to="/dashboard"
          className={`block px-4 py-3 rounded-lg transition ${
            isActive('/dashboard')
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-blue-50'
          }`}
        >
          📊 My Bookings
        </Link>
        <Link
          to="/dashboard/profile"
          className={`block px-4 py-3 rounded-lg transition ${
            isActive('/dashboard/profile')
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-blue-50'
          }`}
        >
          👤 Profile
        </Link>
        <Link
          to="/rooms"
          className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 transition"
        >
          🏨 Browse Rooms
        </Link>
      </nav>
    </aside>
  )
}

export default SidebarUser
