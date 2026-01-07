package com.campus.controller;

import com.campus.dto.UserDTO;
import com.campus.model.User;
import com.campus.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
public class FacultyController {
    
    private final UserService userService;
    
    /**
     * Get all users (students and faculty) in a specific department
     * Faculty can access this to view students in their department
     */
    @GetMapping("/department/{departmentId}/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<List<UserDTO>> getUsersByDepartment(@PathVariable Long departmentId) {
        List<User> users = userService.getUsersByDepartment(departmentId);
        List<UserDTO> userDTOs = users.stream()
                .map(userService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }
    
    /**
     * Get only students in a specific department
     */
    @GetMapping("/department/{departmentId}/students")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<List<UserDTO>> getStudentsByDepartment(@PathVariable Long departmentId) {
        List<User> users = userService.getUsersByDepartment(departmentId);
        List<UserDTO> studentDTOs = users.stream()
                .filter(user -> user.getRole() == User.Role.STUDENT)
                .map(userService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(studentDTOs);
    }
}
