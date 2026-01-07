import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import { attendanceService } from '../../services/attendanceService';
import { FiCalendar, FiSearch, FiArrowLeft } from 'react-icons/fi';

const FacultyAttendanceHistory = () => {
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchAttendance = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const history = await attendanceService.getFacultyHistory(startDate, endDate, subject);
      setAttendanceRecords(history);
      
      if (history.length === 0) {
        setMessage({ type: 'info', text: 'No attendance records found for the selected period' });
      }
    } catch (error) {
      console.error('Error fetching attendance history:', error);
      setMessage({ type: 'error', text: 'Failed to load attendance history' });
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <Link to="/faculty/dashboard" className="text-gray-600 hover:text-gray-900">
                  <FiArrowLeft className="h-6 w-6" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">Attendance History</h1>
              </div>
              <Link to="/faculty/attendance/mark" className="btn-primary">
                <FiCalendar className="inline mr-2" />
                Mark Attendance
              </Link>
            </div>

            {message.text && (
              <div className={`mb-4 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-800' :
                message.type === 'error' ? 'bg-red-50 text-red-800' :
                'bg-blue-50 text-blue-800'
              }`}>
                {message.text}
              </div>
            )}

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject (Optional)
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Filter by subject"
                  className="input-field"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={fetchAttendance}
                  className="btn-primary w-full"
                >
                  <FiSearch className="inline mr-2" />
                  Search
                </button>
              </div>
            </div>

            {/* Attendance Records Table */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : attendanceRecords.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FiCalendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p>No attendance records found for the selected period</p>
                <p className="text-sm mt-2">Try adjusting your filters or mark new attendance</p>
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
                        Total Students
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Present
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Absent
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendanceRecords.map((record, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.rollNumber).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {record.subject}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.totalClasses}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                          {record.presentCount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                          {record.absentCount}
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

export default FacultyAttendanceHistory;
