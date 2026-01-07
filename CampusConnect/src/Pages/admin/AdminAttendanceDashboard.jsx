import { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import { attendanceService } from '../../services/attendanceService';
import { departmentService } from '../../services/departmentService';
import { FiUsers, FiCalendar, FiTrendingUp, FiBook } from 'react-icons/fi';

const AdminAttendanceDashboard = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (selectedDepartment) {
      fetchStats();
    }
  }, [selectedDepartment, startDate, endDate]);

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getAllDepartments();
      setDepartments(data);
      if (data.length > 0) {
        setSelectedDepartment(data[0].id.toString());
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Fetch attendance statistics for the selected department
      const response = await attendanceService.getAttendanceReport(
        selectedDepartment,
        startDate,
        endDate
      );
      setStats(response);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const calculateOverallPercentage = () => {
    if (!stats || !stats.length) return 0;
    const total = stats.reduce((sum, s) => sum + s.totalClasses, 0);
    const present = stats.reduce((sum, s) => sum + s.presentCount, 0);
    return total > 0 ? ((present / total) * 100).toFixed(1) : 0;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Attendance Dashboard</h1>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="input-field"
                >
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={fetchStats}
                  className="btn-primary w-full"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          {stats && stats.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.length}</p>
                  </div>
                  <FiUsers className="h-10 w-10 text-blue-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Overall Attendance</p>
                    <p className="text-2xl font-bold text-green-600">{calculateOverallPercentage()}%</p>
                  </div>
                  <FiTrendingUp className="h-10 w-10 text-green-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Classes</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.reduce((sum, s) => sum + s.totalClasses, 0)}
                    </p>
                  </div>
                  <FiCalendar className="h-10 w-10 text-purple-600" />
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Subjects</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {new Set(stats.map(s => s.subject)).size}
                    </p>
                  </div>
                  <FiBook className="h-10 w-10 text-orange-600" />
                </div>
              </div>
            </div>
          )}

          {/* Student Attendance Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Student Attendance Details</h2>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : !stats || stats.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p>No attendance data available for the selected period</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Roll No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Student Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Subject
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total Classes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Present
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Absent
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Percentage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats.map((student, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.rollNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.studentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {student.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.totalClasses}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          {student.presentCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                          {student.absentCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            student.percentage >= 75 
                              ? 'bg-green-100 text-green-800'
                              : student.percentage >= 60
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {student.percentage.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminAttendanceDashboard;
