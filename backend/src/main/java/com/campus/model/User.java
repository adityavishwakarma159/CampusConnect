package com.campus.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(nullable = false)
    private String name;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;
    
    @Column(name = "roll_number", length = 50)
    private String rollNumber;
    
    @Column(name = "joining_year")
    private Integer joiningYear;
    
    @Column(length = 100)
    private String designation;
    
    @Column(name = "profile_picture", length = 500)
    private String profilePicture;
    
    @Column(name = "fcm_token", length = 500)
    private String fcmToken;
    
    @Column(name = "is_first_login", nullable = false)
    private Boolean isFirstLogin = true;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum Role {
        ADMIN, FACULTY, STUDENT
    }
}
