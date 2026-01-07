package com.campus.service;

import com.campus.model.ChatMessage;
import com.campus.model.User;
import com.campus.repository.ChatParticipantRepository;
import com.campus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ChatPermissionService {
    
    private final UserRepository userRepository;
    private final ChatParticipantRepository chatParticipantRepository;
    
    /**
     * Check if user can post in a group chat
     */
    public boolean canPostInGroup(Long userId, ChatMessage.ChatType chatType, Long departmentId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return false;
        
        // Verify user is in the department
        if (!user.getDepartment().getId().equals(departmentId)) {
            return false;
        }
        
        switch (chatType) {
            case FACULTY_STUDENT_GROUP:
                return canPostInFacultyStudentGroup(user);
            case DEPARTMENT_GROUP:
                return canPostInStudentGroup(user, departmentId);
            case ONE_TO_ONE:
                return true; // One-to-one always allowed
            default:
                return false;
        }
    }
    
    /**
     * Faculty and Admin can post in Faculty-Student group
     */
    public boolean canPostInFacultyStudentGroup(User user) {
        return user.getRole() == User.Role.FACULTY || user.getRole() == User.Role.ADMIN;
    }
    
    /**
     * Students can post in Student group ONLY if no faculty is monitoring
     */
    public boolean canPostInStudentGroup(User user, Long departmentId) {
        if (user.getRole() == User.Role.FACULTY || user.getRole() == User.Role.ADMIN) {
            return true; // Faculty/Admin can always post
        }
        
        if (user.getRole() == User.Role.STUDENT) {
            // Check if any faculty is monitoring this group
            boolean facultyMonitoring = isFacultyMonitoring(departmentId);
            return !facultyMonitoring; // Students can post only if no faculty monitoring
        }
        
        return false;
    }
    
    /**
     * Check if any faculty is monitoring the student group
     */
    public boolean isFacultyMonitoring(Long departmentId) {
        // Check if any faculty/admin has joined the department group
        return chatParticipantRepository.existsByDepartmentIdAndChatTypeAndUserRole(
            departmentId,
            ChatMessage.ChatType.DEPARTMENT_GROUP
        );
    }
    
    /**
     * All department members can read group messages
     */
    public boolean canReadGroup(Long userId, Long departmentId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return false;
        
        return user.getDepartment().getId().equals(departmentId);
    }
}
