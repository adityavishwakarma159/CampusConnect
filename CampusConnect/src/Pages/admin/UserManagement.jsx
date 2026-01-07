import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/common/Header';
import AddUserModal from '../../components/admin/AddUserModal';
import { userService } from '../../services/userService';
import { departmentService } from '../../services/departmentService';
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiFilter, FiUser } from 'react-icons/fi';
import { ROUTES } from '../../utils/constants';
import { impersonationService } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';

const UserManagement = () => {
  const { setUser, setToken } = useAuth();
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [page, search, roleFilter, departmentFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const filters = {};
      if (search) filters.search = search;
      if (roleFilter) filters.role = roleFilter;
      if (departmentFilter) filters.departmentId = departmentFilter;

      const response = await userService.getAllUsers(page, 10, filters);
      setUsers(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const depts = await departmentService.getAllDepartments();
      setDepartments(depts);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this user?')) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to deactivate user');
      }
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        // Call toggle active endpoint
        await userService.toggleUserStatus(id);
        fetchUsers();
      } catch (error) {
        console.error(`Error ${action}ing user:`, error);
        alert(`Failed to ${action} user`);
      }
    }
  };

  const handleImpersonate = async (userId) => {
    if (window.confirm('Impersonate this user? You will be logged in as them.')) {
      try {
        const response = await impersonationService.impersonateUser(userId);
        // Store token and reload
        localStorage.setItem('token', response.token);
        window.location.href = '/';
      } catch (error) {
        console.error('Error impersonating user:', error);
        alert('Failed to impersonate user');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary"
              >
                <FiPlus className="inline mr-2" />
                Add User
              </button>
              <Link to={ROUTES.ADMIN_BULK_UPLOAD} className="btn-secondary">
                Bulk Upload
              </Link>
            </div>
          </div>

          {/* Add User Modal */}
          <AddUserModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onSuccess={fetchUsers}
          />

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-10"
                />
              </div>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="input-field"
              >
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="FACULTY">Faculty</option>
                <option value="STUDENT">Student</option>
              </select>

              {/* Department Filter */}
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="input-field"
              >
                <option value="">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : (
              <>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map(user => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                            user.role === 'FACULTY' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.departmentName || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleImpersonate(user.id)}
                              className="text-purple-600 hover:text-purple-900"
                              title="Impersonate User"
                            >
                              <FiUser />
                            </button>
                            <button 
                              onClick={() => handleToggleActive(user.id, user.isActive)}
                              className="text-primary-600 hover:text-primary-900"
                              title={user.isActive ? 'Deactivate' : 'Activate'}
                            >
                              <FiEdit2 />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete User"
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setPage(p => Math.max(0, p - 1))}
                        disabled={page === 0}
                        className="btn-secondary disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={page >= totalPages - 1}
                        className="btn-secondary disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Page <span className="font-medium">{page + 1}</span> of <span className="font-medium">{totalPages}</span>
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                          <button
                            onClick={() => setPage(p => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Previous
                          </button>
                          <button
                            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                            disabled={page >= totalPages - 1}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserManagement;
