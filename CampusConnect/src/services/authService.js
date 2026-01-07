import axiosInstance from '../utils/axiosConfig';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';

export const authService = {
    // Login user
    login: async (email, password) => {
        const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
            email,
            password,
        });
        return response.data;
    },

    // Refresh access token
    refreshToken: async (refreshToken) => {
        const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REFRESH, {
            refreshToken,
        });
        return response.data;
    },

    // Logout user
    logout: async () => {
        try {
            await axiosInstance.post(API_ENDPOINTS.AUTH.LOGOUT);
        } finally {
            // Clear local storage regardless of API response
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
        }
    },

    // Get current user
    getCurrentUser: async () => {
        const response = await axiosInstance.get(API_ENDPOINTS.AUTH.ME);
        return response.data;
    },

    // First-time password setup
    firstTimeSetup: async (newPassword) => {
        const response = await axiosInstance.post(API_ENDPOINTS.AUTH.FIRST_TIME_SETUP, {
            newPassword,
        });
        return response.data;
    },

    // Request password reset
    requestPasswordReset: async () => {
        const response = await axiosInstance.post(API_ENDPOINTS.AUTH.REQUEST_PASSWORD_RESET);
        return response.data;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        return !!token;
    },

    // Get stored user
    getStoredUser: () => {
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);
        return userStr ? JSON.parse(userStr) : null;
    },
};
