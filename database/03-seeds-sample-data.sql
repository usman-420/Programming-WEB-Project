-- Gym Management System - Sample Data with Test Users
-- Creates admin, trainers, members, workouts, sessions for testing
-- Use this for development and N8N workflow testing

-- Insert roles (if not already exists)
INSERT IGNORE INTO roles (name, description) VALUES
('admin', 'System administrator with full access'),
('trainer', 'Gym trainer who manages workouts and sessions'),
('member', 'Gym member who attends sessions');

-- Insert users: 1 admin, 2 trainers, 3 members
-- All passwords: password123
INSERT INTO users (name, email, password, phone, roleId, isActive) VALUES
-- Admin
('Admin User', 'admin@gym.com', '$2a$10$4Z6zngO/0Nd7LLZfieDagu.En8VkLvpz8DA2YmZVDNnqEm6n5c7em', '1234567890', 1, 1),
-- Trainers
('John Trainer', 'john.trainer@gym.com', '$2a$10$4Z6zngO/0Nd7LLZfieDagu.En8VkLvpz8DA2YmZVDNnqEm6n5c7em', '5551234567', 2, 1),
('Sarah Trainer', 'sarah.trainer@gym.com', '$2a$10$4Z6zngO/0Nd7LLZfieDagu.En8VkLvpz8DA2YmZVDNnqEm6n5c7em', '5559876543', 2, 1),
-- Members
('Mike Wilson', 'mike.member@gym.com', '$2a$10$4Z6zngO/0Nd7LLZfieDagu.En8VkLvpz8DA2YmZVDNnqEm6n5c7em', '5551111111', 3, 1),
('Emily Davis', 'emily.member@gym.com', '$2a$10$4Z6zngO/0Nd7LLZfieDagu.En8VkLvpz8DA2YmZVDNnqEm6n5c7em', '5552222222', 3, 1),
('David Brown', 'david.member@gym.com', '$2a$10$4Z6zngO/0Nd7LLZfieDagu.En8VkLvpz8DA2YmZVDNnqEm6n5c7em', '5553333333', 3, 1);

-- Insert memberships for members
INSERT INTO memberships (userId, name, startDate, endDate, status, price) VALUES
(4, 'Premium Monthly', '2024-11-01', '2025-12-31', 'active', 99.99),
(5, 'Basic Monthly', '2024-12-01', '2025-11-30', 'active', 49.99),
(6, 'VIP Annual', '2024-01-01', '2024-12-31', 'active', 999.99);

-- Insert workout plans
INSERT INTO workoutPlans (name, description, durationWeeks, duration, difficulty, trainerId) VALUES
('Beginner Full Body', 'Complete full body workout for beginners', 8, 60, 'beginner', 2),
('Advanced Strength', 'High intensity strength training', 12, 90, 'advanced', 2),
('Cardio Blast', 'Cardio focused workout routine', 6, 45, 'intermediate', 3);

-- Insert exercises for workout plans
INSERT INTO exercises (workoutId, name, sets, reps, duration, restTime, notes, description) VALUES
-- Beginner Full Body (workout 1)
(1, 'Push-ups', 3, 10, NULL, 60, 'Keep back straight', 'Basic push-ups for chest and triceps'),
(1, 'Bodyweight Squats', 3, 15, NULL, 60, 'Knees behind toes', 'Basic squat for legs'),
(1, 'Plank', 3, NULL, 30, 45, 'Hold position', 'Core strengthening exercise'),
-- Advanced Strength (workout 2)
(2, 'Barbell Bench Press', 4, 8, NULL, 120, 'Heavy weight', 'Compound chest exercise'),
(2, 'Deadlifts', 4, 6, NULL, 180, 'Perfect form required', 'Full body strength exercise'),
(2, 'Pull-ups', 4, 10, NULL, 90, 'Full range', 'Back and bicep exercise'),
-- Cardio Blast (workout 3)
(3, 'Jump Rope', 5, NULL, 120, 30, 'High intensity', 'Cardio warmup'),
(3, 'Burpees', 4, 15, NULL, 45, 'Full body', 'High intensity cardio'),
(3, 'Mountain Climbers', 4, 20, NULL, 30, 'Fast pace', 'Core and cardio');

-- Insert sessions (mix of scheduled, completed, and PAST dates for N8N testing)
INSERT INTO sessions (trainerId, memberId, workoutPlansId, date, startTime, endTime, status) VALUES
-- Completed sessions
(2, 4, 1, '2024-12-01', '09:00:00', '10:00:00', 'completed'),
(2, 5, 1, '2024-12-03', '10:00:00', '11:00:00', 'completed'),
(3, 6, 3, '2024-12-05', '14:00:00', '15:00:00', 'completed'),
-- MISSED sessions (PAST dates with 'scheduled' status - for N8N workflow testing)
(2, 4, 1, '2024-12-08', '09:00:00', '10:00:00', 'scheduled'),
(2, 5, 1, '2024-12-09', '10:00:00', '11:00:00', 'scheduled'),
(3, 6, 3, '2024-12-10', '14:00:00', '15:00:00', 'scheduled'),
-- Future scheduled sessions
(2, 4, 2, '2025-12-20', '09:00:00', '10:30:00', 'scheduled'),
(3, 5, 3, '2025-12-22', '11:00:00', '12:00:00', 'scheduled');

-- Insert reviews
INSERT INTO reviews (clientId, trainerId, workoutPlans, rating, comment) VALUES
(4, 2, 1, 5, 'Excellent trainer! Very helpful and motivating.'),
(5, 2, 1, 4, 'Great workout plan, saw results quickly.'),
(6, 3, 3, 5, 'Love the cardio sessions, very energetic!');
