package com.campus.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_participants")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatParticipant {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "other_user_id")
    private Long otherUserId;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "chat_type", nullable = false)
    private ChatMessage.ChatType chatType;
    
    @Column(name = "department_id")
    private Long departmentId;
    
    @Column(name = "last_message_id")
    private Long lastMessageId;
    
    @Column(name = "unread_count", nullable = false)
    private Integer unreadCount = 0;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @PrePersist
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
        if (unreadCount == null) {
            unreadCount = 0;
        }
    }
    
    public ChatParticipant(Long userId, Long otherUserId, ChatMessage.ChatType chatType) {
        this.userId = userId;
        this.otherUserId = otherUserId;
        this.chatType = chatType;
        this.unreadCount = 0;
    }
}
