-- Gym Management System - Minimal Seed Data
-- Only creates roles and admin user
-- Use this for production or clean testing environment

-- Insert roles
INSERT INTO roles (name, description) VALUES
('admin', 'System administrator with full access'),
('trainer', 'Gym trainer who manages workouts and sessions'),
('member', 'Gym member who attends sessions');

-- Insert admin user only
-- Email: admin@gym.com
-- Password: password123
INSERT INTO users (name, email, password, phone, roleId, isActive) VALUES
('Admin User', 'admin@gym.com', '$2a$10$4Z6zngO/0Nd7LLZfieDagu.En8VkLvpz8DA2YmZVDNnqEm6n5c7em', '1234567890', 1, 1);
