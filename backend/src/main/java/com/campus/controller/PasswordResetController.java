package com.campus.controller;

import com.campus.dto.ApiResponse;
import com.campus.dto.PasswordResetRequestDTO;
import com.campus.service.PasswordResetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/password-reset-requests")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class PasswordResetController {
    
    private final PasswordResetService passwordResetService;
    
    @GetMapping
    public ResponseEntity<List<PasswordResetRequestDTO>> getPendingRequests() {
        List<PasswordResetRequestDTO> requests = passwordResetService.getPendingRequests();
        return ResponseEntity.ok(requests);
    }
    
    @PostMapping("/{id}/approve")
    public ResponseEntity<ApiResponse> approveRequest(@PathVariable Long id) {
        Long adminId = getCurrentUserId();
        passwordResetService.approveRequest(id, adminId);
        return ResponseEntity.ok(new ApiResponse(true, "Password reset request approved successfully"));
    }
    
    @PostMapping("/{id}/reject")
    public ResponseEntity<ApiResponse> rejectRequest(
            @PathVariable Long id,
            @RequestParam(required = false) String reason
    ) {
        Long adminId = getCurrentUserId();
        passwordResetService.rejectRequest(id, adminId, reason);
        return ResponseEntity.ok(new ApiResponse(true, "Password reset request rejected"));
    }
    
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // Extract user ID from authentication - simplified for now
        // In production, you'd extract this from JWT token claims
        return 1L; // Placeholder - should be extracted from JWT
    }
}
