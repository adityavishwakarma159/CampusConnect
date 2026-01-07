import axiosInstance from '../utils/axiosConfig';

export const profileService = {
    // Get profile
    getProfile: async () => {
        const response = await axiosInstance.get('/profile');
        return response.data;
    },

    // Update profile
    updateProfile: async (data) => {
        const response = await axiosInstance.put('/profile', data);
        return response.data;
    },

    // Upload profile picture
    uploadProfilePicture: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post('/profile/picture', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // Delete profile picture
    deleteProfilePicture: async () => {
        const response = await axiosInstance.delete('/profile/picture');
        return response.data;
    },

    // Get profile picture URL
    getProfilePictureUrl: (fileName) => {
        if (!fileName) return null;
        // fileName already includes 'profile-pictures/' prefix from backend
        // Extract just the filename part after the slash
        const fileNameOnly = fileName.includes('/') ? fileName.split('/').pop() : fileName;
        return `${axiosInstance.defaults.baseURL}/profile/picture/${fileNameOnly}`;
    },
};

export const impersonationService = {
    // Impersonate user
    impersonateUser: async (userId) => {
        const response = await axiosInstance.post(`/admin/impersonate/${userId}`);
        return response.data;
    },

    // Stop impersonation
    stopImpersonation: async () => {
        const response = await axiosInstance.post('/admin/stop-impersonation');
        return response.data;
    },
};
