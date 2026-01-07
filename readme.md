# Campus Connect - Project README

Developers of this Project :
1. Aditya Vishwakarma - 44
2. Soniya Yadav - 59
3. Ankita Yadav - 49

Project Guide : 
Amitanand Mishra

## Sprint-Based Development Guide

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [System Requirements](#system-requirements)
4. [Project Structure](#project-structure)
5. [Sprint Planning](#sprint-planning)
6. [Installation & Setup](#installation--setup)
7. [API Documentation](#api-documentation)
8. [Deployment Guide](#deployment-guide)

---

## Project Overview

**Campus Connect** is a comprehensive web-based digital communication and academic management platform designed for educational institutions. It streamlines campus communication, enables real-time collaboration, and provides academic resource management through a secure, role-based system.

### Key Features
- 🔐 Secure JWT-based authentication with refresh tokens
- 📢 Real-time announcements and notifications (In-app + FCM)
- 💬 WebSocket-based chat (Department groups + One-to-one)
- 📚 Study Material Repository
- 📊 Attendance Management System
- 👥 Role-based access (Admin, Faculty, Student)
- 🌙 Dark mode support
- 📱 Fully responsive design

---

## Tech Stack

### Frontend
- **Framework:** React JS 18+
- **State Management:** Context API
- **Routing:** React Router v6
- **Styling:** Tailwind CSS / Material-UI
- **HTTP Client:** Axios
- **WebSocket:** SockJS + STOMP Client
- **Notifications:** Firebase Cloud Messaging (FCM)

### Backend
- **Framework:** Spring Boot 3.x
- **ORM:** Hibernate
- **Database:** MySQL 8.0+
- **Authentication:** JWT (JSON Web Tokens)
- **WebSocket:** STOMP over SockJS
- **Email Service:** JavaMailSender
- **File Handling:** MultipartFile
- **Excel Processing:** Apache POI

### Development Tools
- **Build Tool:** Maven (Backend), npm/yarn (Frontend)
- **Version Control:** Git
- **IDE:** IntelliJ IDEA / VS Code
- **API Testing:** Postman

---

## System Requirements

### Hardware
- **Processor:** Intel i3 or equivalent (i5+ recommended)
- **RAM:** 4GB minimum (8GB+ recommended)
- **Storage:** 5GB free space
- **Network:** Stable internet connection

### Software
- **OS:** Windows 10/11, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **Java:** JDK 17+
- **Node.js:** v16+ with npm/yarn
- **MySQL:** 8.0+
- **Browser:** Chrome 90+, Firefox 88+, Safari 14+

---

## Project Structure

```
campus-connect/
│
├── backend/                          # Spring Boot Backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/campus/
│   │   │   │   ├── config/          # Configuration classes
│   │   │   │   │   ├── SecurityConfig.java
│   │   │   │   │   ├── WebSocketConfig.java
│   │   │   │   │   ├── CorsConfig.java
│   │   │   │   │   └── FirebaseConfig.java
│   │   │   │   │
│   │   │   │   ├── controller/      # REST Controllers
│   │   │   │   │   ├── AuthController.java
│   │   │   │   │   ├── AnnouncementController.java
│   │   │   │   │   ├── ChatController.java
│   │   │   │   │   ├── AttendanceController.java
│   │   │   │   │   ├── StudyMaterialController.java
│   │   │   │   │   ├── UserController.java
│   │   │   │   │   └── NotificationController.java
│   │   │   │   │
│   │   │   │   ├── model/           # Entity classes
│   │   │   │   │   ├── User.java
│   │   │   │   │   ├── Announcement.java
│   │   │   │   │   ├── ChatMessage.java
│   │   │   │   │   ├── Attendance.java
│   │   │   │   │   ├── StudyMaterial.java
│   │   │   │   │   ├── Notification.java
│   │   │   │   │   ├── Department.java
│   │   │   │   │   └── PasswordResetRequest.java
│   │   │   │   │
│   │   │   │   ├── repository/      # JPA Repositories
│   │   │   │   │   ├── UserRepository.java
│   │   │   │   │   ├── AnnouncementRepository.java
│   │   │   │   │   ├── ChatMessageRepository.java
│   │   │   │   │   ├── AttendanceRepository.java
│   │   │   │   │   ├── StudyMaterialRepository.java
│   │   │   │   │   ├── NotificationRepository.java
│   │   │   │   │   └── PasswordResetRequestRepository.java
│   │   │   │   │
│   │   │   │   ├── service/         # Business Logic
│   │   │   │   │   ├── AuthService.java
│   │   │   │   │   ├── UserService.java
│   │   │   │   │   ├── AnnouncementService.java
│   │   │   │   │   ├── ChatService.java
│   │   │   │   │   ├── AttendanceService.java
│   │   │   │   │   ├── StudyMaterialService.java
│   │   │   │   │   ├── NotificationService.java
│   │   │   │   │   ├── FileStorageService.java
│   │   │   │   │   ├── ExcelService.java
│   │   │   │   │   └── EmailService.java
│   │   │   │   │
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   │   ├── LoginRequest.java
│   │   │   │   │   ├── LoginResponse.java
│   │   │   │   │   ├── AnnouncementDTO.java
│   │   │   │   │   ├── ChatMessageDTO.java
│   │   │   │   │   ├── AttendanceDTO.java
│   │   │   │   │   └── UserDTO.java
│   │   │   │   │
│   │   │   │   ├── security/        # Security components
│   │   │   │   │   ├── JwtTokenProvider.java
│   │   │   │   │   ├── JwtAuthenticationFilter.java
│   │   │   │   │   └── CustomUserDetailsService.java
│   │   │   │   │
│   │   │   │   └── exception/       # Exception handling
│   │   │   │       ├── GlobalExceptionHandler.java
│   │   │   │       └── CustomExceptions.java
│   │   │   │
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── application-dev.properties
│   │   │
│   │   └── test/                    # Unit tests
│   │
│   └── uploads/                     # Local file storage
│       ├── announcements/
│       ├── chats/
│       ├── study-materials/
│       └── profiles/
│
├── frontend/                        # React Frontend
│   ├── public/
│   │   ├── index.html
│   │   └── firebase-messaging-sw.js
│   │
│   ├── src/
│   │   ├── components/              # Reusable components
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   └── NotificationBell.jsx
│   │   │   │
│   │   │   ├── announcements/
│   │   │   │   ├── AnnouncementCard.jsx
│   │   │   │   ├── AnnouncementForm.jsx
│   │   │   │   └── AnnouncementList.jsx
│   │   │   │
│   │   │   ├── chat/
│   │   │   │   ├── ChatWindow.jsx
│   │   │   │   ├── ChatList.jsx
│   │   │   │   ├── MessageBubble.jsx
│   │   │   │   └── ChatInput.jsx
│   │   │   │
│   │   │   ├── attendance/
│   │   │   │   ├── AttendanceTable.jsx
│   │   │   │   ├── AttendanceForm.jsx
│   │   │   │   └── AttendanceChart.jsx
│   │   │   │
│   │   │   └── studymaterial/
│   │   │       ├── MaterialCard.jsx
│   │   │       ├── MaterialUploadForm.jsx
│   │   │       └── MaterialList.jsx
│   │   │
│   │   ├── pages/                   # Page components
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── FirstTimeSetup.jsx
│   │   │   │   └── PasswordReset.jsx
│   │   │   │
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   ├── UserManagement.jsx
│   │   │   │   ├── BulkUpload.jsx
│   │   │   │   ├── PasswordResetApproval.jsx
│   │   │   │   └── SystemSettings.jsx
│   │   │   │
│   │   │   ├── faculty/
│   │   │   │   ├── FacultyDashboard.jsx
│   │   │   │   ├── ManageAnnouncements.jsx
│   │   │   │   ├── ManageAttendance.jsx
│   │   │   │   ├── ManageStudyMaterials.jsx
│   │   │   │   └── StudentList.jsx
│   │   │   │
│   │   │   ├── student/
│   │   │   │   ├── StudentDashboard.jsx
│   │   │   │   ├── ViewAnnouncements.jsx
│   │   │   │   ├── ViewAttendance.jsx
│   │   │   │   ├── ViewStudyMaterials.jsx
│   │   │   │   └── Profile.jsx
│   │   │   │
│   │   │   └── common/
│   │   │       ├── Chat.jsx
│   │   │       ├── Notifications.jsx
│   │   │       └── Profile.jsx
│   │   │
│   │   ├── context/                 # Context API
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ChatContext.jsx
│   │   │   ├── NotificationContext.jsx
│   │   │   └── ThemeContext.jsx
│   │   │
│   │   ├── services/                # API services
│   │   │   ├── authService.js
│   │   │   ├── announcementService.js
│   │   │   ├── chatService.js
│   │   │   ├── attendanceService.js
│   │   │   ├── studyMaterialService.js
│   │   │   ├── userService.js
│   │   │   ├── notificationService.js
│   │   │   └── websocketService.js
│   │   │
│   │   ├── utils/                   # Utility functions
│   │   │   ├── axiosConfig.js
│   │   │   ├── validators.js
│   │   │   ├── dateFormatter.js
│   │   │   └── constants.js
│   │   │
│   │   ├── hooks/                   # Custom hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useWebSocket.js
│   │   │   └── useNotification.js
│   │   │
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   └── routes.jsx
│   │
│   ├── .env
│   ├── package.json
│   └── tailwind.config.js
│
├── database/
│   └── schema.sql                   # Database schema
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── USER_GUIDE.md
│   └── DEPLOYMENT_GUIDE.md
│
└── README.md
```

---

## Sprint Planning

### **Sprint Overview**

The project is divided into **8 sprints**, each lasting **1-2 weeks**. Each sprint focuses on specific modules with clear deliverables.

---

## **SPRINT 1: Project Setup & Authentication (Week 1-2)**

### **Objectives**
- Set up development environment
- Initialize backend and frontend projects
- Implement authentication system with JWT
- Create basic database schema

### **Backend Tasks**
1. **Project Initialization**
   - Create Spring Boot project with dependencies (Spring Web, Spring Data JPA, Spring Security, MySQL Driver, JWT, Lombok)
   - Configure `application.properties`:
     ```properties
     # Database Configuration
     spring.datasource.url=jdbc:mysql://localhost:3306/campus_connect
     spring.datasource.username=root
     spring.datasource.password=your_password
     spring.jpa.hibernate.ddl-auto=update
     spring.jpa.show-sql=true
     
     # JWT Configuration
     jwt.secret=your_secret_key_here_make_it_long_and_secure
     jwt.access-token-expiration=900000    # 15 minutes
     jwt.refresh-token-expiration=604800000 # 7 days
     
     # File Upload Configuration
     spring.servlet.multipart.max-file-size=50MB
     spring.servlet.multipart.max-request-size=50MB
     file.upload-dir=./uploads
     ```

2. **Database Schema Creation**
   ```sql
   -- Users Table
   CREATE TABLE users (
       id BIGINT PRIMARY KEY AUTO_INCREMENT,
       email VARCHAR(255) UNIQUE NOT NULL,
       password VARCHAR(255) NOT NULL,
       name VARCHAR(255) NOT NULL,
       role ENUM('ADMIN', 'FACULTY', 'STUDENT') NOT NULL,
       department_id BIGINT,
       roll_number VARCHAR(50),
       joining_year INT,
       designation VARCHAR(100),
       profile_picture VARCHAR(500),
       fcm_token VARCHAR(500),
       is_first_login BOOLEAN DEFAULT TRUE,
       is_active BOOLEAN DEFAULT TRUE,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       FOREIGN KEY (department_id) REFERENCES departments(id)
   );
   
   -- Departments Table
   CREATE TABLE departments (
       id BIGINT PRIMARY KEY AUTO_INCREMENT,
       name VARCHAR(255) UNIQUE NOT NULL,
       code VARCHAR(50) UNIQUE NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   -- Refresh Tokens Table
   CREATE TABLE refresh_tokens (
       id BIGINT PRIMARY KEY AUTO_INCREMENT,
       token VARCHAR(500) UNIQUE NOT NULL,
       user_id BIGINT NOT NULL,
       expiry_date TIMESTAMP NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
   );
   
   -- Password Reset Requests Table
   CREATE TABLE password_reset_requests (
       id BIGINT PRIMARY KEY AUTO_INCREMENT,
       user_id BIGINT NOT NULL,
       status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
       requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       approved_by BIGINT,
       approved_at TIMESTAMP,
       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
       FOREIGN KEY (approved_by) REFERENCES users(id)
   );
   ```

3. **Create Entity Classes**
   - `User.java`, `Department.java`, `RefreshToken.java`, `PasswordResetRequest.java`

4. **Implement Security Configuration**
   - `SecurityConfig.java`: Configure JWT authentication, password encoding
   - `JwtTokenProvider.java`: Generate and validate JWT tokens
   - `JwtAuthenticationFilter.java`: Filter to validate tokens on each request
   - `CustomUserDetailsService.java`: Load user from database

5. **Create Authentication APIs**
   - `POST /api/auth/login` - User login (returns access + refresh token)
   - `POST /api/auth/refresh` - Refresh access token
   - `POST /api/auth/logout` - Logout user
   - `POST /api/auth/first-time-setup` - Set password on first login
   - `POST /api/auth/request-password-reset` - Request password reset
   - `GET /api/auth/me` - Get current user details

6. **Create Repositories & Services**
   - `UserRepository`, `RefreshTokenRepository`, `PasswordResetRequestRepository`
   - `AuthService`, `UserService`

### **Frontend Tasks**
1. **Project Initialization**
   - Create React app with `npx create-react-app frontend`
   - Install dependencies:
     ```bash
     npm install axios react-router-dom jwt-decode
     npm install -D tailwindcss postcss autoprefixer
     ```

2. **Setup Routing**
   - Configure React Router v6
   - Create route structure for login, dashboard, etc.

3. **Create Auth Context**
   - `AuthContext.jsx`: Manage authentication state globally
   - Store tokens in localStorage
   - Implement auto-refresh token logic

4. **Create Axios Configuration**
   ```javascript
   // src/utils/axiosConfig.js
   import axios from 'axios';
   
   const API_BASE_URL = 'http://localhost:8080/api';
   
   const axiosInstance = axios.create({
       baseURL: API_BASE_URL,
   });
   
   // Request interceptor to add JWT token
   axiosInstance.interceptors.request.use(
       (config) => {
           const token = localStorage.getItem('accessToken');
           if (token) {
               config.headers.Authorization = `Bearer ${token}`;
           }
           return config;
       },
       (error) => Promise.reject(error)
   );
   
   // Response interceptor for token refresh
   axiosInstance.interceptors.response.use(
       (response) => response,
       async (error) => {
           const originalRequest = error.config;
           if (error.response?.status === 401 && !originalRequest._retry) {
               originalRequest._retry = true;
               const refreshToken = localStorage.getItem('refreshToken');
               if (refreshToken) {
                   try {
                       const { data } = await axios.post(
                           `${API_BASE_URL}/auth/refresh`,
                           { refreshToken }
                       );
                       localStorage.setItem('accessToken', data.accessToken);
                       originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                       return axiosInstance(originalRequest);
                   } catch (err) {
                       // Refresh failed, logout user
                       localStorage.clear();
                       window.location.href = '/login';
                   }
               }
           }
           return Promise.reject(error);
       }
   );
   
   export default axiosInstance;
   ```

5. **Create Authentication Pages**
   - `Login.jsx`: Login form with email/password
   - `FirstTimeSetup.jsx`: Password setup for new users
   - `PasswordReset.jsx`: Password reset request form

6. **Create Auth Service**
   ```javascript
   // src/services/authService.js
   import axiosInstance from '../utils/axiosConfig';
   
   export const login = async (email, password) => {
       const response = await axiosInstance.post('/auth/login', { email, password });
       return response.data;
   };
   
   export const logout = async () => {
       await axiosInstance.post('/auth/logout');
       localStorage.clear();
   };
   
   export const getCurrentUser = async () => {
       const response = await axiosInstance.get('/auth/me');
       return response.data;
   };
   ```

### **Testing Tasks**
- Test login with hardcoded admin credentials
- Test JWT token generation and validation
- Test refresh token flow
- Test protected routes

### **Deliverables**
- ✅ Backend authentication APIs working
- ✅ Frontend login page functional
- ✅ JWT + Refresh token mechanism working
- ✅ Database schema created
- ✅ Basic routing setup

---

## **SPRINT 2: User Management & Role-Based Access (Week 3-4)**

### **Objectives**
- Implement admin user management
- Create bulk user upload via Excel
- Setup role-based dashboards
- Implement password reset approval workflow

### **Backend Tasks**
1. **Create User Management APIs**
   - `GET /api/admin/users` - Get all users (paginated, filterable)
   - `GET /api/admin/users/{id}` - Get user by ID
   - `POST /api/admin/users` - Create user manually
   - `PUT /api/admin/users/{id}` - Update user
   - `DELETE /api/admin/users/{id}` - Delete user
   - `POST /api/admin/users/bulk-upload` - Upload Excel file
   - `GET /api/admin/departments` - Get all departments
   - `POST /api/admin/departments` - Create department

2. **Implement Excel Processing**
   ```java
   // ExcelService.java
   @Service
   public class ExcelService {
       public List<UserDTO> parseStudentExcel(MultipartFile file) {
           // Parse Excel with columns: Name, Email, Roll Number, Department, Joining Year
           // Validate data, check for duplicates
           // Return list of UserDTO objects
       }
       
       public List<UserDTO> parseFacultyExcel(MultipartFile file) {
           // Parse Excel with columns: Name, Email, Department, Designation
       }
   }
   ```

3. **Implement Email Service**
   ```java
   // EmailService.java
   @Service
   public class EmailService {
       @Autowired
       private JavaMailSender mailSender;
       
       public void sendInvitationEmail(User user, String tempPassword) {
           SimpleMailMessage message = new SimpleMailMessage();
           message.setTo(user.getEmail());
           message.setSubject("Welcome to Campus Connect");
           message.setText("Your account has been created...");
           mailSender.send(message);
       }
       
       public void sendPasswordResetLink(User user, String resetLink) {
           // Send password reset email
       }
   }
   ```

4. **Implement Password Reset Approval**
   - `GET /api/admin/password-reset-requests` - Get pending requests
   - `POST /api/admin/password-reset-requests/{id}/approve` - Approve request
   - `POST /api/admin/password-reset-requests/{id}/reject` - Reject request

5. **Add Role-Based Authorization**
   ```java
   @PreAuthorize("hasRole('ADMIN')")
   @GetMapping("/admin/users")
   public ResponseEntity<?> getAllUsers() { ... }
   
   @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
   @GetMapping("/announcements")
   public ResponseEntity<?> getAnnouncements() { ... }
   ```

### **Frontend Tasks**
1. **Create Admin Dashboard**
   - `AdminDashboard.jsx`: Overview with statistics
   - Display: Total users, departments, recent activity

2. **Create User Management Interface**
   - `UserManagement.jsx`: 
     - Table with all users (filterable by role, department)
     - Edit/delete buttons
     - Search functionality
   
3. **Create Bulk Upload Page**
   - `BulkUpload.jsx`:
     - File upload component (drag & drop)
     - Excel template download links
     - Upload progress indicator
     - Success/error message display

4. **Create Password Reset Approval Page**
   - `PasswordResetApproval.jsx`:
     - List of pending requests
     - Approve/reject buttons
     - User details display

5. **Create Role-Based Route Protection**
   ```javascript
   // ProtectedRoute.jsx
   const ProtectedRoute = ({ children, allowedRoles }) => {
       const { user } = useAuth();
       
       if (!user) {
           return <Navigate to="/login" />;
       }
       
       if (!allowedRoles.includes(user.role)) {
           return <Navigate to="/unauthorized" />;
       }
       
       return children;
   };
   ```

6. **Create Dashboard Shells**
   - `FacultyDashboard.jsx`: Basic layout
   - `StudentDashboard.jsx`: Basic layout

### **Testing Tasks**
- Test manual user creation
- Test Excel bulk upload (students & faculty)
- Test email sending
- Test password reset request flow
- Test role-based access control

### **Deliverables**
- ✅ Admin can create users manually
- ✅ Admin can bulk upload users via Excel
- ✅ Email invitations sent to new users
- ✅ Password reset approval workflow functional
- ✅ Role-based dashboards created
- ✅ Route protection based on roles working

---

## **SPRINT 3: Announcements & Notifications (Week 5-6)**

### **Objectives**
- Implement announcement system
- Setup in-app notifications
- Integrate Firebase Cloud Messaging (FCM)
- Create file attachment handling

### **Backend Tasks**
1. **Database Schema**
   ```sql
   -- Announcements Table
   CREATE TABLE announcements (
       id BIGINT PRIMARY KEY AUTO_INCREMENT,
       title VARCHAR(500) NOT NULL,
       content TEXT NOT NULL,
       department_id BIGINT NOT NULL,
       created_by BIGINT NOT NULL,
       attachment_url VARCHAR(500),
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       FOREIGN KEY (department_id) REFERENCES departments(id),
       FOREIGN KEY (created_by) REFERENCES users(id)
   );
   
   -- Notifications Table
   CREATE TABLE notifications (
       id BIGINT PRIMARY KEY AUTO_INCREMENT,
       user_id BIGINT NOT NULL,
       title VARCHAR(500) NOT NULL,
       message TEXT NOT NULL,
       type ENUM('ANNOUNCEMENT', 'CHAT', 'ATTENDANCE', 'SYSTEM') NOT NULL,
       reference_id BIGINT,
       is_read BOOLEAN DEFAULT FALSE,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
   );
   ```

2. **Create Announcement APIs**
   - `POST /api/announcements` - Create announcement (Faculty/Admin)
   - `GET /api/announcements` - Get announcements (filtered by department)
   - `GET /api/announcements/{id}` - Get announcement by ID
   - `PUT /api/announcements/{id}` - Update announcement (own only for faculty)
   - `DELETE /api/announcements/{id}` - Delete announcement
   - `POST /api/announcements/{id}/attachment` - Upload attachment
   - `GET /api/announcements/{id}/attachment` - Download attachment

3. **Implement File Storage Service**
   ```java
   @Service
   public class FileStorageService {
       @Value("${file.upload-dir}")
       private String uploadDir;
       
       public String storeFile(MultipartFile file, String subFolder) {
           // Create directory if not exists
           // Generate unique filename
           // Save file to local storage
           // Return file path
       }
       
       public Resource loadFileAsResource(String fileName, String subFolder) {
           // Load file from local storage
           // Return as Resource
       }
       
       public void deleteFile(String filePath) {
           // Delete file from local storage
       }
   }
   ```

4. **Create Notification APIs**
   - `GET /api/notifications` - Get user notifications (paginated)
   - `GET /api/notifications/unread-count` - Get unread count
   - `PUT /api/notifications/{id}/mark-read` - Mark as read
   - `PUT /api/notifications/mark-all-read` - Mark all as read

5. **Implement FCM Integration**
   ```java
   @Service
   public class FCMService {
       public void sendNotificationToUser(Long userId, String title, String body) {
           User user = userRepository.findById(userId).orElseThrow();
           if (user.getFcmToken() != null) {
               Message message = Message.builder()
                   .setToken(user.getFcmToken())
                   .setNotification(Notification.builder()
                       .setTitle(title)
                       .setBody(body)
                       .build())
                   .build();
               FirebaseMessaging.getInstance().send(message);
           }
       }
       
       public void sendNotificationToDepartment(Long deptId, String title, String body) {
           // Send to all users in department
       }
   }
   ```

6. **Create Notification Service**
   ```java
   @Service
   public class NotificationService {
       public void createNotificationForAnnouncement(Announcement announcement) {
           // Get all users in department
           // Create in-app notifications
           // Send FCM notifications
       }
   }
   ```

### **Frontend Tasks**
1. **Setup Firebase**
   - Add Firebase config in `.env`:
     ```
     REACT_APP_FIREBASE_API_KEY=your_api_key
     REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
     REACT_APP_FIREBASE_PROJECT_ID=your_project_id
     REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     REACT_APP_FIREBASE_APP_ID=your_app_id
     ```
   
   - Create `firebase-messaging-sw.js` in public folder
   - Initialize Firebase in app

2. **Implement FCM Token Management**
   ```javascript
   // src/services/notificationService.js
   import { getToken, onMessage } from 'firebase/messaging';
   import { messaging } from '../firebase';
   
   export const requestNotificationPermission = async () => {
       const permission = await Notification.requestPermission();
       if (permission === 'granted') {
           const token = await getToken(messaging, {
               vapidKey: 'your_vapid_key'
           });
           // Send token to backend
           await saveFCMToken(token);
           return token;
       }
   };
   
   export const onMessageListener = () =>
       new Promise((resolve) => {
           onMessage(messaging, (payload) => {
               resolve(payload);
           });
       });
   ```

3. **Create Announcement Components**
   - `AnnouncementCard.jsx`: Display single announcement
   - `AnnouncementList.jsx`: List all announcements
   - `AnnouncementForm.jsx`: Create/edit announcement form with file upload

4. **Create Announcement Pages**
   - `ManageAnnouncements.jsx` (Faculty/Admin):
     - Create new announcement button
     - List of own announcements
     - Edit/delete buttons
   
   - `ViewAnnouncements.jsx` (Student):
     - Read-only announcement feed
     - Download attachment button
     - Filter/search functionality

5. **Create Notification Components**
   - `NotificationBell.jsx`:
     - Bell icon with unread count badge
     - Dropdown showing recent notifications
     - Mark as read functionality
     - `Notifications.jsx`:
     - Full notification page
     - Filter by type
     - Mark all as read button

6. **Integrate Notifications in Header**
   - Add notification bell to header
   - Real-time update of unread count
   - Toast notifications for new announcements

### **Testing Tasks**
- Test announcement creation with file attachment
- Test announcement filtering by department
- Test file download
- Test in-app notification creation
- Test FCM notification delivery
- Test notification mark as read

### **Deliverables**
- ✅ Faculty/Admin can create announcements
- ✅ Students can view announcements
- ✅ File attachments working
- ✅ In-app notifications functional
- ✅ FCM browser notifications working
- ✅ Notification bell with unread count

---

## **SPRINT 4: Real-Time Chat System - Part 1 (Week 7-8)**

### **Objectives**
- Setup WebSocket with STOMP
- Implement one-to-one chat
- Create chat UI components
- Implement unread message tracking

### **Backend Tasks**
1. **Database Schema**
   ```sql
   -- Chat Messages Table
   CREATE TABLE chat_messages (
       id BIGINT PRIMARY KEY AUTO_INCREMENT,
       sender_id BIGINT NOT NULL,
       receiver_id BIGINT,
       chat_type ENUM('ONE_TO_ONE', 'DEPARTMENT_GROUP', 'FACULTY_STUDENT_GROUP') NOT NULL,
       department_id BIGINT,
       message TEXT NOT NULL,
       attachment_url VARCHAR(500),
       is_read BOOLEAN DEFAULT FALSE,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (sender_id) REFERENCES users(id),
       FOREIGN KEY (receiver_id) REFERENCES users(id),
       FOREIGN KEY (department_id) REFERENCES departments(id)
   );
   
   -- Chat Participants (for tracking conversations)
   CREATE TABLE chat_participants (
       id BIGINT PRIMARY KEY AUTO_INCREMENT,
       user_id BIGINT NOT NULL,
       other_user_id BIGINT,
       chat_type ENUM('ONE_TO_ONE', 'DEPARTMENT_GROUP', 'FACULTY_STUDENT_GROUP') NOT NULL,
       department_id BIGINT,
       last_message_id BIGINT,
       unread_count INT DEFAULT 0,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
       FOREIGN KEY (other_user_id) REFERENCES users(id) ON DELETE CASCADE,
       FOREIGN KEY (department_id) REFERENCES departments(id),
       FOREIGN KEY (last_message_id) REFERENCES chat_messages(id),
       UNIQUE KEY unique_conversation (user_id, other_user_id, chat_type, department_id)
   );
   ```

2. **Configure WebSocket**
   ```java
   @Configuration
   @EnableWebSocketMessageBroker
   public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
       
       @Override
       public void configureMessageBroker(MessageBrokerRegistry registry) {
           registry.enableSimpleBroker("/topic", "/queue");
           registry.setApplicationDestinationPrefixes("/app");
           registry.setUserDestinationPrefix("/user");
       }
       
       @Override
       public void registerStompEndpoints(StompEndpointRegistry registry) {
           registry.addEndpoint("/ws")
               .setAllowedOriginPatterns("*")
               .withSockJS();
       }
   }
   ```

3. **Create WebSocket Controller**
   ```java
   @Controller
   public class ChatController {
       
       @Autowired
       private ChatService chatService;
       
       // One-to-one messaging
       @MessageMapping("/chat.sendMessage")
       public void sendMessage(@Payload ChatMessageDTO message, 
                              Principal principal) {
           ChatMessage savedMessage = chatService.saveMessage(message, principal.getName());
           messagingTemplate.convertAndSendToUser(
               message.getReceiverId().toString(),
               "/queue/messages",
               savedMessage
           );
       }
       
       // Mark messages as read
       @MessageMapping("/chat.markAsRead")
       public void markAsRead(@Payload Long chatParticipantId, Principal principal) {
           chatService.markMessagesAsRead(chatParticipantId, principal.getName());
       }
   }
   ```

4. **Create Chat Service**
   ```java
   @Service
   public class ChatService {
       
       public ChatMessage saveMessage(ChatMessageDTO dto, String senderEmail) {
           User sender = userRepository.findByEmail(senderEmail).orElseThrow();
           User receiver = userRepository.findById(dto.getReceiverId()).orElseThrow();
           
           // Validate: same department
           if (!sender.getDepartment().equals(receiver.getDepartment())) {
               throw new UnauthorizedException("Cannot chat across departments");
           }
           
           ChatMessage message = new ChatMessage();
           message.setSender(sender);
           message.setReceiver(receiver);
           message.setMessage(dto.getMessage());
           message.setChatType(ChatType.ONE_TO_ONE);
           
           ChatMessage saved = chatMessageRepository.save(message);
           
           // Update chat participants
           updateChatParticipant(sender.getId(), receiver.getId(), saved.getId());
           updateChatParticipant(receiver.getId(), sender.getId(), saved.getId());
           
           return saved;
       }
       
       private void updateChatParticipant(Long userId, Long otherUserId, Long messageId) {
           ChatParticipant participant = chatParticipantRepository
               .findByUserIdAndOtherUserId(userId, otherUserId)
               .orElse(new ChatParticipant(userId, otherUserId));
           
           participant.setLastMessageId(messageId);
           if (!userId.equals(otherUserId)) {
               participant.setUnreadCount(participant.getUnreadCount() + 1);
           }
           chatParticipantRepository.save(participant);
       }
       
       public void markMessagesAsRead(Long chatParticipantId, String userEmail) {
           ChatParticipant participant = chatParticipantRepository
               .findById(chatParticipantId).orElseThrow();
           
           participant.setUnreadCount(0);
           chatParticipantRepository.save(participant);
           
           // Mark all messages as read
           chatMessageRepository.markAsRead(
               participant.getUserId(),
               participant.getOtherUserId()
           );
       }
   }
   ```

5. **Create Chat REST APIs**
   - `GET /api/chat/conversations` - Get user's conversation list
   - `GET /api/chat/messages/{userId}` - Get message history with a user
   - `GET /api/chat/users` - Get list of users to chat with (same department)
   - `POST /api/chat/upload` - Upload file in chat

### **Frontend Tasks**
1. **Install Dependencies**
   ```bash
   npm install @stomp/stompjs sockjs-client
   ```

2. **Create WebSocket Service**
   ```javascript
   // src/services/websocketService.js
   import { Client } from '@stomp/stompjs';
   import SockJS from 'sockjs-client';
   
   class WebSocketService {
       constructor() {
           this.client = null;
           this.subscriptions = {};
       }
       
       connect(token, onMessageReceived) {
           const socket = new SockJS('http://localhost:8080/ws');
           
           this.client = new Client({
               webSocketFactory: () => socket,
               connectHeaders: {
                   Authorization: `Bearer ${token}`
               },
               onConnect: () => {
                   console.log('Connected to WebSocket');
                   this.subscribeToUserQueue(onMessageReceived);
               },
               onStompError: (frame) => {
                   console.error('STOMP error', frame);
               }
           });
           
           this.client.activate();
       }
       
       subscribeToUserQueue(callback) {
           this.subscriptions.user = this.client.subscribe(
               '/user/queue/messages',
               (message) => {
                   const data = JSON.parse(message.body);
                   callback(data);
               }
           );
       }
       
       sendMessage(message) {
           this.client.publish({
               destination: '/app/chat.sendMessage',
               body: JSON.stringify(message)
           });
       }
       
       markAsRead(chatParticipantId) {
           this.client.publish({
               destination: '/app/chat.markAsRead',
               body: JSON.stringify(chatParticipantId)
           });
       }
       
       disconnect() {
           if (this.client) {
               this.client.deactivate();
           }
       }
   }
   
   export default new WebSocketService();
   ```

3. **Create Chat Context**
   ```javascript
   // src/context/ChatContext.jsx
   import { createContext, useState, useEffect, useContext } from 'react';
   import { useAuth } from './AuthContext';
   import websocketService from '../services/websocketService';
   import { getConversations } from '../services/chatService';
   
   const ChatContext = createContext();
   
   export const ChatProvider = ({ children }) => {
       const { user, token } = useAuth();
       const [conversations, setConversations] = useState([]);
       const [activeChat, setActiveChat] = useState(null);
       const [messages, setMessages] = useState([]);
       
       useEffect(() => {
           if (user && token) {
               websocketService.connect(token, handleNewMessage);
               loadConversations();
           }
           
           return () => websocketService.disconnect();
       }, [user, token]);
       
       const handleNewMessage = (message) => {
           // Update conversations
           // Update messages if chat is active
           // Play notification sound
       };
       
       const sendMessage = (receiverId, text, file) => {
           const message = {
               receiverId,
               message: text,
               attachmentUrl: file ? uploadFile(file) : null
           };
           websocketService.sendMessage(message);
       };
       
       return (
           <ChatContext.Provider value={{
               conversations,
               activeChat,
               messages,
               setActiveChat,
               sendMessage
           }}>
               {children}
           </ChatContext.Provider>
       );
   };
   
   export const useChat = () => useContext(ChatContext);
   ```

4. **Create Chat Components**
   - `ChatList.jsx`:
     - List of all conversations
     - Show last message preview
     - Unread count badge
     - Search/filter users
   
   - `ChatWindow.jsx`:
     - Message display area
     - Message input with file upload
     - Real-time message updates
     - Scroll to bottom on new message
   
   - `MessageBubble.jsx`:
     - Display single message
     - Different styles for sent/received
     - Timestamp display
     - File attachment preview

5. **Create Chat Page**
   - `Chat.jsx`:
     - Split layout: conversation list + chat window
     - Responsive design (mobile: toggle between list and chat)

6. **Implement Unread Count**
   - Show unread count on conversation items
   - Update header notification bell with total unread
   - Reset count when chat is opened

### **Testing Tasks**
- Test WebSocket connection
- Test one-to-one message sending
- Test message history loading
- Test unread count tracking
- Test file attachment in chat
- Test real-time message delivery
- Test auto-reconnection

### **Deliverables**
- ✅ WebSocket connection established
- ✅ One-to-one chat functional
- ✅ Chat UI components created
- ✅ Unread message tracking working
- ✅ File sharing in chat working
- ✅ Real-time message delivery

---

## **SPRINT 5: Real-Time Chat System - Part 2 (Week 9-10)**

### **Objectives**
- Implement department group chats
- Add faculty-student group chat
- Implement chat permissions
- Add typing indicators (optional)

### **Backend Tasks**
1. **Update Chat Controller for Group Chats**
   ```java
   // Department group chat (students only or all)
   @MessageMapping("/chat.sendGroupMessage")
   public void sendGroupMessage(@Payload ChatMessageDTO message, Principal principal) {
       User sender = userRepository.findByEmail(principal.getName()).orElseThrow();
       
       // Validate permissions based on chat type
       if (message.getChatType() == ChatType.FACULTY_STUDENT_GROUP 
           && sender.getRole() != Role.FACULTY && sender.getRole() != Role.ADMIN) {
           throw new UnauthorizedException("Only faculty can send messages in this group");
       }
       
       ChatMessage savedMessage = chatService.saveGroupMessage(message, sender);
       
       // Broadcast to all department members
       messagingTemplate.convertAndSend(
           "/topic/department/" + sender.getDepartment().getId(),
           savedMessage
       );
   }
   ```

2. **Implement Group Chat Permissions**
   ```java
   @Service
   public class ChatPermissionService {
       
       public boolean canPostInFacultyStudentGroup(User user) {
           return user.getRole() == Role.FACULTY || user.getRole() == Role.ADMIN;
       }
       
       public boolean canPostInStudentGroup(User user, Long departmentId) {
           Department dept = departmentRepository.findById(departmentId).orElseThrow();
           
           // Check if any faculty is monitoring
           boolean facultyPresent = chatParticipantRepository
               .existsByDepartmentAndChatTypeAndUserRole(
                   departmentId, 
                   ChatType.DEPARTMENT_GROUP, 
                   Role.FACULTY
               );
           
           return user.getRole() == Role.STUDENT && !facultyPresent;
       }
   }
   ```

3. **Create Group Chat REST APIs**
   - `GET /api/chat/groups/{departmentId}` - Get group chat messages
   - `GET /api/chat/groups/{departmentId}/participants` - Get group participants
   - `POST /api/chat/groups/{departmentId}/join` - Join group (for faculty monitoring)
   - `POST /api/chat/groups/{departmentId}/leave` - Leave group

### **Frontend Tasks**
1. **Update WebSocket Service for Groups**
   ```javascript
   subscribeToGroupChat(departmentId, callback) {
       this.subscriptions.group = this.client.subscribe(
           `/topic/department/${departmentId}`,
           (message) => {
               const data = JSON.parse(message.body);
               callback(data);
           }
       );
   }
   
   sendGroupMessage(message, departmentId, chatType) {
       this.client.publish({
           destination: '/app/chat.sendGroupMessage',
           body: JSON.stringify({
               ...message,
               departmentId,
               chatType
           })
       });
   }
   ```

2. **Create Group Chat Components**
   - `GroupChatList.jsx`:
     - List of available groups (Faculty+Student, All Students)
     - Show if user can post or read-only
   
   - `GroupChatWindow.jsx`:
     - Similar to ChatWindow but for groups
     - Show participant list
     - Display "read-only" message if applicable

3. **Update Chat Page**
   - Add tabs: "Direct Messages" and "Groups"
   - Show appropriate permissions

4. **Implement Typing Indicator (Optional)**
   ```javascript
   // Backend
   @MessageMapping("/chat.typing")
   public void userTyping(@Payload TypingDTO dto, Principal principal) {
       messagingTemplate.convertAndSendToUser(
           dto.getReceiverId().toString(),
           "/queue/typing",
           new TypingNotification(principal.getName(), true)
       );
   }
   
   // Frontend
   const handleTyping = () => {
       websocketService.sendTypingIndicator(activeChat.id, true);
       clearTimeout(typingTimeout);
       typingTimeout = setTimeout(() => {
           websocketService.sendTypingIndicator(activeChat.id, false);
       }, 3000);
   };
   ```

### **Testing Tasks**
- Test faculty posting in Faculty+Student group
- Test student read-only access in Faculty+Student group
- Test student posting in All Students group
- Test faculty joining makes student group read-only
- Test group message broadcasting
- Test typing indicators

### **Deliverables**
- ✅ Department group chats functional
- ✅ Faculty-student group with read-only for students
- ✅ All-student group with conditional posting
- ✅ Chat permissions enforced
- ✅ Typing indicators (optional)

---

## **SPRINT 6: Attendance Management (Week 11-12)**

### **Objectives**
- Implement attendance marking system
- Create attendance reports
- Build attendance analytics
- Student attendance view

### **Backend Tasks**
1. **Database Schema**
   ```sql
   -- Attendance Table
   CREATE TABLE attendance (
       id BIGINT PRIMARY KEY AUTO_INCREMENT,
       student_id BIGINT NOT NULL,
       marked_by BIGINT NOT NULL,
       date DATE NOT NULL,
       status ENUM('PRESENT', 'ABSENT', 'LATE') NOT NULL,
       subject VARCHAR(255),
       remarks TEXT,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
       FOREIGN KEY (marked_by) REFERENCES users(id),
       UNIQUE KEY unique_attendance (student_id, date, subject)
   );
   ```

2. **Create Attendance APIs**
   - `POST /api/attendance/mark` - Mark attendance (bulk)
   - `GET /api/attendance/date/{date}` - Get attendance by date
   - `GET /api/attendance/student/{studentId}` - Get student attendance history
   - `GET /api/attendance/student/{studentId}/percentage` - Get attendance percentage
   - `GET /api/attendance/report` - Generate attendance report (Excel/PDF)
   - `PUT /api/attendance/{id}` - Update attendance
   - `DELETE /api/attendance/{id}` - Delete attendance

3. **Implement Attendance Service**
   ```java
   @Service
   public class AttendanceService {
       
       public void markBulkAttendance(List<AttendanceDTO> attendanceList, Long facultyId) {
           Faculty faculty = userRepository.findById(facultyId).orElseThrow();
           
           List<Attendance> records = attendanceList.stream()
               .map(dto -> {
                   Student student = userRepository.findById(dto.getStudentId()).orElseThrow();
                   
                   // Validate same department
                   if (!student.getDepartment().equals(faculty.getDepartment())) {
                       throw new UnauthorizedException("Cannot mark attendance for other departments");
                   }
                   
                   Attendance attendance = new Attendance();
                   attendance.setStudent(student);
                   attendance.setMarkedBy(faculty);
                   attendance.setDate(dto.getDate());
                   attendance.setStatus(dto.getStatus());
                   attendance.setSubject(dto.getSubject());
                   
                   return attendance;
               })
               .collect(Collectors.toList());
           
           attendanceRepository.saveAll(records);
           
           // Send notifications to students
           notificationService.notifyAttendanceMarked(records);
       }
       
       public AttendancePercentageDTO calculatePercentage(Long studentId, LocalDate from, LocalDate to) {
           List<Attendance> records = attendanceRepository
               .findByStudentIdAndDateBetween(studentId, from, to);
           
           long totalDays = records.size();
           long presentDays = records.stream()
               .filter(a -> a.getStatus() == AttendanceStatus.PRESENT)
               .count();
           
           double percentage = totalDays > 0 ? (presentDays * 100.0 / totalDays) : 0;
           
           return new AttendancePercentageDTO(totalDays, presentDays, percentage);
       }
       
       public byte[] generateExcelReport(Long departmentId, LocalDate from, LocalDate to) {
           // Generate Excel using Apache POI
           // Include: Student Name, Roll Number, Total Days, Present Days, Percentage
       }
   }
   ```

4. **Create Attendance Notification**
   ```java
   // When attendance is marked, notify student
   public void notifyAttendanceMarked(List<Attendance> records) {
       for (Attendance record : records) {
           Notification notification = new Notification();
           notification.setUser(record.getStudent());
           notification.setTitle("Attendance Marked");
           notification.setMessage("Your attendance for " + record.getDate() + " has been marked as " + record.getStatus());
           notification.setType(NotificationType.ATTENDANCE);
           notification.setReferenceId(record.getId());
           notificationRepository.save(notification);
           
           // Send FCM
           fcmService.sendNotificationToUser(
               record.getStudent().getId(),
               "Attendance Marked",
               "Status: " + record.getStatus()
           );
       }
   }
   ```

### **Frontend Tasks**
1. **Create Attendance Components**
   - `AttendanceTable.jsx`:
     - Date picker
     - Student list with checkboxes (Present/Absent/Late)
     - Bulk select options
     - Subject input
     - Submit button
   
   - `AttendanceChart.jsx`:
     - Line chart showing attendance trends
     - Pie chart for overall percentage
     - Use recharts or Chart.js

2. **Create Faculty Attendance Pages**
   - `ManageAttendance.jsx`:
     - Mark attendance interface
     - View past attendance with edit option
     - Date range filter
   
   - `AttendanceReports.jsx`:
     - Generate reports by date range
     - Export as Excel/PDF
     - Class-wise statistics
     - Individual student reports

3. **Create Student Attendance Page**
   - `ViewAttendance.jsx`:
     - Calendar view showing present/absent days
     - Attendance percentage card
     - Date-wise attendance list
     - Filter by subject (if applicable)
     - Visual charts

4. **Create Attendance Service**
   ```javascript
   // src/services/attendanceService.js
   import axiosInstance from '../utils/axiosConfig';
   
   export const markAttendance = async (attendanceData) => {
       const response = await axiosInstance.post('/attendance/mark', attendanceData);
       return response.data;
   };
   
   export const getStudentAttendance = async (studentId, from, to) => {
       const response = await axiosInstance.get(
           `/attendance/student/${studentId}`,
           { params: { from, to } }
       );
       return response.data;
   };
   
   export const getAttendancePercentage = async (studentId) => {
       const response = await axiosInstance.get(
           `/attendance/student/${studentId}/percentage`
       );
       return response.data;
   };
   
   export const downloadReport = async (departmentId, from, to) => {
       const response = await axiosInstance.get('/attendance/report', {
           params: { departmentId, from, to },
           responseType: 'blob'
       });
       return response.data;
   };
   ```

### **Testing Tasks**
- Test bulk attendance marking
- Test attendance percentage calculation
- Test attendance update/delete
- Test student notification on attendance marking
- Test report generation
- Test date range filtering
- Test student attendance view

### **Deliverables**
- ✅ Faculty can mark attendance (bulk)
- ✅ Faculty can view/edit attendance records
- ✅ Faculty can generate attendance reports
- ✅ Students receive attendance notifications
- ✅ Students can view their attendance
- ✅ Attendance charts and analytics working

---

## **SPRINT 7: Study Material Repository (Week 13-14)**

### **Objectives**
- Implement study material upload system
- Create categorization and organization
- Build search and filter functionality
- Implement download tracking

### **Backend Tasks**
1. **Database Schema**
   ```sql
   -- Study Materials Table
   CREATE TABLE study_materials (
       id BIGINT PRIMARY KEY AUTO_INCREMENT,
       title VARCHAR(500) NOT NULL,
       description TEXT,
       department_id BIGINT NOT NULL,
       uploaded_by BIGINT NOT NULL,
       subject VARCHAR(255),
       topic VARCHAR(255),
       type ENUM('LECTURE_NOTES', 'LAB_MANUAL', 'PREVIOUS_PAPERS', 'REFERENCE_BOOK', 'OTHER') NOT NULL,
       file_url VARCHAR(500) NOT NULL,
       file_name VARCHAR(500) NOT NULL,
       file_size BIGINT,
       file_type VARCHAR(100),
       download_count INT DEFAULT 0,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       FOREIGN KEY (department_id) REFERENCES departments(id),
       FOREIGN KEY (uploaded_by) REFERENCES users(id)
   );
   
   -- Study Material Categories (Optional)
   CREATE TABLE material_categories (
       id BIGINT PRIMARY KEY AUTO_INCREMENT,
       department_id BIGINT NOT NULL,
       subject VARCHAR(255) NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (department_id) REFERENCES departments(id),
       UNIQUE KEY unique_subject (department_id, subject)
   );
   ```

2. **Create Study Material APIs**
   - `POST /api/study-materials` - Upload material (Faculty/Admin)
   - `GET /api/study-materials` - Get all materials (filtered by department)
   - `GET /api/study-materials/{id}` - Get material by ID
   - `PUT /api/study-materials/{id}` - Update material
   - `DELETE /api/study-materials/{id}` - Delete material
   - `GET /api/study-materials/{id}/download` - Download file (increment count)
   - `GET /api/study-materials/search` - Search materials
   - `GET /api/study-materials/categories` - Get categories/subjects

3. **Implement Study Material Service**
   ```java
   @Service
   public class StudyMaterialService {
       
       @Autowired
       private FileStorageService fileStorageService;
       
       public StudyMaterial uploadMaterial(StudyMaterialDTO dto, MultipartFile file, Long facultyId) {
           User faculty = userRepository.findById(facultyId).orElseThrow();
           
           // Store file
           String fileName = fileStorageService.storeFile(
               file, 
               "study-materials/" + faculty.getDepartment().getId()
           );
           
           StudyMaterial material = new StudyMaterial();
           material.setTitle(dto.getTitle());
           material.setDescription(dto.getDescription());
           material.setDepartment(faculty.getDepartment());
           material.setUploadedBy(faculty);
           material.setSubject(dto.getSubject());
           material.setTopic(dto.getTopic());
           material.setType(dto.getType());
           material.setFileUrl(fileName);
           material.setFileName(file.getOriginalFilename());
           material.setFileSize(file.getSize());
           material.setFileType(file.getContentType());
           
           StudyMaterial saved = studyMaterialRepository.save(material);
           
           // Notify department students
           notificationService.notifyNewStudyMaterial(saved);
           
           return saved;
       }
       
       public Resource downloadMaterial(Long materialId) {
           StudyMaterial material = studyMaterialRepository.findById(materialId).orElseThrow();
           
           // Increment download count
           material.setDownloadCount(material.getDownloadCount() + 1);
           studyMaterialRepository.save(material);
           
           return fileStorageService.loadFileAsResource(
               material.getFileUrl(),
               "study-materials"
           );
       }
       
       public List<StudyMaterial> searchMaterials(String query, Long departmentId, String subject, String type) {
           return studyMaterialRepository.search(query, departmentId, subject, type);
       }
   }
   ```

4. **Create Custom Repository for Search**
   ```java
   @Repository
   public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Long> {
       
       @Query("SELECT m FROM StudyMaterial m WHERE " +
              "m.department.id = :departmentId AND " +
              "(:query IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :query, '%')) " +
              "OR LOWER(m.description) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
              "(:subject IS NULL OR m.subject = :subject) AND " +
              "(:type IS NULL OR m.type = :type) " +
              "ORDER BY m.createdAt DESC")
       List<StudyMaterial> search(
           @Param("query") String query,
           @Param("departmentId") Long departmentId,
           @Param("subject") String subject,
           @Param("type") String type
       );
   }
   ```

### **Frontend Tasks**
1. **Create Study Material Components**
   - `MaterialCard.jsx`:
     - Display material info (title, subject, type)
     - Download button with count
     - Preview button (for PDFs)
     - File icon based on type
     - Uploaded by and date
   
   - `MaterialUploadForm.jsx`:
     - Title, description inputs
     - Subject, topic, type dropdowns
     - File upload (drag & drop)
     - File preview before upload
     - Progress indicator
   
   - `MaterialList.jsx`:
     - Grid/list view toggle
     - Pagination
     - Empty state

2. **Create Study Material Pages**
   - `ManageStudyMaterials.jsx` (Faculty):
     - Upload new material button
     - List of uploaded materials
     - Edit/delete buttons
     - Download statistics
   
   - `ViewStudyMaterials.jsx` (Student):
     - Browse all materials
     - Search bar
     - Filters: Subject, Type, Sort by
     - Download button
     - Preview option

3. **Implement Search and Filter**
   ```javascript
   const [filters, setFilters] = useState({
       query: '',
       subject: 'all',
       type: 'all',
       sortBy: 'newest'
   });
   
   const fetchMaterials = async () => {
       const params = {
           query: filters.query || null,
           subject: filters.subject !== 'all' ? filters.subject : null,
           type: filters.type !== 'all' ? filters.type : null
       };
       const response = await getMaterials(params);
       setMaterials(response.data);
   };
   
   useEffect(() => {
       fetchMaterials();
   }, [filters]);
   ```

4. **Create Study Material Service**
   ```javascript
   // src/services/studyMaterialService.js
   import axiosInstance from '../utils/axiosConfig';
   
   export const uploadMaterial = async (formData) => {
       const response = await axiosInstance.post('/study-materials', formData, {
           headers: { 'Content-Type': 'multipart/form-data' }
       });
       return response.data;
   };
   
   export const getMaterials = async (params) => {
       const response = await axiosInstance.get('/study-materials', { params });
       return response.data;
   };
   
   export const downloadMaterial = async (id) => {
       const response = await axiosInstance.get(`/study-materials/${id}/download`, {
           responseType: 'blob'
       });
       
       // Create download link
       const url = window.URL.createObjectURL(new Blob([response.data]));
       const link = document.createElement('a');
       link.href = url;
       link.setAttribute('download', response.headers['content-disposition'].split('filename=')[1]);
       document.body.appendChild(link);
       link.click();
       link.remove();
   };
   
   export const deleteMaterial = async
   (id) => {
       await axiosInstance.delete(`/study-materials/${id}`);
   };
   ```

### **Testing Tasks**
- Test material upload with various file types
- Test file download
- Test search functionality
- Test filter by subject and type
- Test download count increment
- Test student notification on new upload
- Test delete material

### **Deliverables**
- ✅ Faculty can upload study materials
- ✅ Students can browse and download materials
- ✅ Search and filter working
- ✅ Download tracking functional
- ✅ Categorization by subject and type
- ✅ Notifications sent on new uploads

---

## **SPRINT 8: Polish, Testing & Deployment (Week 15-16)**

### **Objectives**
- Implement dark mode
- Add profile management
- Complete admin impersonation
- Performance optimization
- Comprehensive testing
- Deployment preparation

### **Backend Tasks**
1. **Profile Management APIs**
   - `GET /api/profile` - Get user profile
   - `PUT /api/profile` - Update profile
   - `POST /api/profile/picture` - Upload profile picture
   - `DELETE /api/profile/picture` - Delete profile picture

2. **Admin Impersonation**
   ```java
   @PostMapping("/admin/impersonate/{userId}")
   @PreAuthorize("hasRole('ADMIN')")
   public ResponseEntity<?> impersonateUser(@PathVariable Long userId, Principal principal) {
       User admin = userRepository.findByEmail(principal.getName()).orElseThrow();
       User targetUser = userRepository.findById(userId).orElseThrow();
       
       // Generate token for target user but with admin context
       String token = jwtTokenProvider.generateImpersonationToken(targetUser, admin);
       
       return ResponseEntity.ok(new ImpersonationResponse(token, targetUser));
   }
   
   @PostMapping("/admin/stop-impersonation")
   @PreAuthorize("hasRole('ADMIN')")
   public ResponseEntity<?> stopImpersonation(Principal principal) {
       // Return admin's original token
       User admin = userRepository.findByEmail(principal.getName()).orElseThrow();
       String token = jwtTokenProvider.generateToken(admin);
       
       return ResponseEntity.ok(new LoginResponse(token, admin));
   }
   ```

3. **Performance Optimization**
   - Add database indexes:
     ```sql
     CREATE INDEX idx_user_email ON users(email);
     CREATE INDEX idx_user_department ON users(department_id);
     CREATE INDEX idx_announcement_dept_date ON announcements(department_id, created_at);
     CREATE INDEX idx_chat_sender_receiver ON chat_messages(sender_id, receiver_id, created_at);
     CREATE INDEX idx_attendance_student_date ON attendance(student_id, date);
     CREATE INDEX idx_study_material_dept ON study_materials(department_id, created_at);
     ```
   
   - Add pagination to all list APIs
   - Implement caching for frequently accessed data
   - Optimize N+1 queries using JOIN FETCH

4. **Error Handling & Logging**
   ```java
   @ControllerAdvice
   public class GlobalExceptionHandler {
       
       @ExceptionHandler(EntityNotFoundException.class)
       public ResponseEntity<?> handleNotFound(EntityNotFoundException ex) {
           return ResponseEntity.status(HttpStatus.NOT_FOUND)
               .body(new ErrorResponse(ex.getMessage()));
       }
       
       @ExceptionHandler(UnauthorizedException.class)
       public ResponseEntity<?> handleUnauthorized(UnauthorizedException ex) {
           return ResponseEntity.status(HttpStatus.FORBIDDEN)
               .body(new ErrorResponse(ex.getMessage()));
       }
       
       @ExceptionHandler(Exception.class)
       public ResponseEntity<?> handleGeneral(Exception ex) {
           logger.error("Unexpected error", ex);
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
               .body(new ErrorResponse("An unexpected error occurred"));
       }
   }
   ```

### **Frontend Tasks**
1. **Implement Dark Mode**
   ```javascript
   // src/context/ThemeContext.jsx
   import { createContext, useState, useEffect, useContext } from 'react';
   
   const ThemeContext = createContext();
   
   export const ThemeProvider = ({ children }) => {
       const [isDark, setIsDark] = useState(() => {
           const saved = localStorage.getItem('theme');
           return saved === 'dark';
       });
       
       useEffect(() => {
           if (isDark) {
               document.documentElement.classList.add('dark');
               localStorage.setItem('theme', 'dark');
           } else {
               document.documentElement.classList.remove('dark');
               localStorage.setItem('theme', 'light');
           }
       }, [isDark]);
       
       const toggleTheme = () => setIsDark(!isDark);
       
       return (
           <ThemeContext.Provider value={{ isDark, toggleTheme }}>
               {children}
           </ThemeContext.Provider>
       );
   };
   
   export const useTheme = () => useContext(ThemeContext);
   ```
   
   - Update Tailwind config for dark mode
   - Add dark mode classes to all components
   - Create theme toggle button

2. **Profile Management**
   - `Profile.jsx`:
     - View profile information
     - Upload/change profile picture
     - Update name (if allowed)
     - Display role, department, etc.

3. **Admin Impersonation UI**
   - Add "Impersonate" button in user management
   - Show banner when impersonating
   - "Stop Impersonation" button

4. **Loading States & Error Handling**
   - Create loading skeletons for all pages
   - Add error boundaries
   - Show user-friendly error messages
   - Implement retry logic for failed requests

5. **Responsive Design Polish**
   - Test on multiple screen sizes
   - Optimize mobile navigation
   - Ensure all forms are mobile-friendly
   - Test on different browsers

6. **Performance Optimization**
   - Code splitting with React.lazy
   - Image optimization
   - Debounce search inputs
   - Virtualize long lists
   - Minimize re-renders

### **Testing Tasks**

**Unit Testing (Backend):**
```java
@SpringBootTest
class UserServiceTest {
    @Autowired
    private UserService userService;
    
    @Test
    void testCreateUser() {
        UserDTO dto = new UserDTO();
        dto.setEmail("test@example.com");
        dto.setName("Test User");
        
        User created = userService.createUser(dto);
        
        assertNotNull(created.getId());
        assertEquals("test@example.com", created.getEmail());
    }
}
```

**Integration Testing:**
- Test all REST API endpoints
- Test WebSocket connections
- Test file uploads/downloads
- Test email sending

**Frontend Testing:**
- Test user flows (login, create announcement, send message)
- Test responsive design
- Cross-browser testing
- Accessibility testing

**Security Testing:**
- Test role-based access control
- Test JWT expiration and refresh
- Test XSS and CSRF protection
- Test file upload security

### **Deployment Preparation**
1. **Environment Configuration**
   ```properties
   # application-prod.properties
   spring.datasource.url=${DB_URL}
   spring.datasource.username=${DB_USERNAME}
   spring.datasource.password=${DB_PASSWORD}
   
   jwt.secret=${JWT_SECRET}
   
   spring.mail.host=${MAIL_HOST}
   spring.mail.port=${MAIL_PORT}
   spring.mail.username=${MAIL_USERNAME}
   spring.mail.password=${MAIL_PASSWORD}
   
   file.upload-dir=${UPLOAD_DIR}
   ```

2. **Docker Configuration (Optional)**
   ```dockerfile
   # Dockerfile (Backend)
   FROM openjdk:17-jdk-slim
   WORKDIR /app
   COPY target/campus-connect.jar app.jar
   EXPOSE 8080
   ENTRYPOINT ["java", "-jar", "app.jar"]
   
   # Dockerfile (Frontend)
   FROM node:16-alpine AS build
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=build /app/build /usr/share/nginx/html
   EXPOSE 80
   CMD ["nginx", "-g", "daemon off;"]
   ```

3. **Documentation**
   - Complete API documentation
   - User guide for each role
   - Deployment guide
   - Troubleshooting guide

### **Deliverables**
- ✅ Dark mode implemented
- ✅ Profile management complete
- ✅ Admin impersonation functional
- ✅ Performance optimized
- ✅ Comprehensive testing done
- ✅ Production-ready deployment package
- ✅ Complete documentation

---

## Installation & Setup

### **Prerequisites**
- Java JDK 17+
- Node.js 16+
- MySQL 8.0+
- Maven 3.6+
- Git

### **Backend Setup**

1. **Clone Repository**
   ```bash
   git clone https://github.com/yourusername/campus-connect.git
   cd campus-connect/backend
   ```

2. **Configure Database**
   ```bash
   mysql -u root -p
   CREATE DATABASE campus_connect;
   EXIT;
   ```

3. **Update `application.properties`**
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/campus_connect
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   
   jwt.secret=your_secret_key_here_minimum_256_bits
   jwt.access-token-expiration=900000
   jwt.refresh-token-expiration=604800000
   
   spring.mail.host=smtp.gmail.com
   spring.mail.port=587
   spring.mail.username=your_email@gmail.com
   spring.mail.password=your_app_password
   spring.mail.properties.mail.smtp.auth=true
   spring.mail.properties.mail.smtp.starttls.enable=true
   
   file.upload-dir=./uploads
   ```

4. **Build & Run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

5. **Backend runs on:** `http://localhost:8080`

### **Frontend Setup**

1. **Navigate to Frontend**
   ```bash
   cd ../frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   Create `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:8080/api
   REACT_APP_WS_URL=http://localhost:8080/ws
   
   REACT_APP_FIREBASE_API_KEY=your_api_key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   REACT_APP_FIREBASE_APP_ID=your_app_id
   REACT_APP_FIREBASE_VAPID_KEY=your_vapid_key
   ```

4. **Run Development Server**
   ```bash
   npm start
   ```

5. **Frontend runs on:** `http://localhost:3000`

### **Initial Admin Setup**

The first admin user is hardcoded in the database. Run this SQL:

```sql
INSERT INTO users (email, password, name, role, is_active, is_first_login) 
VALUES (
    'admin@campusconnect.com', 
    '$2a$10$encodedPasswordHashHere', 
    'System Admin', 
    'ADMIN', 
    true, 
    false
);
```

**Default Credentials:**
- Email: `admin@campusconnect.com`
- Password: `admin123` (Change immediately after first login)

---

## API Documentation

### **Authentication Endpoints**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/auth/login` | User login | Public |
| POST | `/api/auth/refresh` | Refresh access token | Public |
| POST | `/api/auth/logout` | User logout | Authenticated |
| POST | `/api/auth/first-time-setup` | Set password on first login | Authenticated |
| POST | `/api/auth/request-password-reset` | Request password reset | Authenticated |
| GET | `/api/auth/me` | Get current user | Authenticated |

### **User Management Endpoints**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/admin/users` | Get all users | Admin |
| POST | `/api/admin/users` | Create user | Admin |
| POST | `/api/admin/users/bulk-upload` | Bulk upload via Excel | Admin |
| PUT | `/api/admin/users/{id}` | Update user | Admin |
| DELETE | `/api/admin/users/{id}` | Delete user | Admin |

### **Announcement Endpoints**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/announcements` | Get announcements | Authenticated |
| POST | `/api/announcements` | Create announcement | Faculty, Admin |
| PUT | `/api/announcements/{id}` | Update announcement | Faculty (own), Admin |
| DELETE | `/api/announcements/{id}` | Delete announcement | Faculty (own), Admin |

### **Chat Endpoints**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/chat/conversations` | Get conversation list | Authenticated |
| GET | `/api/chat/messages/{userId}` | Get message history | Authenticated |
| GET | `/api/chat/users` | Get users to chat with | Authenticated |

### **Attendance Endpoints**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/api/attendance/mark` | Mark attendance | Faculty, Admin |
| GET | `/api/attendance/student/{id}` | Get student attendance | Faculty, Admin, Student (own) |
| GET | `/api/attendance/report` | Generate report | Faculty, Admin |

### **Study Material Endpoints**

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/api/study-materials` | Get all materials | Authenticated |
| POST | `/api/study-materials` | Upload material | Faculty, Admin |
| GET | `/api/study-materials/{id}/download` | Download material | Authenticated |
| DELETE | `/api/study-materials/{id}` | Delete material | Faculty (own), Admin |

---

## Deployment Guide

### **Local Deployment**
- Backend: `mvn spring-boot:run`
- Frontend: `npm start`

### **Production Deployment (AWS Example)**

1. **Setup RDS for MySQL**
2. **Deploy Backend on EC2/Elastic Beanstalk**
3. **Deploy Frontend on S3 + CloudFront**
4. **Configure Environment Variables**
5. **Setup SSL Certificate**

---

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## License

This project is licensed under the MIT License.

---

## Support

For issues and questions:
- **Email:** support@campusconnect.com
- **Documentation:** [docs.campusconnect.com]
- **GitHub Issues:** [github.com/yourrepo/issues]

---

## Acknowledgments

- React JS Team
- Spring Boot Team
- Firebase Team
- All open-source contributors

---

**Project Status:** ✅ Complete

**Last Updated:** December 2025

---

This README provides a complete sprint-by-sprint development guide for Campus Connect. Each sprint is designed to be completed in 1-2 weeks, with clear objectives, tasks, and deliverables. Follow the sprints sequentially for best results! 🚀
