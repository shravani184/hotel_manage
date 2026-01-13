import { Link, useLocation } from 'react-router-dom'

const SidebarAdmin = () => {
  const location = useLocation()
  
  const isActive = (path) => location.pathname === path

  return (
    <aside className="w-64 bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-gray-800">Admin Panel</h2>
      <nav className="space-y-2">
        <Link
          to="/admin"
          className={`block px-4 py-3 rounded-lg transition ${
            isActive('/admin')
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-blue-50'
          }`}
        >
          📊 Dashboard
        </Link>
        <Link
          to="/admin/rooms"
          className={`block px-4 py-3 rounded-lg transition ${
            isActive('/admin/rooms')
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-blue-50'
          }`}
        >
          🏨 Manage Rooms
        </Link>
        <Link
          to="/admin/bookings"
          className={`block px-4 py-3 rounded-lg transition ${
            isActive('/admin/bookings')
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-blue-50'
          }`}
        >
          📋 All Bookings
        </Link>
        <Link
          to="/admin/users"
          className={`block px-4 py-3 rounded-lg transition ${
            isActive('/admin/users')
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-blue-50'
          }`}
        >
          👥 Users
        </Link>
      </nav>
    </aside>
  )
}

export default SidebarAdmin
