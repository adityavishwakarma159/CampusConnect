package com.campus.repository;

import com.campus.model.ChatMessage;
import com.campus.model.ChatParticipant;
import com.campus.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatParticipantRepository extends JpaRepository<ChatParticipant, Long> {
    
    // Get all conversations for a user
    List<ChatParticipant> findByUserIdOrderByUpdatedAtDesc(Long userId);
    
    // Find specific conversation
    Optional<ChatParticipant> findByUserIdAndOtherUserIdAndChatType(
        Long userId, 
        Long otherUserId, 
        ChatMessage.ChatType chatType
    );
    
    // Check if conversation exists
    boolean existsByUserIdAndOtherUserIdAndChatType(
        Long userId, 
        Long otherUserId, 
        ChatMessage.ChatType chatType
    );
    
    // Check if faculty is monitoring department group
    @Query("SELECT CASE WHEN COUNT(cp) > 0 THEN true ELSE false END FROM ChatParticipant cp " +
           "JOIN User u ON cp.userId = u.id " +
           "WHERE cp.departmentId = :departmentId " +
           "AND cp.chatType = :chatType " +
           "AND (u.role = 'FACULTY' OR u.role = 'ADMIN')")
    boolean existsByDepartmentIdAndChatTypeAndUserRole(
        @Param("departmentId") Long departmentId,
        @Param("chatType") ChatMessage.ChatType chatType
    );
}
