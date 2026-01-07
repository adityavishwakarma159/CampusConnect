package com.campus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatPermissionsDTO {
    
    private boolean canPost;
    private boolean canRead;
    private boolean isFacultyMonitoring;
    private String chatType;
}
