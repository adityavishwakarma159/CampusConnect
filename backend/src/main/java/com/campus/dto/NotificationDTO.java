package com.campus.dto;

import com.campus.model.Notification;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {
    
    private Long id;
    private String title;
    private String message;
    private Notification.NotificationType type;
    private Long referenceId;
    private Boolean isRead;
    private LocalDateTime createdAt;
}
