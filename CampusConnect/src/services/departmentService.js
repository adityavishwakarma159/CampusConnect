import axiosInstance from '../utils/axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const departmentService = {
    // Get all departments
    getAllDepartments: async () => {
        const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.DEPARTMENTS);
        return response.data;
    },

    // Create department
    createDepartment: async (name, code) => {
        const params = new URLSearchParams({ name, code });
        const response = await axiosInstance.post(`${API_ENDPOINTS.ADMIN.DEPARTMENTS}?${params}`);
        return response.data;
    },

    // Update department
    updateDepartment: async (id, name, code) => {
        const params = new URLSearchParams({ name, code });
        const response = await axiosInstance.put(`${API_ENDPOINTS.ADMIN.DEPARTMENTS}/${id}?${params}`);
        return response.data;
    },

    // Delete department
    deleteDepartment: async (id) => {
        await axiosInstance.delete(`${API_ENDPOINTS.ADMIN.DEPARTMENTS}/${id}`);
    },
};
