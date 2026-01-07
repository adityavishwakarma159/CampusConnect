package com.campus.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {
    
    private final JavaMailSender mailSender;
    
    @Value("${spring.mail.username:noreply@campusconnect.com}")
    private String fromEmail;
    
    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;
    
    public void sendInvitationEmail(String toEmail, String name, String tempPassword) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Welcome to Campus Connect!");
            message.setText(buildInvitationEmailBody(name, toEmail, tempPassword));
            
            mailSender.send(message);
            log.info("Invitation email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send invitation email to: {}", toEmail, e);
            // Don't throw exception - user creation should succeed even if email fails
        }
    }
    
    public void sendPasswordResetApprovalEmail(String toEmail, String name, String tempPassword) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Reset Approved - Campus Connect");
            message.setText(buildPasswordResetApprovalBody(name, tempPassword));
            
            mailSender.send(message);
            log.info("Password reset approval email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset approval email to: {}", toEmail, e);
        }
    }
    
    public void sendPasswordResetRejectionEmail(String toEmail, String name, String reason) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Password Reset Request Rejected - Campus Connect");
            message.setText(buildPasswordResetRejectionBody(name, reason));
            
            mailSender.send(message);
            log.info("Password reset rejection email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send password reset rejection email to: {}", toEmail, e);
        }
    }
    
    private String buildInvitationEmailBody(String name, String email, String tempPassword) {
        return String.format("""
            Dear %s,
            
            Welcome to Campus Connect!
            
            Your account has been created successfully. Please use the following credentials to log in:
            
            Email: %s
            Temporary Password: %s
            
            Login URL: %s/login
            
            IMPORTANT: For security reasons, you will be required to change your password upon first login.
            
            If you have any questions or need assistance, please contact your system administrator.
            
            Best regards,
            Campus Connect Team
            """, name, email, tempPassword, frontendUrl);
    }
    
    private String buildPasswordResetApprovalBody(String name, String tempPassword) {
        return String.format("""
            Dear %s,
            
            Your password reset request has been approved.
            
            Your new temporary password is: %s
            
            Login URL: %s/login
            
            IMPORTANT: Please change your password immediately after logging in.
            
            If you did not request this password reset, please contact your system administrator immediately.
            
            Best regards,
            Campus Connect Team
            """, name, tempPassword, frontendUrl);
    }
    
    private String buildPasswordResetRejectionBody(String name, String reason) {
        String reasonText = (reason != null && !reason.isEmpty()) 
            ? "\n\nReason: " + reason 
            : "";
        
        return String.format("""
            Dear %s,
            
            Your password reset request has been rejected.%s
            
            If you believe this is an error or need further assistance, please contact your system administrator.
            
            Best regards,
            Campus Connect Team
            """, name, reasonText);
    }
}
