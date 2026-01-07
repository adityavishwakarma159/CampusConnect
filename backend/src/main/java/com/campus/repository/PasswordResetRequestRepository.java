package com.campus.repository;

import com.campus.model.PasswordResetRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PasswordResetRequestRepository extends JpaRepository<PasswordResetRequest, Long> {
    
    List<PasswordResetRequest> findByStatus(PasswordResetRequest.Status status);
    
    Optional<PasswordResetRequest> findByUserIdAndStatus(Long userId, PasswordResetRequest.Status status);
    
    List<PasswordResetRequest> findByUserId(Long userId);
}
