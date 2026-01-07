-- Sprint 7: Study Material Repository Schema

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
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    INDEX idx_department (department_id),
    INDEX idx_subject (subject),
    INDEX idx_type (type)
);
