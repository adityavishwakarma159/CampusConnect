package com.campus.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "study_materials")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudyMaterial {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 500)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id", nullable = false)
    private Department department;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;
    
    @Column(length = 255)
    private String subject;
    
    @Column(length = 255)
    private String topic;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private MaterialType type;
    
    @Column(name = "file_url", nullable = false, length = 500)
    private String fileUrl;
    
    @Column(name = "file_name", nullable = false, length = 500)
    private String fileName;
    
    @Column(name = "file_size")
    private Long fileSize;
    
    @Column(name = "file_type", length = 100)
    private String fileType;
    
    @Column(name = "download_count")
    private Integer downloadCount = 0;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum MaterialType {
        LECTURE_NOTES,
        LAB_MANUAL,
        PREVIOUS_PAPERS,
        REFERENCE_BOOK,
        OTHER
    }
}
