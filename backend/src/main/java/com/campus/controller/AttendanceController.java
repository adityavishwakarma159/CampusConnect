package com.campus.controller;

import com.campus.dto.AttendanceDTO;
import com.campus.dto.AttendancePercentageDTO;
import com.campus.dto.AttendanceReportDTO;
import com.campus.dto.MarkAttendanceRequest;
import com.campus.model.Attendance;
import com.campus.model.User;
import com.campus.service.AttendanceService;
import com.campus.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    
    private final AttendanceService attendanceService;
    private final UserService userService;
    
    @PostMapping("/mark")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<List<AttendanceDTO>> markAttendance(@Valid @RequestBody MarkAttendanceRequest request) {
        Long facultyId = getCurrentUserId();
        List<AttendanceDTO> attendance = attendanceService.markBulkAttendance(request, facultyId);
        return ResponseEntity.ok(attendance);
    }
    
    @GetMapping("/date/{date}")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<List<AttendanceDTO>> getAttendanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        Long userId = getCurrentUserId();
        User user = userService.getCurrentUser(userId);
        List<AttendanceDTO> attendance = attendanceService.getAttendanceByDate(date, user.getDepartment().getId());
        return ResponseEntity.ok(attendance);
    }
    
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AttendanceDTO>> getStudentAttendance(
            @PathVariable Long studentId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        List<AttendanceDTO> attendance = attendanceService.getStudentAttendance(studentId, from, to);
        return ResponseEntity.ok(attendance);
    }
    
    @GetMapping("/student/{studentId}/percentage")
    public ResponseEntity<AttendancePercentageDTO> getAttendancePercentage(
            @PathVariable Long studentId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        // Default to current academic year if not specified
        if (from == null) {
            from = LocalDate.now().minusMonths(6);
        }
        if (to == null) {
            to = LocalDate.now();
        }
        
        AttendancePercentageDTO percentage = attendanceService.calculatePercentage(studentId, from, to);
        return ResponseEntity.ok(percentage);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<AttendanceDTO> updateAttendance(
            @PathVariable Long id,
            @RequestParam Attendance.AttendanceStatus status,
            @RequestParam(required = false) String remarks
    ) {
        AttendanceDTO updated = attendanceService.updateAttendance(id, status, remarks);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.ok().build();
    }
    
    
    @GetMapping("/faculty/history")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<List<AttendanceReportDTO>> getFacultyHistory(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String subject
    ) {
        Long facultyId = getCurrentUserId();
        User faculty = userService.getCurrentUser(facultyId);
        
        if (faculty.getDepartment() == null) {
            throw new RuntimeException("Faculty must be assigned to a department");
        }
        
        List<AttendanceReportDTO> history = attendanceService.getFacultyAttendanceHistory(
                facultyId, 
                faculty.getDepartment().getId(), 
                startDate, 
                endDate, 
                subject
        );
        return ResponseEntity.ok(history);
    }
    
    @GetMapping("/report")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AttendanceReportDTO>> getAttendanceReport(
            @RequestParam Long departmentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        List<AttendanceReportDTO> report = attendanceService.getAttendanceReport(departmentId, startDate, endDate);
        return ResponseEntity.ok(report);
    }
    
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("User not authenticated");
        }
        
        String email;
        Object principal = authentication.getPrincipal();
        
        if (principal instanceof String) {
            email = (String) principal;
        } else if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            email = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
        } else {
            throw new RuntimeException("Unknown principal type");
        }
        
        User user = userService.getCurrentUser(email);
        return user.getId();
    }
}
