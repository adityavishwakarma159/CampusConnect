package com.campus.service;

import com.campus.dto.CreateUserRequest;
import com.campus.dto.PageResponse;
import com.campus.dto.UpdateUserRequest;
import com.campus.dto.UserDTO;
import com.campus.exception.CustomExceptions;
import com.campus.model.Department;
import com.campus.model.User;
import com.campus.repository.DepartmentRepository;
import com.campus.repository.UserRepository;
import com.campus.util.PasswordGenerator;
import jakarta.annotation.PostConstruct;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    
    @Value("${app.admin.email}")
    private String adminEmail;
    
    @Value("${app.admin.password}")
    private String adminPassword;
    
    @Value("${app.admin.name}")
    private String adminName;
    
    @PostConstruct
    public void createInitialAdmin() {
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User();
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setName(adminName);
            admin.setRole(User.Role.ADMIN);
            admin.setIsFirstLogin(false);
            admin.setIsActive(true);
            userRepository.save(admin);
            System.out.println("Initial admin account created: " + adminEmail);
        }
    }
    
    public User getCurrentUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("User not found"));
    }
    
    public User getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("User not found"));
    }
    
    public UserDTO convertToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setEmail(user.getEmail());
        dto.setName(user.getName());
        dto.setRole(user.getRole());
        dto.setRollNumber(user.getRollNumber());
        dto.setJoiningYear(user.getJoiningYear());
        dto.setDesignation(user.getDesignation());
        dto.setProfilePicture(user.getProfilePicture());
        dto.setIsFirstLogin(user.getIsFirstLogin());
        dto.setIsActive(user.getIsActive());
        dto.setCreatedAt(user.getCreatedAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        
        if (user.getDepartment() != null) {
            dto.setDepartmentId(user.getDepartment().getId());
            dto.setDepartmentName(user.getDepartment().getName());
            dto.setDepartmentCode(user.getDepartment().getCode());
        }
        
        return dto;
    }
    
    // Get all users with pagination and filtering
    public PageResponse<UserDTO> getAllUsers(int page, int size, User.Role role, Long departmentId, String search) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> userPage;
        
        if (search != null && !search.isEmpty()) {
            userPage = userRepository.findAll(pageable);
            // Filter by search in memory (for simplicity)
            List<User> filtered = userPage.getContent().stream()
                .filter(u -> u.getName().toLowerCase().contains(search.toLowerCase()) ||
                            u.getEmail().toLowerCase().contains(search.toLowerCase()))
                .collect(Collectors.toList());
            userPage = new org.springframework.data.domain.PageImpl<>(filtered, pageable, filtered.size());
        } else if (role != null && departmentId != null) {
            userPage = userRepository.findAll(pageable);
            List<User> filtered = userPage.getContent().stream()
                .filter(u -> u.getRole() == role && u.getDepartment() != null && u.getDepartment().getId().equals(departmentId))
                .collect(Collectors.toList());
            userPage = new org.springframework.data.domain.PageImpl<>(filtered, pageable, filtered.size());
        } else if (role != null) {
            userPage = new org.springframework.data.domain.PageImpl<>(userRepository.findByRole(role), pageable, userRepository.findByRole(role).size());
        } else if (departmentId != null) {
            userPage = new org.springframework.data.domain.PageImpl<>(userRepository.findByDepartmentId(departmentId), pageable, userRepository.findByDepartmentId(departmentId).size());
        } else {
            userPage = userRepository.findAll(pageable);
        }
        
        List<UserDTO> userDTOs = userPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        PageResponse<UserDTO> response = new PageResponse<>();
        response.setContent(userDTOs);
        response.setPageNumber(userPage.getNumber());
        response.setPageSize(userPage.getSize());
        response.setTotalElements(userPage.getTotalElements());
        response.setTotalPages(userPage.getTotalPages());
        response.setLast(userPage.isLast());
        
        return response;
    }
    
    // Get user by ID
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("User not found with id: " + id));
        return convertToDTO(user);
    }
    
    // Create user manually
    @Transactional
    public UserDTO createUser(CreateUserRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomExceptions.DuplicateEmailException("Email already exists: " + request.getEmail());
        }
        
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setRole(request.getRole());
        user.setIsFirstLogin(true);
        user.setIsActive(true);
        
        // Set department if provided
        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new CustomExceptions.UserNotFoundException("Department not found"));
            user.setDepartment(department);
        }
        
        // Set role-specific fields
        if (request.getRole() == User.Role.STUDENT) {
            user.setRollNumber(request.getRollNumber());
            user.setJoiningYear(request.getJoiningYear());
        } else if (request.getRole() == User.Role.FACULTY) {
            user.setDesignation(request.getDesignation());
        }
        
        // Generate temporary password
        String tempPassword = PasswordGenerator.generatePassword();
        user.setPassword(passwordEncoder.encode(tempPassword));
        
        // Save user
        user = userRepository.save(user);
        
        // Send invitation email
        emailService.sendInvitationEmail(user.getEmail(), user.getName(), tempPassword);
        
        return convertToDTO(user);
    }
    
    // Update user
    @Transactional
    public UserDTO updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("User not found with id: " + id));
        
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new CustomExceptions.UserNotFoundException("Department not found"));
            user.setDepartment(department);
        }
        if (request.getRollNumber() != null) {
            user.setRollNumber(request.getRollNumber());
        }
        if (request.getJoiningYear() != null) {
            user.setJoiningYear(request.getJoiningYear());
        }
        if (request.getDesignation() != null) {
            user.setDesignation(request.getDesignation());
        }
        if (request.getIsActive() != null) {
            user.setIsActive(request.getIsActive());
        }
        
        user = userRepository.save(user);
        return convertToDTO(user);
    }
    
    // Delete user (soft delete)
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("User not found with id: " + id));
        user.setIsActive(false);
        userRepository.save(user);
    }
    
    // Toggle user status
    @Transactional
    public UserDTO toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new CustomExceptions.UserNotFoundException("User not found with id: " + id));
        user.setIsActive(!user.getIsActive());
        user = userRepository.save(user);
        return convertToDTO(user);
    }
    
    
    // Bulk create users
    @Transactional
    public List<UserDTO> bulkCreateUsers(List<CreateUserRequest> requests) {
        return requests.stream()
                .map(this::createUser)
                .collect(Collectors.toList());
    }
    
    // Get users by department
    public List<User> getUsersByDepartment(Long departmentId) {
        return userRepository.findByDepartmentId(departmentId);
    }
}
