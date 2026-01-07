package com.campus.controller;

import com.campus.dto.AnnouncementDTO;
import com.campus.dto.CreateAnnouncementRequest;
import com.campus.dto.PageResponse;
import com.campus.model.User;
import com.campus.service.AnnouncementService;
import com.campus.service.FileStorageService;
import com.campus.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
public class AnnouncementController {
    
    private final AnnouncementService announcementService;
    private final FileStorageService fileStorageService;
    private final UserService userService;
    
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<AnnouncementDTO> createAnnouncement(@Valid @RequestBody CreateAnnouncementRequest request) {
        Long userId = getCurrentUserId();
        AnnouncementDTO announcement = announcementService.createAnnouncement(request, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(announcement);
    }
    
    @GetMapping
    public ResponseEntity<PageResponse<AnnouncementDTO>> getAllAnnouncements(
            @RequestParam(required = false) Long departmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        PageResponse<AnnouncementDTO> announcements = announcementService.getAllAnnouncements(departmentId, page, size);
        return ResponseEntity.ok(announcements);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementDTO> getAnnouncementById(@PathVariable Long id) {
        AnnouncementDTO announcement = announcementService.getAnnouncementById(id);
        return ResponseEntity.ok(announcement);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<AnnouncementDTO> updateAnnouncement(
            @PathVariable Long id,
            @Valid @RequestBody CreateAnnouncementRequest request
    ) {
        Long userId = getCurrentUserId();
        AnnouncementDTO announcement = announcementService.updateAnnouncement(id, request, userId);
        return ResponseEntity.ok(announcement);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<Void> deleteAnnouncement(@PathVariable Long id) {
        Long userId = getCurrentUserId();
        announcementService.deleteAnnouncement(id, userId);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{id}/attachment")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<String> uploadAttachment(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file
    ) {
        String filePath = announcementService.uploadAttachment(id, file);
        return ResponseEntity.ok(filePath);
    }
    
    @GetMapping("/{id}/attachment")
    public ResponseEntity<Resource> downloadAttachment(@PathVariable Long id) {
        AnnouncementDTO announcement = announcementService.getAnnouncementById(id);
        
        if (announcement.getAttachmentUrl() == null) {
            return ResponseEntity.notFound().build();
        }
        
        String[] parts = announcement.getAttachmentUrl().split("/");
        String fileName = parts[parts.length - 1];
        String subFolder = parts[0];
        
        Resource resource = fileStorageService.loadFileAsResource(fileName, subFolder);
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
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
