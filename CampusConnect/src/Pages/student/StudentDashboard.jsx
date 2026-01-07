import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';
import { FiBell, FiFileText, FiCalendar, FiCheckCircle, FiClock, FiAlertCircle, FiMessageSquare } from 'react-icons/fi';
import { attendanceService } from '../../services/attendanceService';
import { announcementService } from '../../services/announcementService';
import { studyMaterialService } from '../../services/studyMaterialService';
import { ROUTES } from '../../utils/constants';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    attendance: 0,
    announcements: 0,
    materials: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        if (user?.id) {
          // Fetch Attendance Percentage
          try {
            const attendanceData = await attendanceService.getAttendancePercentage(user.id);
            setStats(prev => ({ ...prev, attendance: attendanceData.percentage || 0 }));
          } catch (error) {
            console.error("Error fetching attendance:", error);
          }

          // Fetch Unread Announcements Count
          try {
             // Use user.departmentId
             const announcements = await announcementService.getAllAnnouncements(user.departmentId, 0, 1);
             setStats(prev => ({ ...prev, announcements: announcements.totalElements || 0 }));
          } catch (error) {
            console.error("Error fetching announcements:", error);
          }

          // Fetch Study Materials Count
          try {
            const materials = await studyMaterialService.getMaterials(user.departmentId);
            setStats(prev => ({ ...prev, materials: materials.length || 0 }));
          } catch (error) {
            console.error("Error fetching materials:", error);
          }
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const getAttendanceColor = (percentage) => {
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {user?.name}!
            </h1>
            <p className="text-gray-600">
              Student Dashboard - Track your academic progress
            </p>
            {user?.departmentId && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm bg-gray-50 p-4 rounded-md">
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 mr-2">Roll Number:</span>
                  <span className="text-gray-900">{user.rollNumber || 'N/A'}</span>
                </div>
                <div className="flex items-center">
                   <span className="font-semibold text-gray-700 mr-2">Department:</span>
                   <span className="text-gray-900">{user.departmentName} ({user.departmentCode})</span>
                </div>
                <div className="flex items-center">
                   <span className="font-semibold text-gray-700 mr-2">Year:</span>
                   <span className="text-gray-900">{user.joiningYear || 'N/A'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Attendance Card */}
            <div 
              onClick={() => navigate('/student/attendance')}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary-500 cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Avg. Attendance</p>
                  <h3 className={`text-3xl font-bold mt-2 ${getAttendanceColor(stats.attendance)}`}>
                    {loading ? '...' : `${stats.attendance.toFixed(1)}%`}
                  </h3>
                </div>
                <div className="p-3 bg-primary-50 rounded-full">
                  <FiCheckCircle className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-4">Click to view details</p>
            </div>

            {/* Announcements Card */}
            <div 
              onClick={() => navigate(ROUTES.ANNOUNCEMENTS)}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500 cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Announcements</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">
                    {loading ? '...' : stats.announcements}
                  </h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-full">
                   <FiBell className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-4">Latest updates</p>
            </div>

            {/* Materials Card */}
            <div 
              onClick={() => navigate('/student/materials')}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500 cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Study Materials</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">
                     {loading ? '...' : stats.materials}
                  </h3>
                </div>
                <div className="p-3 bg-green-50 rounded-full">
                  <FiFileText className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-4">Available resources</p>
            </div>

            {/* Chat Card */}
            <div 
              onClick={() => navigate(ROUTES.CHAT)}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500 cursor-pointer hover:shadow-lg transition-all"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wide">Messages</p>
                  <h3 className="text-3xl font-bold text-gray-900 mt-2">
                     Chat
                  </h3>
                </div>
                <div className="p-3 bg-purple-50 rounded-full">
                  <FiMessageSquare className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-400 mt-4">Connect with peers</p>
            </div>
          </div>

          {/* Quick Links Section - Reorganized */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button 
                onClick={() => navigate(ROUTES.ANNOUNCEMENTS)}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <FiBell className="h-5 w-5 text-blue-500 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">Announcements</h3>
                  <p className="text-xs text-gray-500">Updates</p>
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/student/attendance')}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <FiCalendar className="h-5 w-5 text-primary-500 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">Attendance</h3>
                  <p className="text-xs text-gray-500">View Reports</p>
                </div>
              </button>
              
              <button 
                onClick={() => navigate('/student/materials')}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <FiFileText className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">Materials</h3>
                  <p className="text-xs text-gray-500">Downloads</p>
                </div>
              </button>

              <button 
                onClick={() => navigate(ROUTES.CHAT)}
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
              >
                <FiMessageSquare className="h-5 w-5 text-purple-500 mr-3" />
                <div>
                  <h3 className="font-semibold text-gray-900">Chat</h3>
                  <p className="text-xs text-gray-500">Groups & DMs</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
