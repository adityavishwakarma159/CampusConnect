import { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';
import { attendanceService } from '../../services/attendanceService';
import { FiCalendar, FiTrendingUp } from 'react-icons/fi';

const StudentAttendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [percentage, setPercentage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 months ago
    to: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadAttendance();
  }, [dateRange]);

  const loadAttendance = async () => {
    setLoading(true);
    try {
      const [attendanceData, percentageData] = await Promise.all([
        attendanceService.getStudentAttendance(user.id, dateRange.from, dateRange.to),
        attendanceService.getAttendancePercentage(user.id, dateRange.from, dateRange.to)
      ]);
      
      setAttendance(attendanceData);
      setPercentage(percentageData);
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-100 text-green-800';
      case 'ABSENT':
        return 'bg-red-100 text-red-800';
      case 'LATE':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PRESENT':
        return '✓';
      case 'ABSENT':
        return '✗';
      case 'LATE':
        return '⏰';
      default:
        return '?';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Attendance</h1>

          {/* Date Range Filter */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : (
            <>
              {/* Percentage Card */}
              {percentage && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg shadow-lg p-6 text-white md:col-span-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm opacity-90 mb-1">Overall Attendance</p>
                        <p className="text-5xl font-bold">{percentage.percentage.toFixed(1)}%</p>
                        <p className="text-sm opacity-90 mt-2">
                          {percentage.presentDays} / {percentage.totalDays} days
                        </p>
                      </div>
                      <FiTrendingUp className="h-16 w-16 opacity-50" />
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-green-100 p-3 rounded-lg">
                        <span className="text-2xl">✓</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Present</p>
                        <p className="text-2xl font-bold text-gray-900">{percentage.presentDays}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center gap-3">
                      <div className="bg-red-100 p-3 rounded-lg">
                        <span className="text-2xl">✗</span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Absent</p>
                        <p className="text-2xl font-bold text-gray-900">{percentage.absentDays}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Attendance List */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FiCalendar className="h-5 w-5" />
                    Attendance Records
                  </h2>
                </div>

                {attendance.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No attendance records found for the selected period
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Subject
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Marked By
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Remarks
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {attendance.map((record) => (
                          <tr key={record.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {new Date(record.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.subject}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                                {getStatusIcon(record.status)} {record.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {record.markedByName}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-600">
                              {record.remarks || '-'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default StudentAttendance;
