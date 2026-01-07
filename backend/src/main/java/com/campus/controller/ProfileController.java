package com.campus.controller;

import com.campus.model.User;
import com.campus.repository.UserRepository;
import com.campus.service.FileStorageService;
import com.campus.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    
    private final UserService userService;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    
    @GetMapping
    public ResponseEntity<Map<String, Object>> getProfile() {
        User user = getCurrentUser();
        
        Map<String, Object> profile = new HashMap<>();
        profile.put("id", user.getId());
        profile.put("name", user.getName());
        profile.put("email", user.getEmail());
        profile.put("role", user.getRole());
        profile.put("rollNumber", user.getRollNumber());
        
        // Handle null department for admin users
        if (user.getDepartment() != null) {
            profile.put("departmentId", user.getDepartment().getId());
            profile.put("departmentName", user.getDepartment().getName());
        } else {
            profile.put("departmentId", null);
            profile.put("departmentName", null);
        }
        
        profile.put("profilePicture", user.getProfilePicture());
        profile.put("isFirstLogin", user.getIsFirstLogin());
        
        return ResponseEntity.ok(profile);
    }
    
    @PutMapping
    @Transactional
    public ResponseEntity<Map<String, Object>> updateProfile(@RequestBody Map<String, String> updates) {
        User user = getCurrentUser();
        
        // Only allow updating name
        if (updates.containsKey("name")) {
            user.setName(updates.get("name"));
            userRepository.save(user);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Profile updated successfully");
        response.put("name", user.getName());
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/picture")
    public ResponseEntity<Map<String, Object>> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        User user = getCurrentUser();
        
        // Delete old picture if exists
        if (user.getProfilePicture() != null) {
            try {
                fileStorageService.deleteFile(user.getProfilePicture());
            } catch (Exception e) {
                // Ignore if file doesn't exist
            }
        }
        
        // Store new picture
        String fileName = fileStorageService.storeFile(file, "profile-pictures");
        user.setProfilePicture(fileName);
        userRepository.save(user);
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Profile picture uploaded successfully");
        response.put("profilePicture", fileName);
        
        return ResponseEntity.ok(response);
    }
    
    @DeleteMapping("/picture")
    public ResponseEntity<Map<String, Object>> deleteProfilePicture() {
        User user = getCurrentUser();
        
        if (user.getProfilePicture() != null) {
            try {
                fileStorageService.deleteFile(user.getProfilePicture());
            } catch (Exception e) {
                // Ignore if file doesn't exist
            }
            
            user.setProfilePicture(null);
            userRepository.save(user);
        }
        
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Profile picture deleted successfully");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/picture/{fileName:.+}")
    public ResponseEntity<Resource> getProfilePicture(@PathVariable String fileName) {
        Resource resource = fileStorageService.loadFileAsResource(fileName, "profile-pictures");
        
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                .body(resource);
    }
    
    private User getCurrentUser() {
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
        
        return userService.getCurrentUser(email);
    }
}
