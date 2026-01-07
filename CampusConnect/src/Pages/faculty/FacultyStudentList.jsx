import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import { FiSearch, FiMail, FiUser, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';

const FacultyStudentList = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, students]);

  const loadStudents = async () => {
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      console.log('Loading students for department:', user.departmentId);
      
      if (!user.departmentId) {
        setMessage({ type: 'error', text: 'Department ID not found. Please contact admin.' });
        setLoading(false);
        return;
      }
      
      const data = await userService.getUsersByDepartmentForFaculty(user.departmentId);
      console.log('Received data:', data);
      
      const studentList = data.filter(u => u.role === 'STUDENT');
      console.log('Filtered students:', studentList.length);
      
      setStudents(studentList);
      setFilteredStudents(studentList);
      
      if (studentList.length === 0) {
        setMessage({ type: 'info', text: 'No students found in your department.' });
      }
    } catch (error) {
      console.error('Error loading students:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || error.message || 'Failed to load students. Please check console for details.' 
      });
    } finally {
      setLoading(false);
    }
  };

  const filterStudents = () => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
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
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Department Students</h1>
                  <p className="text-sm text-gray-600 mt-1">{user?.departmentName}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              </div>
            </div>

            {message.text && (
              <div className={`mb-4 p-4 rounded-lg ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}>
                {message.text}
              </div>
            )}

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, roll number, or email..."
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Students Table */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FiUser className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p>No students found</p>
                {searchTerm && <p className="text-sm mt-2">Try adjusting your search</p>}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Roll Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {student.rollNumber || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <FiUser className="h-5 w-5 text-primary-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <FiMail className="h-4 w-4 mr-2 text-gray-400" />
                            {student.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            student.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {student.isActive ? (
                              <>
                                <FiCheckCircle className="inline mr-1 h-3 w-3" />
                                Active
                              </>
                            ) : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            to={`/chat?userId=${student.id}`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            Message
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Summary */}
            {!loading && filteredStudents.length > 0 && (
              <div className="mt-4 text-sm text-gray-600">
                Showing {filteredStudents.length} of {students.length} students
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default FacultyStudentList;
