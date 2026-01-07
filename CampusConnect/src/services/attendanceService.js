import axiosInstance from '../utils/axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

export const attendanceService = {
    // Mark bulk attendance
    markAttendance: async (attendanceData) => {
        const response = await axiosInstance.post(`${API_ENDPOINTS.ATTENDANCE}/mark`, attendanceData);
        return response.data;
    },

    // Get attendance by date
    getAttendanceByDate: async (date) => {
        const response = await axiosInstance.get(`${API_ENDPOINTS.ATTENDANCE}/date/${date}`);
        return response.data;
    },

    // Get student attendance history
    getStudentAttendance: async (studentId, from = null, to = null) => {
        const params = {};
        if (from) params.from = from;
        if (to) params.to = to;

        const response = await axiosInstance.get(
            `${API_ENDPOINTS.ATTENDANCE}/student/${studentId}`,
            { params }
        );
        return response.data;
    },

    // Get attendance percentage
    getAttendancePercentage: async (studentId, from = null, to = null) => {
        const params = {};
        if (from) params.from = from;
        if (to) params.to = to;

        const response = await axiosInstance.get(
            `${API_ENDPOINTS.ATTENDANCE}/student/${studentId}/percentage`,
            { params }
        );
        return response.data;
    },

    // Update attendance
    updateAttendance: async (id, status, remarks = null) => {
        const params = { status };
        if (remarks) params.remarks = remarks;

        const response = await axiosInstance.put(
            `${API_ENDPOINTS.ATTENDANCE}/${id}`,
            null,
            { params }
        );
        return response.data;
    },

    // Download attendance report (Excel)
    downloadReport: async (departmentId, startDate, endDate) => {
        const params = new URLSearchParams({
            departmentId: departmentId.toString(),
            startDate,
            endDate,
        });

        const response = await axiosInstance.get(
            `${API_ENDPOINTS.ATTENDANCE}/report/download?${params}`,
            {
                responseType: 'blob',
            }
        );

        return response.data;
    },

    // Get attendance report for admin dashboard
    getAttendanceReport: async (departmentId, startDate, endDate) => {
        const params = new URLSearchParams({
            departmentId: departmentId.toString(),
            startDate,
            endDate,
        });

        const response = await axiosInstance.get(
            `${API_ENDPOINTS.ATTENDANCE}/report?${params}`
        );

        return response.data;
    },

    // Get faculty attendance history
    getFacultyHistory: async (startDate, endDate, subject = null) => {
        const params = new URLSearchParams({
            startDate,
            endDate,
        });

        if (subject) {
            params.append('subject', subject);
        }

        const response = await axiosInstance.get(
            `${API_ENDPOINTS.ATTENDANCE}/faculty/history?${params}`
        );
        return response.data;
    },

    // Delete attendance
    deleteAttendance: async (id) => {
        const response = await axiosInstance.delete(`${API_ENDPOINTS.ATTENDANCE}/${id}`);
        return response.data;
    },
};
