import { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';
import { attendanceService } from '../../services/attendanceService';
import { userService } from '../../services/userService';
import { FiCheck, FiX, FiClock, FiSave } from 'react-icons/fi';

const MarkAttendance = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [subject, setSubject] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    setLoading(true);
    try {
      const data = await userService.getUsersByDepartmentForFaculty(user.departmentId);
      const studentList = data.filter(u => u.role === 'STUDENT');
      setStudents(studentList);
      
      // Initialize attendance state
      const initialAttendance = {};
      studentList.forEach(student => {
        initialAttendance[student.id] = { status: 'PRESENT', remarks: '' };
      });
      setAttendance(initialAttendance);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load students' });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], status }
    }));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: { ...prev[studentId], remarks }
    }));
  };

  const markAllPresent = () => {
    const updated = {};
    students.forEach(student => {
      updated[student.id] = { status: 'PRESENT', remarks: '' };
    });
    setAttendance(updated);
  };

  const markAllAbsent = () => {
    const updated = {};
    students.forEach(student => {
      updated[student.id] = { status: 'ABSENT', remarks: '' };
    });
    setAttendance(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!subject.trim()) {
      setMessage({ type: 'error', text: 'Please enter subject' });
      return;
    }

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const attendanceList = Object.entries(attendance).map(([studentId, data]) => ({
        studentId: parseInt(studentId),
        status: data.status,
        remarks: data.remarks || null
      }));

      await attendanceService.markAttendance({
        date,
        subject: subject.trim(),
        attendanceList
      });

      setMessage({ type: 'success', text: 'Attendance marked successfully!' });
      setSubject('');
      markAllPresent(); // Reset to all present
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to mark attendance' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Mark Attendance</h1>

            {message.text && (
              <div className={`mb-4 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Date and Subject */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-field"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g., Mathematics, Physics"
                    className="input-field"
                    required
                  />
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="flex gap-2 mb-4">
                <button
                  type="button"
                  onClick={markAllPresent}
                  className="btn-secondary text-sm"
                >
                  <FiCheck className="inline mr-1" />
                  Mark All Present
                </button>
                <button
                  type="button"
                  onClick={markAllAbsent}
                  className="btn-secondary text-sm"
                >
                  <FiX className="inline mr-1" />
                  Mark All Absent
                </button>
              </div>

              {/* Student List */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
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
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Remarks
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map(student => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.rollNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleStatusChange(student.id, 'PRESENT')}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                  attendance[student.id]?.status === 'PRESENT'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                <FiCheck className="inline mr-1" />
                                Present
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(student.id, 'ABSENT')}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                  attendance[student.id]?.status === 'ABSENT'
                                    ? 'bg-red-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                <FiX className="inline mr-1" />
                                Absent
                              </button>
                              <button
                                type="button"
                                onClick={() => handleStatusChange(student.id, 'LATE')}
                                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                                  attendance[student.id]?.status === 'LATE'
                                    ? 'bg-yellow-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                <FiClock className="inline mr-1" />
                                Late
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={attendance[student.id]?.remarks || ''}
                              onChange={(e) => handleRemarksChange(student.id, e.target.value)}
                              placeholder="Optional"
                              className="input-field text-sm"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || students.length === 0}
                  className="btn-primary"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white inline-block mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave className="inline mr-2" />
                      Save Attendance
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MarkAttendance;
