package com.campus.dto;

import com.campus.model.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequest {
    
    private String name;
    private User.Role role;
    private Long departmentId;
    private String rollNumber;
    private Integer joiningYear;
    private String designation;
    private Boolean isActive;
}
