import { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import { passwordResetService } from '../../services/passwordResetService';
import { FiCheck, FiX, FiClock } from 'react-icons/fi';

const PasswordResetApproval = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await passwordResetService.getPendingRequests();
      setRequests(data);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId) => {
    if (window.confirm('Approve this password reset request? A temporary password will be sent to the user.')) {
      try {
        await passwordResetService.approveRequest(requestId);
        fetchRequests();
        alert('Password reset approved successfully');
      } catch (error) {
        console.error('Error approving request:', error);
        alert('Failed to approve request');
      }
    }
  };

  const handleReject = async (requestId) => {
    const reason = prompt('Enter reason for rejection (optional):');
    if (reason !== null) {
      try {
        await passwordResetService.rejectRequest(requestId, reason);
        fetchRequests();
        alert('Password reset request rejected');
      } catch (error) {
        console.error('Error rejecting request:', error);
        alert('Failed to reject request');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Password Reset Requests</h1>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : requests.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FiClock className="mx-auto h-12 w-12 mb-4" />
                <p>No pending password reset requests</p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {requests.map(request => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{request.userName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{request.userEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          request.userRole === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                          request.userRole === 'FACULTY' ? 'bg-blue-100 text-blue-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {request.userRole}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {request.departmentName || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(request.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleApprove(request.id)}
                          className="text-green-600 hover:text-green-900 mr-4 inline-flex items-center"
                        >
                          <FiCheck className="mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center"
                        >
                          <FiX className="mr-1" /> Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PasswordResetApproval;
