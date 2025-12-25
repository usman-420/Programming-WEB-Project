const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { sendWelcomeEmail } = require('../utils/email');

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, dateOfBirth, phone, roleId } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const userId = await User.create({
      name,
      email,
      password: hashedPassword,
      dateOfBirth,
      phone,
      roleId: roleId || 3 // Default to member role
    });
    
    // Get created user
    const user = await User.findById(userId);
    
    // Send welcome email (don't wait for it)
    sendWelcomeEmail(user.email, user.name, user.roleName).catch(err => 
      console.error('Welcome email failed:', err)
    );
    
    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      roleName: user.roleName
    });
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.roleName,
        dateOfBirth: user.dateOfBirth,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({ error: 'Account is inactive' });
    }
    
    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      roleName: user.roleName
    });
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.roleName,
        dateOfBirth: user.dateOfBirth,
        phone: user.phone,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};

// Get current user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.roleName,
      dateOfBirth: user.dateOfBirth,
      phone: user.phone,
      profilePic: user.profilePic,
      isActive: user.isActive,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
};

// Update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, dateOfBirth, profilePic } = req.body;
    
    const updated = await User.update(req.user.userId, {
      name,
      phone,
      dateOfBirth,
      profilePic
    });
    
    if (!updated) {
      return res.status(400).json({ error: 'No changes made' });
    }
    
    const user = await User.findById(req.user.userId);
    
    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.roleName,
        dateOfBirth: user.dateOfBirth,
        phone: user.phone,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Get user
    const user = await User.findById(req.user.userId);
    
    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await User.update(req.user.userId, { password: hashedPassword });
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Failed to change password' });
  }
};
