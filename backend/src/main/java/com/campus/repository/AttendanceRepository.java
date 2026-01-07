package com.campus.repository;

import com.campus.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    // Find attendance by date
    List<Attendance> findByDate(LocalDate date);
    
    // Find attendance by date and department
    @Query("SELECT a FROM Attendance a WHERE a.date = :date AND a.student.department.id = :departmentId")
    List<Attendance> findByDateAndDepartment(@Param("date") LocalDate date, @Param("departmentId") Long departmentId);
    
    // Find student attendance in date range
    @Query("SELECT a FROM Attendance a WHERE a.student.id = :studentId AND a.date BETWEEN :from AND :to ORDER BY a.date DESC")
    List<Attendance> findByStudentIdAndDateBetween(
        @Param("studentId") Long studentId,
        @Param("from") LocalDate from,
        @Param("to") LocalDate to
    );
    
    // Find all student attendance
    List<Attendance> findByStudentIdOrderByDateDesc(Long studentId);
    
    // Count by student and status
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.status = :status")
    Long countByStudentIdAndStatus(@Param("studentId") Long studentId, @Param("status") Attendance.AttendanceStatus status);
    
    // Check if attendance exists
    boolean existsByStudentIdAndDateAndSubject(Long studentId, LocalDate date, String subject);
    
    
    // Find by student, date, and subject
    Optional<Attendance> findByStudentIdAndDateAndSubject(Long studentId, LocalDate date, String subject);
    
    // Find attendance by department and date range for reports
    @Query("SELECT a FROM Attendance a WHERE a.student.department.id = :departmentId AND a.date BETWEEN :startDate AND :endDate ORDER BY a.student.rollNumber, a.subject, a.date")
    List<Attendance> findByDepartmentAndDateBetween(
        @Param("departmentId") Long departmentId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Find attendance marked by a specific faculty in date range
    @Query("SELECT a FROM Attendance a WHERE a.markedBy.id = :facultyId AND a.date BETWEEN :startDate AND :endDate ORDER BY a.date DESC, a.subject")
    List<Attendance> findByMarkedByIdAndDateBetween(
        @Param("facultyId") Long facultyId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
    
    // Find attendance marked by faculty for a specific subject
    @Query("SELECT a FROM Attendance a WHERE a.markedBy.id = :facultyId AND a.date BETWEEN :startDate AND :endDate AND a.subject = :subject ORDER BY a.date DESC")
    List<Attendance> findByMarkedByIdAndDateBetweenAndSubject(
        @Param("facultyId") Long facultyId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate,
        @Param("subject") String subject
    );
}
