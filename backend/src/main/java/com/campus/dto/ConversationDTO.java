package com.campus.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ConversationDTO {
    
    private Long id;
    private Long otherUserId;
    private String otherUserName;
    private String otherUserRole;
    private String lastMessage;
    private Integer unreadCount;
    private LocalDateTime updatedAt;
}
