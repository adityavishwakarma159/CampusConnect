package com.campus.dto;

import com.campus.model.StudyMaterial;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StudyMaterialDTO {
    
    private Long id;
    private String title;
    private String description;
    private Long departmentId;
    private String departmentName;
    private Long uploadedById;
    private String uploadedByName;
    private String subject;
    private String topic;
    private StudyMaterial.MaterialType type;
    private String fileName;
    private Long fileSize;
    private String fileType;
    private Integer downloadCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
