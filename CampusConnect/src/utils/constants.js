// API Endpoints
export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REFRESH: '/auth/refresh',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
        FIRST_TIME_SETUP: '/auth/first-time-setup',
        REQUEST_PASSWORD_RESET: '/auth/request-password-reset',
    },
    ADMIN: {
        USERS: '/admin/users',
        BULK_UPLOAD: '/admin/users/bulk-upload',
        DEPARTMENTS: '/admin/departments',
        PASSWORD_RESET_REQUESTS: '/admin/password-reset-requests',
    },
    FACULTY: {
        DEPARTMENT_USERS: '/faculty/department',
    },
    ANNOUNCEMENTS: '/announcements',
    NOTIFICATIONS: '/notifications',
    CHAT: '/chat',
    ATTENDANCE: '/attendance',
    STUDY_MATERIALS: '/study-materials',
};

// User Roles
export const ROLES = {
    ADMIN: 'ADMIN',
    FACULTY: 'FACULTY',
    STUDENT: 'STUDENT',
};

// Local Storage Keys
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER: 'user',
};

// Routes
export const ROUTES = {
    LOGIN: '/login',
    FIRST_TIME_SETUP: '/first-time-setup',
    PASSWORD_RESET: '/password-reset',
    UNAUTHORIZED: '/unauthorized',
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_USERS: '/admin/users',
    ADMIN_BULK_UPLOAD: '/admin/bulk-upload',
    ADMIN_PASSWORD_RESET_REQUESTS: '/admin/password-reset-requests',
    ADMIN_DEPARTMENTS: '/admin/departments',
    ANNOUNCEMENTS: '/announcements',
    ANNOUNCEMENTS_CREATE: '/announcements/create',
    ANNOUNCEMENTS_DETAIL: '/announcements/:id',
    NOTIFICATIONS: '/notifications',
    CHAT: '/chat',
    FACULTY_DASHBOARD: '/faculty/dashboard',
    STUDENT_DASHBOARD: '/student/dashboard',
};
