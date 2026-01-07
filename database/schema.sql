-- Campus Connect Database Schema
-- Sprint 1: Authentication and User Management

-- Create database if not exists
CREATE DATABASE IF NOT EXISTS campus_connect;
USE campus_connect;

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) UNIQUE NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
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
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_department (department_id)
);

-- Refresh Tokens Table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    token VARCHAR(500) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    expiry_date TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_token (token),
    INDEX idx_user_id (user_id)
);

-- Password Reset Requests Table
CREATE TABLE IF NOT EXISTS password_reset_requests (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by BIGINT,
    approved_at TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

-- Insert default departments
INSERT INTO departments (name, code) VALUES
('Computer Science', 'CS'),
('Information Technology', 'IT'),
('Electronics and Communication', 'EC'),
('Mechanical Engineering', 'ME'),
('Civil Engineering', 'CE')
ON DUPLICATE KEY UPDATE name=name;
