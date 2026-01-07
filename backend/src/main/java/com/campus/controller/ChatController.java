package com.campus.controller;

import com.campus.dto.ChatMessageDTO;
import com.campus.dto.ConversationDTO;
import com.campus.dto.SendGroupMessageRequest;
import com.campus.dto.SendMessageRequest;
import com.campus.model.User;
import com.campus.service.ChatPermissionService;
import com.campus.service.ChatService;
import com.campus.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    
    private final ChatService chatService;
    private final ChatPermissionService chatPermissionService;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;
    
    // --- REST Endpoints ---
    
    @GetMapping("/users")
    public ResponseEntity<List<User>> getChatUsers() {
        Long userId = getCurrentUserId();
        List<User> users = chatService.getChatUsers(userId);
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDTO>> getConversations() {
        Long userId = getCurrentUserId();
        List<ConversationDTO> conversations = chatService.getConversations(userId);
        return ResponseEntity.ok(conversations);
    }
    
    @GetMapping("/messages/{otherUserId}")
    public ResponseEntity<List<ChatMessageDTO>> getMessageHistory(@PathVariable Long otherUserId) {
        Long userId = getCurrentUserId();
        List<ChatMessageDTO> messages = chatService.getMessageHistory(userId, otherUserId);
        return ResponseEntity.ok(messages);
    }
    
    @PostMapping("/mark-read/{otherUserId}")
    public ResponseEntity<Void> markAsReadRest(@PathVariable Long otherUserId) {
        Long userId = getCurrentUserId();
        chatService.markMessagesAsRead(userId, otherUserId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/groups/{departmentId}")
    public ResponseEntity<List<ChatMessageDTO>> getGroupMessages(
            @PathVariable Long departmentId,
            @RequestParam(defaultValue = "DEPARTMENT_GROUP") String chatType) {
        // Here we could add permission check if needed (though getGroupMessages calls repo directly)
        // Ideally checking if user belongs to dept
        // For now, relying on service logic or adding basic check:
        Long userId = getCurrentUserId();
        if (!chatPermissionService.canPostInGroup(userId, com.campus.model.ChatMessage.ChatType.valueOf(chatType), departmentId)) {
             // Technically viewing might be allowed even if posting isn't, but usually it's same dept check
             // Let's assume service handles data isolation or we check dept membership
             User user = userService.getCurrentUser(userId);
             if (!user.getDepartment().getId().equals(departmentId)) {
                 return ResponseEntity.status(403).build();
             }
        }
        
        List<ChatMessageDTO> messages = chatService.getGroupMessages(
                departmentId, 
                com.campus.model.ChatMessage.ChatType.valueOf(chatType)
        );
        return ResponseEntity.ok(messages);
    }
    
    // --- WebSocket Endpoints ---
    
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload SendMessageRequest request) {
        Long senderId = getCurrentUserId();
        
        // Save message
        ChatMessageDTO savedMessage = chatService.saveMessage(request, senderId);
        
        // Send to receiver via WebSocket
        messagingTemplate.convertAndSendToUser(
                request.getReceiverId().toString(),
                "/queue/messages",
                savedMessage
        );
        
        // Also send back to sender for confirmation
        messagingTemplate.convertAndSendToUser(
                senderId.toString(),
                "/queue/messages",
                savedMessage
        );
    }
    
    @MessageMapping("/chat.markAsRead")
    public void markAsRead(@Payload Long otherUserId) {
        Long userId = getCurrentUserId();
        chatService.markMessagesAsRead(userId, otherUserId);
    }
    
    @MessageMapping("/chat.sendGroupMessage")
    public void sendGroupMessage(@Payload SendGroupMessageRequest request) {
        Long senderId = getCurrentUserId();
        
        // Validate permissions
        if (!chatPermissionService.canPostInGroup(senderId, request.getChatType(), request.getDepartmentId())) {
            throw new RuntimeException("You do not have permission to post in this group");
        }
        
        // Save message
        ChatMessageDTO savedMessage = chatService.saveGroupMessage(request, senderId);
        
        // Broadcast to department topic
        messagingTemplate.convertAndSend(
                "/topic/department/" + request.getDepartmentId(),
                savedMessage
        );
    }
    
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof org.springframework.security.core.userdetails.UserDetails) {
            org.springframework.security.core.userdetails.UserDetails userDetails = 
                (org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal();
            String email = userDetails.getUsername();
            User user = userService.getCurrentUser(email);
            return user.getId();
        }
        throw new RuntimeException("User not authenticated");
    }
}
