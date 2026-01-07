package com.campus.service;

import com.campus.dto.AnnouncementDTO;
import com.campus.dto.CreateAnnouncementRequest;
import com.campus.dto.PageResponse;
import com.campus.exception.CustomExceptions;
import com.campus.model.Announcement;
import com.campus.model.Department;
import com.campus.model.User;
import com.campus.repository.AnnouncementRepository;
import com.campus.repository.DepartmentRepository;
import com.campus.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnnouncementService {
    
    private final AnnouncementRepository announcementRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;
    private final FileStorageService fileStorageService;
    
    @Transactional
    public AnnouncementDTO createAnnouncement(CreateAnnouncementRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("User not found"));
        
        Announcement announcement = new Announcement();
        announcement.setTitle(request.getTitle());
        announcement.setContent(request.getContent());
        announcement.setCreatedBy(user);
        
        // Department is optional - if not provided, announcement is for all departments
        if (request.getDepartmentId() != null && request.getDepartmentId() > 0) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new CustomExceptions.UserNotFoundException("Department not found"));
            announcement.setDepartment(department);
        } else {
            // Use user's department as default if available
            if (user.getDepartment() != null) {
                announcement.setDepartment(user.getDepartment());
            }
        }
        
        announcement = announcementRepository.save(announcement);
        
        // Create notifications for all users in the department
        notificationService.createNotificationForAnnouncement(announcement);
        
        return convertToDTO(announcement);
    }
    
    public PageResponse<AnnouncementDTO> getAllAnnouncements(Long departmentId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Announcement> announcementPage;
        
        if (departmentId != null) {
            announcementPage = announcementRepository.findByDepartmentIdOrderByCreatedAtDesc(departmentId, pageable);
        } else {
            announcementPage = announcementRepository.findAllByOrderByCreatedAtDesc(pageable);
        }
        
        List<AnnouncementDTO> dtos = announcementPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        PageResponse<AnnouncementDTO> response = new PageResponse<>();
        response.setContent(dtos);
        response.setPageNumber(announcementPage.getNumber());
        response.setPageSize(announcementPage.getSize());
        response.setTotalElements(announcementPage.getTotalElements());
        response.setTotalPages(announcementPage.getTotalPages());
        response.setLast(announcementPage.isLast());
        
        return response;
    }
    
    public AnnouncementDTO getAnnouncementById(Long id) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("Announcement not found"));
        return convertToDTO(announcement);
    }
    
    @Transactional
    public AnnouncementDTO updateAnnouncement(Long id, CreateAnnouncementRequest request, Long userId) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("Announcement not found"));
        
        // Check if user is the creator or admin
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("User not found"));
        
        if (!announcement.getCreatedBy().getId().equals(userId) && user.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Unauthorized to update this announcement");
        }
        
        announcement.setTitle(request.getTitle());
        announcement.setContent(request.getContent());
        
        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new CustomExceptions.UserNotFoundException("Department not found"));
            announcement.setDepartment(department);
        }
        
        announcement = announcementRepository.save(announcement);
        return convertToDTO(announcement);
    }
    
    @Transactional
    public void deleteAnnouncement(Long id, Long userId) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("Announcement not found"));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("User not found"));
        
        // Check if user is the creator or admin
        if (!announcement.getCreatedBy().getId().equals(userId) && user.getRole() != User.Role.ADMIN) {
            throw new RuntimeException("Unauthorized to delete this announcement");
        }
        
        // Delete attachment if exists
        if (announcement.getAttachmentUrl() != null) {
            fileStorageService.deleteFile(announcement.getAttachmentUrl());
        }
        
        announcementRepository.delete(announcement);
    }
    
    @Transactional
    public String uploadAttachment(Long id, MultipartFile file) {
        Announcement announcement = announcementRepository.findById(id)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("Announcement not found"));
        
        // Delete old attachment if exists
        if (announcement.getAttachmentUrl() != null) {
            fileStorageService.deleteFile(announcement.getAttachmentUrl());
        }
        
        // Store new file
        String filePath = fileStorageService.storeFile(file, "announcements");
        announcement.setAttachmentUrl(filePath);
        announcementRepository.save(announcement);
        
        return filePath;
    }
    
    private AnnouncementDTO convertToDTO(Announcement announcement) {
        AnnouncementDTO dto = new AnnouncementDTO();
        dto.setId(announcement.getId());
        dto.setTitle(announcement.getTitle());
        dto.setContent(announcement.getContent());
        
        if (announcement.getDepartment() != null) {
            dto.setDepartmentId(announcement.getDepartment().getId());
            dto.setDepartmentName(announcement.getDepartment().getName());
        }
        
        dto.setCreatedById(announcement.getCreatedBy().getId());
        dto.setCreatedByName(announcement.getCreatedBy().getName());
        dto.setAttachmentUrl(announcement.getAttachmentUrl());
        dto.setCreatedAt(announcement.getCreatedAt());
        dto.setUpdatedAt(announcement.getUpdatedAt());
        return dto;
    }
}
