import axiosInstance from '../utils/axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const studyMaterialService = {
    // Upload material
    uploadMaterial: async (formData) => {
        const response = await axiosInstance.post(API_ENDPOINTS.STUDY_MATERIALS, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Get all materials
    getMaterials: async () => {
        const response = await axiosInstance.get(API_ENDPOINTS.STUDY_MATERIALS);
        return response.data;
    },

    // Get material by ID
    getMaterialById: async (id) => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.STUDY_MATERIALS}/${id}`);
        return response.data;
    },

    // Update material
    updateMaterial: async (id, data) => {
        const response = await axiosInstance.put(`${API_ENDPOINTS.STUDY_MATERIALS}/${id}`, data);
        return response.data;
    },

    // Delete material
    deleteMaterial: async (id) => {
        const response = await axiosInstance.delete(`${API_ENDPOINTS.STUDY_MATERIALS}/${id}`);
        return response.data;
    },


    // Download material
    downloadMaterial: async (id) => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.STUDY_MATERIALS}/${id}/download`, {
            responseType: 'blob'
        });
        return response.data;
    },


    // Search materials
    searchMaterials: async (params) => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.STUDY_MATERIALS}/search`, { params });
        return response.data;
    },


    // Get subjects
    getSubjects: async () => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.STUDY_MATERIALS}/subjects`);
        return response.data;
    },

    // Get materials uploaded by current faculty
    getMyMaterials: async () => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.STUDY_MATERIALS}/my-materials`);
        return response.data;
    },
};
