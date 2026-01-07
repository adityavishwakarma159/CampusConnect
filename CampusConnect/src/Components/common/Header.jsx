import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { ROLES, ROUTES } from '../../utils/constants';

const Header = () => {
  const { user, logout } = useAuth();

  const getDashboardRoute = () => {
    switch (user?.role) {
      case ROLES.ADMIN:
        return ROUTES.ADMIN_DASHBOARD;
      case ROLES.FACULTY:
        return ROUTES.FACULTY_DASHBOARD;
      case ROLES.STUDENT:
        return ROUTES.STUDENT_DASHBOARD;
      default:
        return '/';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to={getDashboardRoute()} className="flex items-center hover:opacity-80 transition-opacity">
            <h1 className="text-2xl font-bold text-primary-600">Campus Connect</h1>
          </Link>

          {/* User Info, Notifications, and Logout */}
          <div className="flex items-center space-x-4">
            <NotificationBell />
            <div className="flex items-center space-x-2">
              <FiUser className="text-gray-600" />
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-gray-500">{user?.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiLogOut />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
