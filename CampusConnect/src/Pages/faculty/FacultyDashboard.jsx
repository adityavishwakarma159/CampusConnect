import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { studyMaterialService } from '../../services/studyMaterialService';
import { 
  FiBell, FiFileText, FiUsers, FiCheckCircle, FiUpload, 
  FiCalendar, FiMessageSquare, FiUser, FiClock, FiBook 
} from 'react-icons/fi';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    materialsUploaded: 0,
    attendanceMarkedToday: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      console.log('Fetching stats for user:', user);
      
      if (!user.departmentId) {
        console.error('No department ID found for user');
        setLoading(false);
        return;
      }
      
      // Fetch students in department
      const students = await userService.getUsersByDepartmentForFaculty(user.departmentId);
      console.log('Fetched students:', students);
      const studentCount = students.filter(u => u.role === 'STUDENT').length;
      
      // Fetch study materials count
      let materialsCount = 0;
      try {
        const materials = await studyMaterialService.getMyMaterials();
        materialsCount = materials.length;
      } catch (error) {
        console.log('Materials endpoint error:', error.message);
      }
      
      setStats({
        totalStudents: studentCount,
        materialsUploaded: materialsCount,
        attendanceMarkedToday: false, // Will be updated when backend endpoint is ready
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Faculty Dashboard - Manage your teaching activities
            </p>
            {user?.departmentName && (
              <p className="text-sm text-gray-500 mt-2">
                Department: {user.departmentName}
              </p>
            )}
          </div>

          {/* Stats Cards */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Link to="/faculty/students" className="block transform transition-transform hover:scale-105">
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Students</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                    </div>
                    <FiUsers className="h-10 w-10 text-blue-600" />
                  </div>
                </div>
              </Link>

              <Link to="/faculty/materials/manage" className="block transform transition-transform hover:scale-105">
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Study Materials</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.materialsUploaded}</p>
                    </div>
                    <FiFileText className="h-10 w-10 text-green-600" />
                  </div>
                </div>
              </Link>

              <Link to="/faculty/attendance/mark" className="block transform transition-transform hover:scale-105">
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Today's Attendance</p>
                      <p className="text-sm font-medium text-gray-900">
                        {stats.attendanceMarkedToday ? 'Marked' : 'Not Marked'}
                      </p>
                    </div>
                    {stats.attendanceMarkedToday ? (
                      <FiCheckCircle className="h-10 w-10 text-green-600" />
                    ) : (
                      <FiClock className="h-10 w-10 text-orange-600" />
                    )}
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link
                to="/faculty/attendance/mark"
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
              >
                <FiCheckCircle className="h-8 w-8 text-primary-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Mark Attendance</h3>
                <p className="text-sm text-gray-600 mt-1">Mark today's attendance</p>
              </Link>

              <Link
                to="/faculty/attendance/history"
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
              >
                <FiCalendar className="h-8 w-8 text-primary-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Attendance History</h3>
                <p className="text-sm text-gray-600 mt-1">View past attendance</p>
              </Link>
              
              <Link
                to="/faculty/materials/upload"
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
              >
                <FiUpload className="h-8 w-8 text-primary-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Upload Material</h3>
                <p className="text-sm text-gray-600 mt-1">Upload study materials</p>
              </Link>

              <Link
                to="/faculty/materials/manage"
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
              >
                <FiBook className="h-8 w-8 text-primary-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Manage Materials</h3>
                <p className="text-sm text-gray-600 mt-1">View and edit materials</p>
              </Link>

              <Link
                to="/faculty/students"
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
              >
                <FiUsers className="h-8 w-8 text-primary-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Students</h3>
                <p className="text-sm text-gray-600 mt-1">View department students</p>
              </Link>

              <Link
                to="/announcements/create"
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
              >
                <FiBell className="h-8 w-8 text-primary-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Announcements</h3>
                <p className="text-sm text-gray-600 mt-1">Create announcements</p>
              </Link>

              <Link
                to="/chat"
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
              >
                <FiMessageSquare className="h-8 w-8 text-primary-600 mb-2" />
                <h3 className="font-semibold text-gray-900">Chat</h3>
                <p className="text-sm text-gray-600 mt-1">Message students</p>
              </Link>

              <Link
                to="/profile"
                className="border border-gray-200 rounded-lg p-4 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
              >
                <FiUser className="h-8 w-8 text-primary-600 mb-2" />
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

export default FacultyDashboard;
