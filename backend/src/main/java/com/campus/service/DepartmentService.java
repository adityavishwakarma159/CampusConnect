package com.campus.service;

import com.campus.dto.DepartmentDTO;
import com.campus.exception.CustomExceptions;
import com.campus.model.Department;
import com.campus.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {
    
    private final DepartmentRepository departmentRepository;
    
    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public DepartmentDTO createDepartment(String name, String code) {
        if (departmentRepository.existsByCode(code)) {
            throw new CustomExceptions.DuplicateEmailException("Department code already exists: " + code);
        }
        if (departmentRepository.existsByName(name)) {
            throw new CustomExceptions.DuplicateEmailException("Department name already exists: " + name);
        }
        
        Department department = new Department();
        department.setName(name);
        department.setCode(code);
        department = departmentRepository.save(department);
        
        return convertToDTO(department);
    }
    
    public DepartmentDTO updateDepartment(Long id, String name, String code) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("Department not found"));
        
        // Check if code is being changed and if new code already exists
        if (!department.getCode().equals(code) && departmentRepository.existsByCode(code)) {
            throw new CustomExceptions.DuplicateEmailException("Department code already exists: " + code);
        }
        
        // Check if name is being changed and if new name already exists
        if (!department.getName().equals(name) && departmentRepository.existsByName(name)) {
            throw new CustomExceptions.DuplicateEmailException("Department name already exists: " + name);
        }
        
        department.setName(name);
        department.setCode(code);
        department = departmentRepository.save(department);
        
        return convertToDTO(department);
    }
    
    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("Department not found"));
        departmentRepository.delete(department);
    }
    
    private DepartmentDTO convertToDTO(Department department) {
        DepartmentDTO dto = new DepartmentDTO();
        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setCode(department.getCode());
        return dto;
    }
}
