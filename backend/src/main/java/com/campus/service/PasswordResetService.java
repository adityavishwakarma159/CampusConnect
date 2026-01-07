package com.campus.service;

import com.campus.dto.PasswordResetRequestDTO;
import com.campus.exception.CustomExceptions;
import com.campus.model.PasswordResetRequest;
import com.campus.model.User;
import com.campus.repository.PasswordResetRequestRepository;
import com.campus.repository.UserRepository;
import com.campus.util.PasswordGenerator;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PasswordResetService {
    
    private final PasswordResetRequestRepository resetRequestRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    
    public List<PasswordResetRequestDTO> getPendingRequests() {
        List<PasswordResetRequest> requests = resetRequestRepository.findByStatus(PasswordResetRequest.Status.PENDING);
        return requests.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void approveRequest(Long requestId, Long approvedById) {
        PasswordResetRequest request = resetRequestRepository.findById(requestId)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("Request not found"));
        
        if (request.getStatus() != PasswordResetRequest.Status.PENDING) {
            throw new IllegalStateException("Request is not pending");
        }
        
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("User not found"));
        
        User approvedBy = userRepository.findById(approvedById)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("Approver not found"));
        
        // Generate new temporary password
        String tempPassword = PasswordGenerator.generatePassword();
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setIsFirstLogin(true);
        userRepository.save(user);
        
        // Update request status
        request.setStatus(PasswordResetRequest.Status.APPROVED);
        request.setApprovedBy(approvedById);
        request.setApprovedAt(LocalDateTime.now());
        resetRequestRepository.save(request);
        
        // Send email
        emailService.sendPasswordResetApprovalEmail(user.getEmail(), user.getName(), tempPassword);
    }
    
    @Transactional
    public void rejectRequest(Long requestId, Long rejectedById, String reason) {
        PasswordResetRequest request = resetRequestRepository.findById(requestId)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("Request not found"));
        
        if (request.getStatus() != PasswordResetRequest.Status.PENDING) {
            throw new IllegalStateException("Request is not pending");
        }
        
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("User not found"));
        
        // Update request status
        request.setStatus(PasswordResetRequest.Status.REJECTED);
        request.setApprovedBy(rejectedById);
        request.setApprovedAt(LocalDateTime.now());
        resetRequestRepository.save(request);
        
        // Send email
        emailService.sendPasswordResetRejectionEmail(user.getEmail(), user.getName(), reason);
    }
    
    private PasswordResetRequestDTO convertToDTO(PasswordResetRequest request) {
        PasswordResetRequestDTO dto = new PasswordResetRequestDTO();
        dto.setId(request.getId());
        
        // Get user details
        User user = userRepository.findById(request.getUserId()).orElse(null);
        if (user != null) {
            dto.setUserId(user.getId());
            dto.setUserName(user.getName());
            dto.setUserEmail(user.getEmail());
            dto.setUserRole(user.getRole().name());
            
            if (user.getDepartment() != null) {
                dto.setDepartmentName(user.getDepartment().getName());
            }
        }
        
        dto.setStatus(request.getStatus().name());
        dto.setRequestedAt(request.getRequestedAt());
        dto.setApprovedAt(request.getApprovedAt());
        
        if (request.getApprovedBy() != null) {
            User approvedBy = userRepository.findById(request.getApprovedBy()).orElse(null);
            if (approvedBy != null) {
                dto.setApprovedByName(approvedBy.getName());
            }
        }
        
        return dto;
    }
}
