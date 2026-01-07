package com.campus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendancePercentageDTO {
    
    private Long totalDays;
    private Long presentDays;
    private Long absentDays;
    private Long lateDays;
    private Double percentage;
}
