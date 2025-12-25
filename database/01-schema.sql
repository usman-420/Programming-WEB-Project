-- Gym Management System - Database Schema
-- Clean schema without sample data
-- Run this file first to create database structure

-- Drop existing tables if they exist
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS exercises;
DROP TABLE IF EXISTS workoutPlans;
DROP TABLE IF EXISTS memberships;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS roles;

-- Table: roles
CREATE TABLE roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255)
);

-- Table: users
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  dateOfBirth DATE,
  phone VARCHAR(20),
  profilePic VARCHAR(255),
  roleId INT,
  isActive TINYINT(1) DEFAULT 1,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (roleId) REFERENCES roles(id)
);

-- Table: memberships
CREATE TABLE memberships (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  name VARCHAR(100),
  startDate DATE NOT NULL,
  endDate DATE NOT NULL,
  status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
  price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Table: workoutPlans
CREATE TABLE workoutPlans (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  durationWeeks INT,
  duration INT,
  difficulty ENUM('beginner', 'intermediate', 'advanced'),
  trainerId INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (trainerId) REFERENCES users(id)
);

-- Table: exercises
CREATE TABLE exercises (
  id INT PRIMARY KEY AUTO_INCREMENT,
  workoutId INT,
  name VARCHAR(100) NOT NULL,
  sets INT,
  reps INT,
  duration INT,
  restTime INT,
  notes TEXT,
  description TEXT,
  FOREIGN KEY (workoutId) REFERENCES workoutPlans(id) ON DELETE CASCADE
);

-- Table: sessions
CREATE TABLE sessions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  trainerId INT,
  memberId INT NOT NULL,
  workoutPlansId INT,
  date DATE NOT NULL,
  startTime TIME,
  endTime TIME,
  status ENUM('scheduled', 'completed', 'cancelled', 'missed') DEFAULT 'scheduled',
  completedExercises TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (trainerId) REFERENCES users(id),
  FOREIGN KEY (memberId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (workoutPlansId) REFERENCES workoutPlans(id)
);

-- Table: reviews
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  clientId INT,
  trainerId INT,
  workoutPlans INT,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (clientId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (trainerId) REFERENCES users(id),
  FOREIGN KEY (workoutPlans) REFERENCES workoutPlans(id) ON DELETE CASCADE
);
