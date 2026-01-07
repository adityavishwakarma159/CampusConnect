import axiosInstance from '../utils/axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const chatService = {
    // Get conversation list
    getConversations: async () => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.CHAT}/conversations`);
        return response.data;
    },

    // Get message history with a user
    getMessageHistory: async (otherUserId) => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.CHAT}/messages/${otherUserId}`);
        return response.data;
    },

    // Get users to chat with (same department)
    getChatUsers: async () => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.CHAT}/users`);
        return response.data;
    },

    // Mark messages as read
    markAsRead: async (otherUserId) => {
        const response = await axiosInstance.post(`${API_ENDPOINTS.CHAT}/mark-read/${otherUserId}`);
        return response.data;
    },

    // Get group messages
    getGroupMessages: async (departmentId, chatType = 'DEPARTMENT_GROUP') => {
        const response = await axiosInstance.get(
            `${API_ENDPOINTS.CHAT}/groups/${departmentId}?chatType=${chatType}`
        );
        return response.data;
    },

    // Get group participants
    getGroupParticipants: async (departmentId) => {
        const response = await axiosInstance.get(
            `${API_ENDPOINTS.CHAT}/groups/${departmentId}/participants`
        );
        return response.data;
    },

    // Get group permissions
    getGroupPermissions: async (departmentId, chatType = 'DEPARTMENT_GROUP') => {
        const response = await axiosInstance.get(
            `${API_ENDPOINTS.CHAT}/groups/${departmentId}/permissions?chatType=${chatType}`
        );
        return response.data;
    },
};
