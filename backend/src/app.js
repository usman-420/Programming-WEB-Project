const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const workoutPlanRoutes = require('./routes/workoutPlanRoutes');
const exerciseRoutes = require('./routes/exerciseRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const userRoutes = require('./routes/userRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

// Import middleware
const { notFound, errorHandler } = require('./middleware/errorHandler');
const apiLogger = require('./middleware/apiLogger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Request Logger
app.use(apiLogger);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/workout-plans', workoutPlanRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/memberships', membershipRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Gym API is running' });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

module.exports = app;
