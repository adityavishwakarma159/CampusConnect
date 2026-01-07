package com.campus.controller;

import com.campus.dto.*;
import com.campus.model.User;
import com.campus.service.AuthService;
import com.campus.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;
    private final UserService userService;
    
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/refresh")
    public ResponseEntity<LoginResponse> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        LoginResponse response = authService.refreshAccessToken(request.getRefreshToken());
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout() {
        Long userId = getCurrentUserId();
        authService.logout(userId);
        return ResponseEntity.ok(new ApiResponse(true, "Logged out successfully"));
    }
    
    @PostMapping("/first-time-setup")
    public ResponseEntity<ApiResponse> firstTimeSetup(@Valid @RequestBody FirstTimeSetupRequest request) {
        Long userId = getCurrentUserId();
        authService.firstTimeSetup(userId, request);
        return ResponseEntity.ok(new ApiResponse(true, "Password set successfully"));
    }
    
    @PostMapping("/request-password-reset")
    public ResponseEntity<ApiResponse> requestPasswordReset() {
        Long userId = getCurrentUserId();
        authService.requestPasswordReset(userId);
        return ResponseEntity.ok(new ApiResponse(true, "Password reset request submitted. Awaiting admin approval."));
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        Long userId = getCurrentUserId();
        User user = userService.getCurrentUser(userId);
        UserDTO userDTO = userService.convertToDTO(user);
        return ResponseEntity.ok(userDTO);
    }
    
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication == null || authentication.getPrincipal() == null) {
            throw new RuntimeException("User not authenticated");
        }
        
        String email;
        Object principal = authentication.getPrincipal();
        
        // Handle both String (from JWT) and UserDetails
        if (principal instanceof String) {
            email = (String) principal;
        } else if (principal instanceof org.springframework.security.core.userdetails.UserDetails) {
            email = ((org.springframework.security.core.userdetails.UserDetails) principal).getUsername();
        } else {
            throw new RuntimeException("Unknown principal type: " + principal.getClass().getName());
        }
        
        // Get user by email
        User user = userService.getCurrentUser(email);
        return user.getId();
    }
}
