import axiosInstance from '../utils/axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const announcementService = {
    // Get all announcements
    getAllAnnouncements: async (departmentId = null, page = 0, size = 10) => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });

        if (departmentId) {
            params.append('departmentId', departmentId);
        }

        const response = await axiosInstance.get(`${API_ENDPOINTS.ANNOUNCEMENTS}?${params}`);
        return response.data;
    },

    // Get announcement by ID
    getAnnouncementById: async (id) => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.ANNOUNCEMENTS}/${id}`);
        return response.data;
    },

    // Create announcement
    createAnnouncement: async (data) => {
        const response = await axiosInstance.post(API_ENDPOINTS.ANNOUNCEMENTS, data);
        return response.data;
    },

    // Update announcement
    updateAnnouncement: async (id, data) => {
        const response = await axiosInstance.put(`${API_ENDPOINTS.ANNOUNCEMENTS}/${id}`, data);
        return response.data;
    },

    // Delete announcement
    deleteAnnouncement: async (id) => {
        await axiosInstance.delete(`${API_ENDPOINTS.ANNOUNCEMENTS}/${id}`);
    },

    // Upload attachment
    uploadAttachment: async (id, file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post(
            `${API_ENDPOINTS.ANNOUNCEMENTS}/${id}/attachment`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
        );
        return response.data;
    },

    // Download attachment
    downloadAttachment: async (id) => {
        const response = await axiosInstance.get(
            `${API_ENDPOINTS.ANNOUNCEMENTS}/${id}/attachment`,
            {
                responseType: 'blob',
            }
        );
        // Return both blob and headers to extract filename
        const contentDisposition = response.headers['content-disposition'];
        let filename = 'attachment';
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (filenameMatch) {
                filename = filenameMatch[1];
            }
        }
        return { blob: response.data, filename };
    },
};
