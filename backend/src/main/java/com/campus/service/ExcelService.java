package com.campus.service;

import com.campus.dto.BulkUploadResponse;
import com.campus.dto.CreateUserRequest;
import com.campus.dto.ExcelError;
import com.campus.model.User;
import com.campus.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class ExcelService {
    
    private final DepartmentRepository departmentRepository;
    private final UserService userService;
    
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");
    
    public BulkUploadResponse processStudentExcel(MultipartFile file) {
        BulkUploadResponse response = new BulkUploadResponse();
        List<CreateUserRequest> validUsers = new ArrayList<>();
        
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            int rowNum = 0;
            
            for (Row row : sheet) {
                rowNum++;
                
                // Skip header row
                if (rowNum == 1) continue;
                
                // Skip empty rows
                if (isRowEmpty(row)) continue;
                
                response.setTotalRows(response.getTotalRows() + 1);
                
                try {
                    CreateUserRequest user = parseStudentRow(row, rowNum);
                    if (user != null) {
                        validUsers.add(user);
                    }
                } catch (Exception e) {
                    response.getErrors().add(new ExcelError(rowNum, "Row", e.getMessage()));
                    response.setErrorCount(response.getErrorCount() + 1);
                }
            }
            
            // Create valid users
            for (CreateUserRequest userRequest : validUsers) {
                try {
                    response.getCreatedUsers().add(userService.createUser(userRequest));
                    response.setSuccessCount(response.getSuccessCount() + 1);
                } catch (Exception e) {
                    response.getErrors().add(new ExcelError(0, userRequest.getEmail(), e.getMessage()));
                    response.setErrorCount(response.getErrorCount() + 1);
                }
            }
            
        } catch (IOException e) {
            log.error("Error processing Excel file", e);
            response.getErrors().add(new ExcelError(0, "File", "Error reading Excel file: " + e.getMessage()));
        }
        
        return response;
    }
    
    public BulkUploadResponse processFacultyExcel(MultipartFile file) {
        BulkUploadResponse response = new BulkUploadResponse();
        List<CreateUserRequest> validUsers = new ArrayList<>();
        
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            int rowNum = 0;
            
            for (Row row : sheet) {
                rowNum++;
                
                // Skip header row
                if (rowNum == 1) continue;
                
                // Skip empty rows
                if (isRowEmpty(row)) continue;
                
                response.setTotalRows(response.getTotalRows() + 1);
                
                try {
                    CreateUserRequest user = parseFacultyRow(row, rowNum);
                    if (user != null) {
                        validUsers.add(user);
                    }
                } catch (Exception e) {
                    response.getErrors().add(new ExcelError(rowNum, "Row", e.getMessage()));
                    response.setErrorCount(response.getErrorCount() + 1);
                }
            }
            
            // Create valid users
            for (CreateUserRequest userRequest : validUsers) {
                try {
                    response.getCreatedUsers().add(userService.createUser(userRequest));
                    response.setSuccessCount(response.getSuccessCount() + 1);
                } catch (Exception e) {
                    response.getErrors().add(new ExcelError(0, userRequest.getEmail(), e.getMessage()));
                    response.setErrorCount(response.getErrorCount() + 1);
                }
            }
            
        } catch (IOException e) {
            log.error("Error processing Excel file", e);
            response.getErrors().add(new ExcelError(0, "File", "Error reading Excel file: " + e.getMessage()));
        }
        
        return response;
    }
    
    private CreateUserRequest parseStudentRow(Row row, int rowNum) {
        // Expected columns: Name, Email, Roll Number, Department Code, Joining Year
        String name = getCellValue(row.getCell(0));
        String email = getCellValue(row.getCell(1));
        String rollNumber = getCellValue(row.getCell(2));
        String departmentCode = getCellValue(row.getCell(3));
        String joiningYearStr = getCellValue(row.getCell(4));
        
        // Validate required fields
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (email == null || !EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (rollNumber == null || rollNumber.trim().isEmpty()) {
            throw new IllegalArgumentException("Roll number is required");
        }
        if (departmentCode == null || departmentCode.trim().isEmpty()) {
            throw new IllegalArgumentException("Department code is required");
        }
        
        // Find department
        Long departmentId = departmentRepository.findByCode(departmentCode)
                .map(d -> d.getId())
                .orElseThrow(() -> new IllegalArgumentException("Department not found: " + departmentCode));
        
        Integer joiningYear = null;
        if (joiningYearStr != null && !joiningYearStr.trim().isEmpty()) {
            try {
                joiningYear = Integer.parseInt(joiningYearStr);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid joining year format");
            }
        }
        
        CreateUserRequest user = new CreateUserRequest();
        user.setName(name.trim());
        user.setEmail(email.trim().toLowerCase());
        user.setRole(User.Role.STUDENT);
        user.setDepartmentId(departmentId);
        user.setRollNumber(rollNumber.trim());
        user.setJoiningYear(joiningYear);
        
        return user;
    }
    
    private CreateUserRequest parseFacultyRow(Row row, int rowNum) {
        // Expected columns: Name, Email, Department Code, Designation
        String name = getCellValue(row.getCell(0));
        String email = getCellValue(row.getCell(1));
        String departmentCode = getCellValue(row.getCell(2));
        String designation = getCellValue(row.getCell(3));
        
        // Validate required fields
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (email == null || !EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }
        if (departmentCode == null || departmentCode.trim().isEmpty()) {
            throw new IllegalArgumentException("Department code is required");
        }
        
        // Find department
        Long departmentId = departmentRepository.findByCode(departmentCode)
                .map(d -> d.getId())
                .orElseThrow(() -> new IllegalArgumentException("Department not found: " + departmentCode));
        
        CreateUserRequest user = new CreateUserRequest();
        user.setName(name.trim());
        user.setEmail(email.trim().toLowerCase());
        user.setRole(User.Role.FACULTY);
        user.setDepartmentId(departmentId);
        user.setDesignation(designation != null ? designation.trim() : null);
        
        return user;
    }
    
    private String getCellValue(Cell cell) {
        if (cell == null) return null;
        
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue();
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            default -> null;
        };
    }
    
    private boolean isRowEmpty(Row row) {
        if (row == null) return true;
        
        for (int i = 0; i < row.getLastCellNum(); i++) {
            Cell cell = row.getCell(i);
            if (cell != null && cell.getCellType() != CellType.BLANK) {
                return false;
            }
        }
        return true;
    }
}
