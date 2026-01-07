package com.campus.service;

import com.campus.dto.NotificationDTO;
import com.campus.dto.PageResponse;
import com.campus.model.Announcement;
import com.campus.model.Notification;
import com.campus.model.User;
import com.campus.repository.NotificationRepository;
import com.campus.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public void createNotificationForAnnouncement(Announcement announcement) {
        // Get all users in the department
        List<User> users = userRepository.findByDepartmentId(announcement.getDepartment().getId());
        
        // Create notification for each user
        for (User user : users) {
            Notification notification = new Notification();
            notification.setUserId(user.getId());
            notification.setTitle("New Announcement: " + announcement.getTitle());
            notification.setMessage(announcement.getCreatedBy().getName() + " posted a new announcement in " + announcement.getDepartment().getName());
            notification.setType(Notification.NotificationType.ANNOUNCEMENT);
            notification.setReferenceId(announcement.getId());
            notification.setIsRead(false);
            
            notificationRepository.save(notification);
        }
        
        log.info("Created {} notifications for announcement {}", users.size(), announcement.getId());
    }
    
    public PageResponse<NotificationDTO> getUserNotifications(Long userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
        
        List<NotificationDTO> content = notifications.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new PageResponse<>(
                content,
                notifications.getNumber(),
                notifications.getSize(),
                notifications.getTotalElements(),
                notifications.getTotalPages(),
                notifications.isLast()
        );
    }
    
    public Long getUnreadCount(Long userId) {
        return notificationRepository.countByUserIdAndIsReadFalse(userId);
    }
    
    public List<NotificationDTO> getRecentNotifications(Long userId) {
        List<Notification> notifications = notificationRepository.findTop5ByUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        
        if (!notification.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        notification.setIsRead(true);
        notificationRepository.save(notification);
    }
    
    @Transactional
    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndIsReadFalse(userId);
        
        for (Notification notification : unreadNotifications) {
            notification.setIsRead(true);
        }
        
        notificationRepository.saveAll(unreadNotifications);
    }
    
    private NotificationDTO convertToDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(notification.getId());
        dto.setTitle(notification.getTitle());
        dto.setMessage(notification.getMessage());
        dto.setType(notification.getType());
        dto.setReferenceId(notification.getReferenceId());
        dto.setIsRead(notification.getIsRead());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }
}
