package com.campus.repository;

import com.campus.model.StudyMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Long> {
    
    // Find by department
    List<StudyMaterial> findByDepartmentIdOrderByCreatedAtDesc(Long departmentId);
    
    // Find by subject
    List<StudyMaterial> findByDepartmentIdAndSubjectOrderByCreatedAtDesc(Long departmentId, String subject);
    
    // Search with filters
    @Query("SELECT m FROM StudyMaterial m WHERE " +
           "m.department.id = :departmentId AND " +
           "(:query IS NULL OR :query = '' OR LOWER(m.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(m.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
           "(:subject IS NULL OR :subject = '' OR m.subject = :subject) AND " +
           "(:type IS NULL OR :type = '' OR m.type = :type) " +
           "ORDER BY m.createdAt DESC")
    List<StudyMaterial> search(
        @Param("query") String query,
        @Param("departmentId") Long departmentId,
        @Param("subject") String subject,
        @Param("type") String type
    );
    
    // Get distinct subjects for a department
    @Query("SELECT DISTINCT m.subject FROM StudyMaterial m WHERE m.department.id = :departmentId AND m.subject IS NOT NULL ORDER BY m.subject")
    List<String> findDistinctSubjectsByDepartmentId(@Param("departmentId") Long departmentId);
}
