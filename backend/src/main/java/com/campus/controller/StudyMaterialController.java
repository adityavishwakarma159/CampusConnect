package com.campus.controller;

import com.campus.dto.StudyMaterialDTO;
import com.campus.dto.UploadMaterialRequest;
import com.campus.model.User;
import com.campus.service.StudyMaterialService;
import com.campus.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/study-materials")
@RequiredArgsConstructor
public class StudyMaterialController {
    
    private final StudyMaterialService studyMaterialService;
    private final UserService userService;
    
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<StudyMaterialDTO> uploadMaterial(
            @Valid @ModelAttribute UploadMaterialRequest request,
            @RequestParam("file") MultipartFile file
    ) {
        Long facultyId = getCurrentUserId();
        StudyMaterialDTO material = studyMaterialService.uploadMaterial(request, file, facultyId);
        return ResponseEntity.ok(material);
    }
    
    @GetMapping
    public ResponseEntity<List<StudyMaterialDTO>> getMaterials() {
        Long userId = getCurrentUserId();
        User user = userService.getCurrentUser(userId);
        List<StudyMaterialDTO> materials = studyMaterialService.getMaterials(user.getDepartment().getId());
        return ResponseEntity.ok(materials);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<StudyMaterialDTO> getMaterialById(@PathVariable Long id) {
        StudyMaterialDTO material = studyMaterialService.getMaterialById(id);
        return ResponseEntity.ok(material);
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<StudyMaterialDTO> updateMaterial(
            @PathVariable Long id,
            @Valid @RequestBody UploadMaterialRequest request
    ) {
        StudyMaterialDTO updated = studyMaterialService.updateMaterial(id, request);
        return ResponseEntity.ok(updated);
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<Void> deleteMaterial(@PathVariable Long id) {
        studyMaterialService.deleteMaterial(id);
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadMaterial(@PathVariable Long id) {
        Resource resource = studyMaterialService.downloadMaterial(id);
        
        StudyMaterialDTO material = studyMaterialService.getMaterialById(id);
        
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                        "attachment; filename=\"" + material.getFileName() + "\"")
                .body(resource);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<StudyMaterialDTO>> searchMaterials(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) String type
    ) {
        Long userId = getCurrentUserId();
        User user = userService.getCurrentUser(userId);
        
        List<StudyMaterialDTO> materials = studyMaterialService.searchMaterials(
            query, 
            user.getDepartment().getId(), 
            subject, 
            type
        );
        return ResponseEntity.ok(materials);
    }
    
    
    @GetMapping("/subjects")
    public ResponseEntity<List<String>> getSubjects() {
        Long userId = getCurrentUserId();
        User user = userService.getCurrentUser(userId);
        List<String> subjects = studyMaterialService.getSubjects(user.getDepartment().getId());
        return ResponseEntity.ok(subjects);
    }
    
    @GetMapping("/my-materials")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<List<StudyMaterialDTO>> getMyMaterials() {
        Long userId = getCurrentUserId();
        User user = userService.getCurrentUser(userId);
        
        // Get all materials from department and filter by uploaded user
        List<StudyMaterialDTO> allMaterials = studyMaterialService.getMaterials(user.getDepartment().getId());
        List<StudyMaterialDTO> myMaterials = allMaterials.stream()
                .filter(m -> m.getUploadedById().equals(userId))
                .collect(java.util.stream.Collectors.toList());
        
        return ResponseEntity.ok(myMaterials);
    }
    
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("User not authenticated");
        }
        
        String email;
        Object principal = authentication.getPrincipal();
        
        if (principal instanceof String) {
            email = (String) principal;
        } else if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            email = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
        } else {
            throw new RuntimeException("Unknown principal type");
        }
        
        User user = userService.getCurrentUser(email);
        return user.getId();
    }
}
