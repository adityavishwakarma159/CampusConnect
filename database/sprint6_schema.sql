-- Sprint 6: Attendance Management Schema

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
    UNIQUE KEY unique_attendance (student_id, date, subject),
    INDEX idx_student_date (student_id, date),
    INDEX idx_date (date)
);
