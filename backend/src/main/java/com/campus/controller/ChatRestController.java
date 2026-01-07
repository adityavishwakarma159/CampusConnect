package com.campus.controller;

import com.campus.dto.ChatMessageDTO;
import com.campus.dto.ChatPermissionsDTO;
import com.campus.dto.ConversationDTO;
import com.campus.dto.UserDTO;
import com.campus.model.ChatMessage;
import com.campus.model.User;
import com.campus.service.ChatPermissionService;
import com.campus.service.ChatService;
import com.campus.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatRestController {
    
    private final ChatService chatService;
    private final ChatPermissionService chatPermissionService;
    private final UserService userService;
    
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
    
    @GetMapping("/users")
    public ResponseEntity<List<UserDTO>> getChatUsers() {
        Long userId = getCurrentUserId();
        List<User> users = chatService.getChatUsers(userId);
        
        List<UserDTO> userDTOs = users.stream()
                .map(userService::convertToDTO)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(userDTOs);
    }
    
    @PostMapping("/mark-read/{otherUserId}")
    public ResponseEntity<Void> markAsRead(@PathVariable Long otherUserId) {
        Long userId = getCurrentUserId();
        chatService.markMessagesAsRead(userId, otherUserId);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/groups/{departmentId}")
    public ResponseEntity<List<ChatMessageDTO>> getGroupMessages(
            @PathVariable Long departmentId,
            @RequestParam(defaultValue = "DEPARTMENT_GROUP") String chatType
    ) {
        ChatMessage.ChatType type = ChatMessage.ChatType.valueOf(chatType);
        List<ChatMessageDTO> messages = chatService.getGroupMessages(departmentId, type);
        return ResponseEntity.ok(messages);
    }
    
    @GetMapping("/groups/{departmentId}/participants")
    public ResponseEntity<List<UserDTO>> getGroupParticipants(@PathVariable Long departmentId) {
        List<User> participants = chatService.getGroupParticipants(departmentId);
        List<UserDTO> userDTOs = participants.stream()
                .map(userService::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(userDTOs);
    }
    
    @GetMapping("/groups/{departmentId}/permissions")
    public ResponseEntity<ChatPermissionsDTO> getGroupPermissions(
            @PathVariable Long departmentId,
            @RequestParam(defaultValue = "DEPARTMENT_GROUP") String chatType
    ) {
        Long userId = getCurrentUserId();
        User user = userService.getCurrentUser(userId);
        ChatMessage.ChatType type = ChatMessage.ChatType.valueOf(chatType);
        
        ChatPermissionsDTO permissions = new ChatPermissionsDTO();
        permissions.setCanPost(chatPermissionService.canPostInGroup(userId, type, departmentId));
        permissions.setCanRead(chatPermissionService.canReadGroup(userId, departmentId));
        permissions.setFacultyMonitoring(chatPermissionService.isFacultyMonitoring(departmentId));
        permissions.setChatType(chatType);
        
        return ResponseEntity.ok(permissions);
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
