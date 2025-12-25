const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const roleFilter = req.query.role;
    const users = await User.findAll(roleFilter);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get user by ID (admin only)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

// Create user (admin only)
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, phone, dateOfBirth, roleId, isActive } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const userId = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      dateOfBirth,
      roleId: roleId || 3, // Default to member
      isActive: isActive !== undefined ? isActive : true
    });
    
    const user = await User.findById(userId);
    
    res.status(201).json({
      message: 'User created successfully',
      user
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Update user (admin only)
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, dateOfBirth, roleId, isActive, profilePic } = req.body;
    
    const updateData = {
      name,
      email,
      phone,
      dateOfBirth,
      roleId,
      isActive,
      profilePic
    };
    
    const updated = await User.update(req.params.id, updateData);
    
    if (!updated) {
      return res.status(404).json({ error: 'User not found or no changes made' });
    }
    
    const user = await User.findById(req.params.id);
    
    res.json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const deleted = await User.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

// Get user stats (admin only)
exports.getUserStats = async (req, res) => {
  try {
    const stats = await User.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Failed to fetch user stats' });
  }
};
