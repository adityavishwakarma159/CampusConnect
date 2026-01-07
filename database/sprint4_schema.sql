-- Sprint 4: Real-Time Chat System - Part 1 Schema

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
    FOREIGN KEY (department_id) REFERENCES departments(id),
    INDEX idx_sender_receiver (sender_id, receiver_id),
    INDEX idx_receiver_sender (receiver_id, sender_id),
    INDEX idx_created_at (created_at DESC)
);

-- Chat Participants Table (for tracking conversations)
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
    UNIQUE KEY unique_conversation (user_id, other_user_id, chat_type, department_id),
    INDEX idx_user_updated (user_id, updated_at DESC)
);
