package com.campus.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatMessage {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver_id")
    private User receiver;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "chat_type", nullable = false)
    private ChatType chatType;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @Column(name = "attachment_url", length = 500)
    private String attachmentUrl;
    
    @Column(name = "is_read", nullable = false)
    private Boolean isRead = false;
    
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (isRead == null) {
            isRead = false;
        }
    }
    
    public enum ChatType {
        ONE_TO_ONE,
        DEPARTMENT_GROUP,
        FACULTY_STUDENT_GROUP
    }
}
