import axiosInstance from '../utils/axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const userService = {
  // Get all users with pagination and filters
  getAllUsers: async (page = 0, size = 10, filters = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });

    if (filters.role) params.append('role', filters.role);
    if (filters.departmentId) params.append('departmentId', filters.departmentId);
    if (filters.search) params.append('search', filters.search);

    const response = await axiosInstance.get(`${API_ENDPOINTS.ADMIN.USERS}?${params}`);
    return response.data;
  },

  // Get user by ID
  getUserById: async (id) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.ADMIN.USERS}/${id}`);
    return response.data;
  },

  // Create user
  createUser: async (userData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN.USERS, userData);
    return response.data;
  },

  // Update user
  updateUser: async (id, userData) => {
    const response = await axiosInstance.put(`${API_ENDPOINTS.ADMIN.USERS}/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id) => {
    await axiosInstance.delete(`${API_ENDPOINTS.ADMIN.USERS}/${id}`);
  },

  // Toggle user status (activate/deactivate)
  toggleUserStatus: async (id) => {
    const response = await axiosInstance.put(`${API_ENDPOINTS.ADMIN.USERS}/${id}/toggle-status`);
    return response.data;
  },


  // Get users by department (Admin only)
  getUsersByDepartment: async (departmentId) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.ADMIN.USERS}/department/${departmentId}`);
    return response.data;
  },

  // Get users by department (Faculty accessible)
  getUsersByDepartmentForFaculty: async (departmentId) => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.FACULTY.DEPARTMENT_USERS}/${departmentId}/users`);
    return response.data;
  },

  // Bulk upload users
  bulkUploadUsers: async (file, userType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userType', userType);

    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN.BULK_UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
