package com.campus.service;

import com.campus.dto.AttendanceDTO;
import com.campus.dto.AttendancePercentageDTO;
import com.campus.dto.AttendanceReportDTO;
import com.campus.dto.MarkAttendanceRequest;
import com.campus.exception.CustomExceptions;
import com.campus.model.Attendance;
import com.campus.model.Notification;
import com.campus.model.User;
import com.campus.repository.AttendanceRepository;
import com.campus.repository.NotificationRepository;
import com.campus.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AttendanceService {
    
    private final AttendanceRepository attendanceRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;
    
    @Transactional
    public List<AttendanceDTO> markBulkAttendance(MarkAttendanceRequest request, Long facultyId) {
        User faculty = userRepository.findById(facultyId)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("Faculty not found"));
        
        List<Attendance> attendanceRecords = new ArrayList<>();
        
        for (MarkAttendanceRequest.StudentAttendance studentAtt : request.getAttendanceList()) {
            User student = userRepository.findById(studentAtt.getStudentId())
                    .orElseThrow(() -> new CustomExceptions.UserNotFoundException("Student not found: " + studentAtt.getStudentId()));
            
            // Validate same department
            if (!student.getDepartment().getId().equals(faculty.getDepartment().getId())) {
                throw new RuntimeException("Cannot mark attendance for students from other departments");
            }
            
            // Check if attendance already exists
            if (attendanceRepository.existsByStudentIdAndDateAndSubject(
                    student.getId(), request.getDate(), request.getSubject())) {
                throw new RuntimeException("Attendance already marked for " + student.getName() + 
                        " on " + request.getDate() + " for " + request.getSubject());
            }
            
            Attendance attendance = new Attendance();
            attendance.setStudent(student);
            attendance.setMarkedBy(faculty);
            attendance.setDate(request.getDate());
            attendance.setStatus(studentAtt.getStatus());
            attendance.setSubject(request.getSubject());
            attendance.setRemarks(studentAtt.getRemarks());
            
            attendanceRecords.add(attendance);
        }
        
        List<Attendance> savedRecords = attendanceRepository.saveAll(attendanceRecords);
        
        // Send notifications
        notifyStudents(savedRecords);
        
        return savedRecords.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<AttendanceDTO> getAttendanceByDate(LocalDate date, Long departmentId) {
        List<Attendance> records = attendanceRepository.findByDateAndDepartment(date, departmentId);
        return records.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public List<AttendanceDTO> getStudentAttendance(Long studentId, LocalDate from, LocalDate to) {
        List<Attendance> records;
        
        if (from != null && to != null) {
            records = attendanceRepository.findByStudentIdAndDateBetween(studentId, from, to);
        } else {
            records = attendanceRepository.findByStudentIdOrderByDateDesc(studentId);
        }
        
        return records.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    public AttendancePercentageDTO calculatePercentage(Long studentId, LocalDate from, LocalDate to) {
        List<Attendance> records = attendanceRepository.findByStudentIdAndDateBetween(studentId, from, to);
        
        long totalDays = records.size();
        long presentDays = records.stream()
                .filter(a -> a.getStatus() == Attendance.AttendanceStatus.PRESENT)
                .count();
        long absentDays = records.stream()
                .filter(a -> a.getStatus() == Attendance.AttendanceStatus.ABSENT)
                .count();
        long lateDays = records.stream()
                .filter(a -> a.getStatus() == Attendance.AttendanceStatus.LATE)
                .count();
        
        double percentage = totalDays > 0 ? (presentDays * 100.0 / totalDays) : 0.0;
        
        return new AttendancePercentageDTO(totalDays, presentDays, absentDays, lateDays, percentage);
    }
    
    @Transactional
    public AttendanceDTO updateAttendance(Long id, Attendance.AttendanceStatus status, String remarks) {
        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance record not found"));
        
        attendance.setStatus(status);
        if (remarks != null) {
            attendance.setRemarks(remarks);
        }
        
        Attendance updated = attendanceRepository.save(attendance);
        return convertToDTO(updated);
    }
    
    @Transactional
    public void deleteAttendance(Long id) {
        if (!attendanceRepository.existsById(id)) {
            throw new RuntimeException("Attendance record not found");
        }
        attendanceRepository.deleteById(id);
    }
    
    private void notifyStudents(List<Attendance> records) {
        for (Attendance record : records) {
            Notification notification = new Notification();
            notification.setUserId(record.getStudent().getId());
            notification.setTitle("Attendance Marked");
            notification.setMessage("Your attendance for " + record.getDate() + 
                    " (" + record.getSubject() + ") has been marked as " + record.getStatus());
            notification.setType(Notification.NotificationType.ATTENDANCE);
            notification.setReferenceId(record.getId());
            notification.setIsRead(false);
            
            notificationRepository.save(notification);
        }
        
        log.info("Sent attendance notifications to {} students", records.size());
    }
    
    
    public List<AttendanceReportDTO> getFacultyAttendanceHistory(
            Long facultyId, 
            Long departmentId, 
            LocalDate startDate, 
            LocalDate endDate,
            String subject
    ) {
        List<Attendance> records;
        
        if (subject != null && !subject.trim().isEmpty()) {
            records = attendanceRepository.findByMarkedByIdAndDateBetweenAndSubject(
                    facultyId, startDate, endDate, subject);
        } else {
            records = attendanceRepository.findByMarkedByIdAndDateBetween(
                    facultyId, startDate, endDate);
        }
        
        // Group by date and subject to create summary records
        return records.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getDate() + "_" + a.getSubject(),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> {
                                    Attendance first = list.get(0);
                                    long total = list.size();
                                    long present = list.stream()
                                            .filter(a -> a.getStatus() == Attendance.AttendanceStatus.PRESENT)
                                            .count();
                                    long absent = list.stream()
                                            .filter(a -> a.getStatus() == Attendance.AttendanceStatus.ABSENT)
                                            .count();
                                    double percentage = total > 0 ? (present * 100.0 / total) : 0.0;
                                    
                                    // For faculty history, we use date as identifier instead of student info
                                    return new AttendanceReportDTO(
                                            first.getDate().toString(), // Using date as rollNumber field
                                            "", // Empty studentName since this is grouped by date, not student
                                            first.getSubject(),
                                            total,
                                            present,
                                            absent,
                                            percentage
                                    );
                                }
                        )
                ))
                .values()
                .stream()
                .collect(Collectors.toList());
    }
    
    public List<AttendanceReportDTO> getAttendanceReport(Long departmentId, LocalDate startDate, LocalDate endDate) {
        List<Attendance> records = attendanceRepository.findByDepartmentAndDateBetween(departmentId, startDate, endDate);
        
        // Group by student and subject
        return records.stream()
                .collect(Collectors.groupingBy(
                        a -> a.getStudent().getId() + "_" + a.getSubject(),
                        Collectors.collectingAndThen(
                                Collectors.toList(),
                                list -> {
                                    Attendance first = list.get(0);
                                    long total = list.size();
                                    long present = list.stream()
                                            .filter(a -> a.getStatus() == Attendance.AttendanceStatus.PRESENT)
                                            .count();
                                    long absent = list.stream()
                                            .filter(a -> a.getStatus() == Attendance.AttendanceStatus.ABSENT)
                                            .count();
                                    double percentage = total > 0 ? (present * 100.0 / total) : 0.0;
                                    
                                    return new AttendanceReportDTO(
                                            first.getStudent().getRollNumber(),
                                            first.getStudent().getName(),
                                            first.getSubject(),
                                            total,
                                            present,
                                            absent,
                                            percentage
                                    );
                                }
                        )
                ))
                .values()
                .stream()
                .collect(Collectors.toList());
    }
    
    private AttendanceDTO convertToDTO(Attendance attendance) {
        AttendanceDTO dto = new AttendanceDTO();
        dto.setId(attendance.getId());
        dto.setStudentId(attendance.getStudent().getId());
        dto.setStudentName(attendance.getStudent().getName());
        dto.setStudentRollNumber(attendance.getStudent().getRollNumber());
        dto.setMarkedById(attendance.getMarkedBy().getId());
        dto.setMarkedByName(attendance.getMarkedBy().getName());
        dto.setDate(attendance.getDate());
        dto.setStatus(attendance.getStatus());
        dto.setSubject(attendance.getSubject());
        dto.setRemarks(attendance.getRemarks());
        dto.setCreatedAt(attendance.getCreatedAt());
        return dto;
    }
}
