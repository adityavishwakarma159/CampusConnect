package com.campus.service;

import com.campus.dto.FirstTimeSetupRequest;
import com.campus.dto.LoginRequest;
import com.campus.dto.LoginResponse;
import com.campus.dto.UserDTO;
import com.campus.exception.CustomExceptions;
import com.campus.model.PasswordResetRequest;
import com.campus.model.RefreshToken;
import com.campus.model.User;
import com.campus.repository.PasswordResetRequestRepository;
import com.campus.repository.RefreshTokenRepository;
import com.campus.repository.UserRepository;
import com.campus.security.JwtTokenProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordResetRequestRepository passwordResetRequestRepository;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;
    
    @Transactional
    public LoginResponse login(LoginRequest loginRequest) {
        // Authenticate user
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        
        // Get user from database
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("User not found"));
        
        // Generate tokens
        String accessToken = tokenProvider.generateAccessToken(
                user.getId(), 
                user.getEmail(), 
                user.getRole().name()
        );
        String refreshToken = tokenProvider.generateRefreshToken(user.getId());
        
        // Save refresh token
        saveRefreshToken(user.getId(), refreshToken);
        
        // Convert to DTO
        UserDTO userDTO = userService.convertToDTO(user);
        
        return new LoginResponse(accessToken, refreshToken, userDTO, user.getIsFirstLogin());
    }
    
    @Transactional
    public LoginResponse refreshAccessToken(String refreshToken) {
        // Validate refresh token
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new CustomExceptions.InvalidTokenException("Invalid refresh token");
        }
        
        // Check if token exists in database
        RefreshToken storedToken = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new CustomExceptions.InvalidTokenException("Refresh token not found"));
        
        // Check if token is expired
        if (storedToken.isExpired()) {
            refreshTokenRepository.delete(storedToken);
            throw new CustomExceptions.TokenExpiredException("Refresh token has expired");
        }
        
        // Get user
        Long userId = tokenProvider.getUserIdFromToken(refreshToken);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("User not found"));
        
        // Generate new access token
        String newAccessToken = tokenProvider.generateAccessToken(
                user.getId(), 
                user.getEmail(), 
                user.getRole().name()
        );
        
        // Convert to DTO
        UserDTO userDTO = userService.convertToDTO(user);
        
        return new LoginResponse(newAccessToken, refreshToken, userDTO, user.getIsFirstLogin());
    }
    
    @Transactional
    public void logout(Long userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }
    
    @Transactional
    public void firstTimeSetup(Long userId, FirstTimeSetupRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("User not found"));
        
        if (!user.getIsFirstLogin()) {
            throw new CustomExceptions.UnauthorizedException("Password already set");
        }
        
        // Update password and first login flag
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setIsFirstLogin(false);
        userRepository.save(user);
    }
    
    @Transactional
    public void requestPasswordReset(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("User not found"));
        
        // Check if there's already a pending request
        passwordResetRequestRepository.findByUserIdAndStatus(userId, PasswordResetRequest.Status.PENDING)
                .ifPresent(request -> {
                    throw new CustomExceptions.UnauthorizedException("Password reset request already pending");
                });
        
        // Create new request
        PasswordResetRequest request = new PasswordResetRequest();
        request.setUserId(userId);
        request.setStatus(PasswordResetRequest.Status.PENDING);
        passwordResetRequestRepository.save(request);
    }
    
    private void saveRefreshToken(Long userId, String token) {
        // Delete old refresh tokens for this user
        refreshTokenRepository.deleteByUserId(userId);
        
        // Create new refresh token
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setToken(token);
        refreshToken.setUserId(userId);
        refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7));
        refreshTokenRepository.save(refreshToken);
    }
}
