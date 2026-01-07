package com.campus.dto;

import com.campus.model.StudyMaterial;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UploadMaterialRequest {
    
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotBlank(message = "Subject is required")
    private String subject;
    
    private String topic;
    
    @NotNull(message = "Material type is required")
    private StudyMaterial.MaterialType type;
}
