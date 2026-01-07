package com.campus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnnouncementDTO {
    
    private Long id;
    private String title;
    private String content;
    private Long departmentId;
    private String departmentName;
    private Long createdById;
    private String createdByName;
    private String attachmentUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
