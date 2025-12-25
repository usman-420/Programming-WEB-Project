const Membership = require('../models/Membership');

// Get all memberships
exports.getAllMemberships = async (req, res) => {
  try {
    const memberships = await Membership.findAll();
    res.json(memberships);
  } catch (error) {
    console.error('Get memberships error:', error);
    res.status(500).json({ error: 'Failed to fetch memberships' });
  }
};

// Get membership by ID
exports.getMembershipById = async (req, res) => {
  try {
    const membership = await Membership.findById(req.params.id);
    
    if (!membership) {
      return res.status(404).json({ error: 'Membership not found' });
    }
    
    res.json(membership);
  } catch (error) {
    console.error('Get membership error:', error);
    res.status(500).json({ error: 'Failed to fetch membership' });
  }
};

// Get memberships by user ID
exports.getUserMemberships = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.userId;
    const memberships = await Membership.findByUserId(userId);
    res.json(memberships);
  } catch (error) {
    console.error('Get user memberships error:', error);
    res.status(500).json({ error: 'Failed to fetch user memberships' });
  }
};

// Get active membership for user
exports.getActiveMembership = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.userId;
    const membership = await Membership.getActiveMembership(userId);
    
    if (!membership) {
      return res.status(404).json({ error: 'No active membership found' });
    }
    
    res.json(membership);
  } catch (error) {
    console.error('Get active membership error:', error);
    res.status(500).json({ error: 'Failed to fetch active membership' });
  }
};

// Create membership
exports.createMembership = async (req, res) => {
  try {
    const { userId, name, startDate, endDate, price, status } = req.body;
    
    const membershipId = await Membership.create({
      userId,
      name,
      startDate,
      endDate,
      price,
      status: status || 'active'
    });
    
    const membership = await Membership.findById(membershipId);
    
    res.status(201).json({
      message: 'Membership created successfully',
      membership
    });
  } catch (error) {
    console.error('Create membership error:', error);
    res.status(500).json({ error: 'Failed to create membership' });
  }
};

// Update membership
exports.updateMembership = async (req, res) => {
  try {
    const { membershipType, startDate, endDate, fee, status } = req.body;
    
    const updated = await Membership.update(req.params.id, {
      membershipType,
      startDate,
      endDate,
      fee,
      status
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'Membership not found or no changes made' });
    }
    
    const membership = await Membership.findById(req.params.id);
    
    res.json({
      message: 'Membership updated successfully',
      membership
    });
  } catch (error) {
    console.error('Update membership error:', error);
    res.status(500).json({ error: 'Failed to update membership' });
  }
};

// Delete membership
exports.deleteMembership = async (req, res) => {
  try {
    const deleted = await Membership.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Membership not found' });
    }
    
    res.json({ message: 'Membership deleted successfully' });
  } catch (error) {
    console.error('Delete membership error:', error);
    res.status(500).json({ error: 'Failed to delete membership' });
  }
};

// Get revenue stats
exports.getRevenueStats = async (req, res) => {
  try {
    const stats = await Membership.getStats();
    res.json(stats);
  } catch (error) {
    console.error('Get revenue stats error:', error);
    res.status(500).json({ error: 'Failed to fetch revenue stats' });
  }
};
