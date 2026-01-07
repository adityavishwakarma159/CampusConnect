-- Performance Optimization Indexes (MySQL Compatible)

-- User indexes
CREATE INDEX idx_user_email ON `users`(`email`);
CREATE INDEX idx_user_department ON `users`(`department_id`);
CREATE INDEX idx_user_role ON `users`(`role`);

-- Announcement indexes
CREATE INDEX idx_announcement_dept_date 
ON `announcements`(`department_id`, `created_at`);
CREATE INDEX idx_announcement_created 
ON `announcements`(`created_at`);

-- Chat indexes
CREATE INDEX idx_chat_sender_receiver 
ON `chat_messages`(`sender_id`, `receiver_id`, `created_at`);
CREATE INDEX idx_chat_created 
ON `chat_messages`(`created_at`);
CREATE INDEX idx_chat_participant_user 
ON `chat_participants`(`user_id`);
CREATE INDEX idx_chat_participant_dept 
ON `chat_participants`(`department_id`);

-- Attendance indexes
CREATE INDEX idx_attendance_student_date 
ON `attendance`(`student_id`, `date`);
CREATE INDEX idx_attendance_date 
ON `attendance`(`date`);
CREATE INDEX idx_attendance_marked_by 
ON `attendance`(`marked_by`);

-- Study Material indexes
CREATE INDEX idx_study_material_dept 
ON `study_materials`(`department_id`, `created_at`);
CREATE INDEX idx_study_material_subject 
ON `study_materials`(`subject`);
CREATE INDEX idx_study_material_type 
ON `study_materials`(`type`);

-- Notification indexes
CREATE INDEX idx_notification_user 
ON `notifications`(`user_id`, `created_at`);
CREATE INDEX idx_notification_read 
ON `notifications`(`user_id`, `is_read`);
