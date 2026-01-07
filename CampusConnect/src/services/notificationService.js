import axiosInstance from '../utils/axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const notificationService = {
    // Get user notifications
    getNotifications: async (page = 0, size = 10) => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });

        const response = await axiosInstance.get(`${API_ENDPOINTS.NOTIFICATIONS}?${params}`);
        return response.data;
    },

    // Get recent notifications (top 5)
    getRecentNotifications: async () => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.NOTIFICATIONS}/recent`);
        return response.data;
    },

    // Get unread count
    getUnreadCount: async () => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.NOTIFICATIONS}/unread-count`);
        return response.data;
    },

    // Mark notification as read
    markAsRead: async (id) => {
        const response = await axiosInstance.put(`${API_ENDPOINTS.NOTIFICATIONS}/${id}/mark-read`);
        return response.data;
    },

    // Mark all notifications as read
    markAllAsRead: async () => {
        const response = await axiosInstance.put(`${API_ENDPOINTS.NOTIFICATIONS}/mark-all-read`);
        return response.data;
    },
};
