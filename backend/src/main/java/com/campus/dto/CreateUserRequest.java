package com.campus.dto;

import com.campus.model.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateUserRequest {
    
    @NotBlank(message = "Name is required")
    private String name;
    
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;
    
    @NotNull(message = "Role is required")
    private User.Role role;
    
    private Long departmentId;
    
    // Student-specific fields
    private String rollNumber;
    private Integer joiningYear;
    
    // Faculty-specific fields
    private String designation;
}
