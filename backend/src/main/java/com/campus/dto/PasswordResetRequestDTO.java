package com.campus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PasswordResetRequestDTO {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String userRole;
    private String departmentName;
    private String status;
    private LocalDateTime requestedAt;
    private String approvedByName;
    private LocalDateTime approvedAt;
}
