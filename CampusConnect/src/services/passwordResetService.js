import axiosInstance from '../utils/axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const passwordResetService = {
    // Get pending password reset requests
    getPendingRequests: async () => {
        const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.PASSWORD_RESET_REQUESTS);
        return response.data;
    },

    // Approve password reset request
    approveRequest: async (requestId) => {
        const response = await axiosInstance.post(
            `${API_ENDPOINTS.ADMIN.PASSWORD_RESET_REQUESTS}/${requestId}/approve`
        );
        return response.data;
    },

    // Reject password reset request
    rejectRequest: async (requestId, reason = '') => {
        const params = reason ? `?reason=${encodeURIComponent(reason)}` : '';
        const response = await axiosInstance.post(
            `${API_ENDPOINTS.ADMIN.PASSWORD_RESET_REQUESTS}/${requestId}/reject${params}`
        );
        return response.data;
    },
};
