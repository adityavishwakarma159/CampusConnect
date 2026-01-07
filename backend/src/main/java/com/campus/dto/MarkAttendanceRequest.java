package com.campus.dto;

import com.campus.model.Attendance;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarkAttendanceRequest {
    
    @NotNull(message = "Date is required")
    private LocalDate date;
    
    @NotNull(message = "Subject is required")
    private String subject;
    
    @NotNull(message = "Attendance list is required")
    private List<StudentAttendance> attendanceList;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StudentAttendance {
        @NotNull(message = "Student ID is required")
        private Long studentId;
        
        @NotNull(message = "Status is required")
        private Attendance.AttendanceStatus status;
        
        private String remarks;
    }
}
