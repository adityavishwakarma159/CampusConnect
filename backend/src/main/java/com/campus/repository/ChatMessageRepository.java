package com.campus.repository;

import com.campus.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    
    // Get message history between two users
    @Query("SELECT cm FROM ChatMessage cm WHERE " +
           "(cm.sender.id = :userId AND cm.receiver.id = :otherUserId) OR " +
           "(cm.sender.id = :otherUserId AND cm.receiver.id = :userId) " +
           "ORDER BY cm.createdAt ASC")
    List<ChatMessage> findMessageHistory(@Param("userId") Long userId, 
                                          @Param("otherUserId") Long otherUserId);
    
    // Mark messages as read
    @Modifying
    @Query("UPDATE ChatMessage cm SET cm.isRead = true WHERE " +
           "cm.receiver.id = :userId AND cm.sender.id = :otherUserId AND cm.isRead = false")
    void markAsRead(@Param("userId") Long userId, @Param("otherUserId") Long otherUserId);
    
    // Count unread messages from a specific user
    @Query("SELECT COUNT(cm) FROM ChatMessage cm WHERE " +
           "cm.receiver.id = :userId AND cm.sender.id = :otherUserId AND cm.isRead = false")
    Long countUnreadMessages(@Param("userId") Long userId, @Param("otherUserId") Long otherUserId);
    
    // Get group messages for a department
    List<ChatMessage> findByDepartmentIdAndChatTypeOrderByCreatedAtAsc(
        Long departmentId,
        ChatMessage.ChatType chatType
    );
}
