package com.campus.controller;

import com.campus.dto.BulkUploadResponse;
import com.campus.dto.CreateUserRequest;
import com.campus.dto.PageResponse;
import com.campus.dto.UpdateUserRequest;
import com.campus.dto.UserDTO;
import com.campus.model.User;
import com.campus.service.ExcelService;
import com.campus.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {
    
    private final UserService userService;
    private final ExcelService excelService;
    
    @GetMapping
    public ResponseEntity<PageResponse<UserDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) User.Role role,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) String search
    ) {
        PageResponse<UserDTO> response = userService.getAllUsers(page, size, role, departmentId, search);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
    
    @PostMapping
    public ResponseEntity<UserDTO> createUser(@Valid @RequestBody CreateUserRequest request) {
        UserDTO user = userService.createUser(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(user);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request
    ) {
        UserDTO user = userService.updateUser(id, request);
        return ResponseEntity.ok(user);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
    
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<UserDTO> toggleUserStatus(@PathVariable Long id) {
        UserDTO user = userService.toggleUserStatus(id);
        return ResponseEntity.ok(user);
    }
    
    
    @PostMapping("/bulk-upload")
    public ResponseEntity<BulkUploadResponse> bulkUpload(
            @RequestParam("file") MultipartFile file,
            @RequestParam("userType") String userType
    ) {
        BulkUploadResponse response;
        
        if ("STUDENT".equalsIgnoreCase(userType)) {
            response = excelService.processStudentExcel(file);
        } else if ("FACULTY".equalsIgnoreCase(userType)) {
            response = excelService.processFacultyExcel(file);
        } else {
            throw new IllegalArgumentException("Invalid user type. Must be STUDENT or FACULTY");
        }
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/department/{departmentId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<java.util.List<UserDTO>> getUsersByDepartment(@PathVariable Long departmentId) {
        java.util.List<User> users = userService.getUsersByDepartment(departmentId);
        java.util.List<UserDTO> userDTOs = users.stream()
                .map(userService::convertToDTO)
                .collect(java.util.stream.Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }
}
