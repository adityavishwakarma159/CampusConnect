import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { departmentService } from '../../services/departmentService';
import { passwordResetService } from '../../services/passwordResetService';
import { FiUsers, FiUserCheck, FiBook, FiUpload, FiKey, FiSettings } from 'react-icons/fi';
import { ROUTES } from '../../utils/constants';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalDepartments: 0,
    pendingResetRequests: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Fetch users
      const usersResponse = await userService.getAllUsers(0, 100);
      const totalUsers = usersResponse.totalElements || usersResponse.content.length;
      const activeUsers = usersResponse.content.filter(u => u.isActive).length;
      
      // Fetch departments
      const departments = await departmentService.getAllDepartments();
      
      // Fetch pending password reset requests
      const resetRequests = await passwordResetService.getPendingRequests();
      
      setStats({
        totalUsers,
        activeUsers,
        totalDepartments: departments.length,
        pendingResetRequests: resetRequests.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Admin Dashboard - Manage users, departments, and system settings
            </p>
          </div>

          {/* Stats Cards */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Link to={ROUTES.ADMIN_USERS} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-primary-100 text-primary-600">
                    <FiUsers className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>
                </div>
              </Link>

              <Link to={ROUTES.ADMIN_USERS} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <FiUserCheck className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
                  </div>
                </div>
              </Link>

              <Link to={ROUTES.ADMIN_DEPARTMENTS} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <FiBook className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Departments</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalDepartments}</p>
                  </div>
                </div>
              </Link>

              <Link to={ROUTES.ADMIN_PASSWORD_RESET_REQUESTS} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100 text-orange-600">
                    <FiKey className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Resets</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.pendingResetRequests}</p>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to={ROUTES.ADMIN_USERS}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
              >
                <FiUsers className="h-8 w-8 text-primary-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Manage Users</h3>
                <p className="text-sm text-gray-600 mt-1">View, edit, and delete users</p>
              </Link>
              
              <Link
                to={ROUTES.ADMIN_BULK_UPLOAD}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
              >
                <FiUpload className="h-8 w-8 text-primary-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Bulk Upload</h3>
                <p className="text-sm text-gray-600 mt-1">Upload users via Excel file</p>
              </Link>
              
              <Link
                to={ROUTES.ADMIN_PASSWORD_RESET_REQUESTS}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
              >
                <FiKey className="h-8 w-8 text-primary-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Password Resets</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Approve password reset requests
                  {stats.pendingResetRequests > 0 && (
                    <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                      {stats.pendingResetRequests}
                    </span>
                  )}
                </p>
              </Link>

              <Link
                to={ROUTES.ADMIN_DEPARTMENTS}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
              >
                <FiBook className="h-8 w-8 text-primary-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Departments</h3>
                <p className="text-sm text-gray-600 mt-1">Manage departments</p>
              </Link>

              <Link
                to={ROUTES.ANNOUNCEMENTS}
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
              >
                <FiSettings className="h-8 w-8 text-primary-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Announcements</h3>
                <p className="text-sm text-gray-600 mt-1">View and create announcements</p>
              </Link>

              <Link
                to="/chat"
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
              >
                <FiSettings className="h-8 w-8 text-primary-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Chat</h3>
                <p className="text-sm text-gray-600 mt-1">Group and direct messaging</p>
              </Link>

              <Link
                to="/admin/attendance"
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Attendance</h3>
                    <p className="text-sm text-gray-600">View attendance analytics</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <FiUserCheck className="h-6 w-6" />
                  </div>
                </div>
              </Link>

              <Link
                to="/profile"
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
              >
                <FiSettings className="h-8 w-8 text-primary-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Profile</h3>
                <p className="text-sm text-gray-600 mt-1">Manage your profile</p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
