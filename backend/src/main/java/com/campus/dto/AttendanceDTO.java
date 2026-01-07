package com.campus.dto;

import com.campus.model.Attendance;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceDTO {
    
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentRollNumber;
    private Long markedById;
    private String markedByName;
    private LocalDate date;
    private Attendance.AttendanceStatus status;
    private String subject;
    private String remarks;
    private LocalDateTime createdAt;
}
