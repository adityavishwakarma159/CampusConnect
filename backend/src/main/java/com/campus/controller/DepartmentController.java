package com.campus.controller;

import com.campus.dto.ApiResponse;
import com.campus.dto.DepartmentDTO;
import com.campus.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/departments")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class DepartmentController {
    
    private final DepartmentService departmentService;
    
    @GetMapping
    public ResponseEntity<List<DepartmentDTO>> getAllDepartments() {
        List<DepartmentDTO> departments = departmentService.getAllDepartments();
        return ResponseEntity.ok(departments);
    }
    
    @PostMapping
    public ResponseEntity<DepartmentDTO> createDepartment(
            @RequestParam String name,
            @RequestParam String code
    ) {
        DepartmentDTO department = departmentService.createDepartment(name, code);
        return ResponseEntity.status(HttpStatus.CREATED).body(department);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<DepartmentDTO> updateDepartment(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam String code
    ) {
        DepartmentDTO department = departmentService.updateDepartment(id, name, code);
        return ResponseEntity.ok(department);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(new ApiResponse(true, "Department deleted successfully"));
    }
}
