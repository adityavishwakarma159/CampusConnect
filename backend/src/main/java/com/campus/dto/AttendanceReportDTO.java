package com.campus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceReportDTO {
    private String rollNumber;
    private String studentName;
    private String subject;
    private Long totalClasses;
    private Long presentCount;
    private Long absentCount;
    private Double percentage;
}
