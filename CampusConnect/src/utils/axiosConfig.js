import axios from 'axios';
import { STORAGE_KEYS } from './constants';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

            if (refreshToken) {
                try {
                    const { data } = await axios.post(
                        `${API_BASE_URL}/auth/refresh`,
                        { refreshToken }
                    );

                    // Update access token
                    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.accessToken);

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    // Refresh failed, clear storage and redirect to login
                    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER);
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token, redirect to login
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
