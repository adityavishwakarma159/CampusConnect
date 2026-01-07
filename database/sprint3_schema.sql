-- Sprint 3: Announcements & Notifications Schema

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
    FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_department (department_id),
    INDEX idx_created_at (created_at DESC)
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
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_created_at (created_at DESC)
);

-- Optional: Add FCM token to users table (for future use)
ALTER TABLE users ADD COLUMN fcm_token VARCHAR(500);
