import { useState, useEffect } from 'react';
import Header from '../../components/common/Header';
import { departmentService } from '../../services/departmentService';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '' });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const data = await departmentService.getAllDepartments();
      setDepartments(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await departmentService.updateDepartment(editingId, formData.name, formData.code);
        alert('Department updated successfully');
      } else {
        await departmentService.createDepartment(formData.name, formData.code);
        alert('Department created successfully');
      }
      setFormData({ name: '', code: '' });
      setShowForm(false);
      setEditingId(null);
      fetchDepartments();
    } catch (error) {
      console.error('Error saving department:', error);
      alert('Failed to save department: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEdit = (dept) => {
    setFormData({ name: dept.name, code: dept.code });
    setEditingId(dept.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentService.deleteDepartment(id);
        alert('Department deleted successfully');
        fetchDepartments();
      } catch (error) {
        console.error('Error deleting department:', error);
        alert('Failed to delete department: ' + (error.response?.data?.message || error.message));
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: '', code: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary"
            >
              <FiPlus className="inline mr-2" />
              Add Department
            </button>
          </div>

          {/* Add/Edit Department Form */}
          {showForm && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingId ? 'Edit Department' : 'Add New Department'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="e.g., Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department Code *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      className="input-field"
                      placeholder="e.g., CS"
                      maxLength={10}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingId ? 'Update Department' : 'Create Department'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Departments List */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {departments.map(dept => (
                    <tr key={dept.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {dept.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(dept)}
                            className="text-primary-600 hover:text-primary-900"
                            title="Edit Department"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => handleDelete(dept.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete Department"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
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

export default DepartmentManagement;
