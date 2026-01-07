package com.campus.controller;

import com.campus.dto.LoginResponse;
import com.campus.model.User;
import com.campus.repository.UserRepository;
import com.campus.security.JwtTokenProvider;
import com.campus.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class ImpersonationController {
    
    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtTokenProvider jwtTokenProvider;
    
    @PostMapping("/impersonate/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ImpersonationResponse> impersonateUser(@PathVariable Long userId) {
        User admin = getCurrentUser();
        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Generate impersonation token
        String token = jwtTokenProvider.generateAccessToken(
            targetUser.getId(), 
            targetUser.getEmail(), 
            targetUser.getRole().toString()
        );
        
        ImpersonationResponse response = new ImpersonationResponse();
        response.setToken(token);
        response.setUserId(targetUser.getId());
        response.setUserName(targetUser.getName());
        response.setUserEmail(targetUser.getEmail());
        response.setUserRole(targetUser.getRole().toString());
        response.setAdminId(admin.getId());
        response.setAdminName(admin.getName());
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/stop-impersonation")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> stopImpersonation() {
        User admin = getCurrentUser();
        
        // Generate fresh admin token
        String token = jwtTokenProvider.generateAccessToken(
            admin.getId(),
            admin.getEmail(),
            admin.getRole().toString()
        );
        String refreshToken = jwtTokenProvider.generateRefreshToken(admin.getId());
        
        Map<String, String> response = new HashMap<>();
        response.put("accessToken", token);
        response.put("refreshToken", refreshToken);
        
        return ResponseEntity.ok(response);
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
    
    @Data
    @AllArgsConstructor
    public static class ImpersonationResponse {
        private String token;
        private Long userId;
        private String userName;
        private String userEmail;
        private String userRole;
        private Long adminId;
        private String adminName;
        
        public ImpersonationResponse() {}
    }
}
