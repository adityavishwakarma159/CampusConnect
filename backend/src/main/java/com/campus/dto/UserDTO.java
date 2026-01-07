package com.campus.dto;

import com.campus.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    
    private Long id;
    private String email;
    private String name;
    private User.Role role;
    private Long departmentId;
    private String departmentName;
    private String departmentCode;
    private String rollNumber;
    private Integer joiningYear;
    private String designation;
    private String profilePicture;
    private Boolean isFirstLogin;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
