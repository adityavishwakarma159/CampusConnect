package com.campus.controller;

import com.campus.dto.ApiResponse;
import com.campus.dto.NotificationDTO;
import com.campus.dto.PageResponse;
import com.campus.model.User;
import com.campus.service.NotificationService;
import com.campus.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    
    private final NotificationService notificationService;
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<PageResponse<NotificationDTO>> getUserNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Long userId = getCurrentUserId();
        PageResponse<NotificationDTO> notifications = notificationService.getUserNotifications(userId, page, size);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/recent")
    public ResponseEntity<List<NotificationDTO>> getRecentNotifications() {
        Long userId = getCurrentUserId();
        List<NotificationDTO> notifications = notificationService.getRecentNotifications(userId);
        return ResponseEntity.ok(notifications);
    }
    
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount() {
        Long userId = getCurrentUserId();
        Long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(count);
    }
    
    @PutMapping("/{id}/mark-read")
    public ResponseEntity<ApiResponse> markAsRead(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        notificationService.markAsRead(id, userId);
        return ResponseEntity.ok(new ApiResponse(true, "Notification marked as read"));
    }
    
    @PutMapping("/mark-all-read")
    public ResponseEntity<ApiResponse> markAllAsRead() {
        Long userId = getCurrentUserId();
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok(new ApiResponse(true, "All notifications marked as read"));
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
