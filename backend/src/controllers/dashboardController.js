const User = require('../models/User');
const Session = require('../models/Session');
const Membership = require('../models/Membership');
const Review = require('../models/Review');

// Get member dashboard stats
exports.getMemberDashboard = async (req, res) => {
  try {
    const memberId = req.user.userId;
    
    // Get session stats
    const sessionStats = await Session.getMemberStats(memberId);
    
    // Get active membership
    const membership = await Membership.getActiveMembership(memberId);
    
    // Get member details
    const memberDetails = await User.findById(memberId);
    
    res.json({
      member: memberDetails,
      membership,
      sessions: sessionStats
    });
  } catch (error) {
    console.error('Get member dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch member dashboard' });
  }
};

// Get trainer dashboard stats
exports.getTrainerDashboard = async (req, res) => {
  try {
    const trainerId = req.user.userId;
    
    // Get sessions assigned to this trainer
    const sessions = await Session.findAll({ trainerId });
    
    // Calculate stats
    const totalSessions = sessions.length;
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const missedSessions = sessions.filter(s => s.status === 'missed').length;
    const scheduledSessions = sessions.filter(s => s.status === 'scheduled').length;
    
    // Get unique members count
    const uniqueMembers = [...new Set(sessions.map(s => s.memberId))].length;
    
    // Get trainer reviews
    const reviews = await Review.findByTrainer(trainerId);
    const rating = await Review.getAverageRating(trainerId);
    
    res.json({
      totalSessions,
      completedSessions,
      missedSessions,
      scheduledSessions,
      activeMembers: uniqueMembers,
      reviews: reviews.length,
      rating: rating.averageRating || 0
    });
  } catch (error) {
    console.error('Get trainer dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch trainer dashboard' });
  }
};

// Get admin dashboard stats
exports.getAdminDashboard = async (req, res) => {
  try {
    // Get user stats
    const userStats = await User.getStats();
    
    // Get membership stats
    const revenueStats = await Membership.getStats();
    
    // Get all sessions
    const allSessions = await Session.findAll({});
    
    // Calculate session stats
    const totalSessions = allSessions.length;
    const completedSessions = allSessions.filter(s => s.status === 'completed').length;
    const missedSessions = allSessions.filter(s => s.status === 'missed').length;
    const scheduledSessions = allSessions.filter(s => s.status === 'scheduled').length;
    
    const completionRate = totalSessions > 0 
      ? ((completedSessions / totalSessions) * 100).toFixed(2)
      : 0;
    
    res.json({
      users: userStats,
      revenue: revenueStats,
      sessions: {
        total: totalSessions,
        completed: completedSessions,
        missed: missedSessions,
        scheduled: scheduledSessions,
        completionRate: parseFloat(completionRate)
      }
    });
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch admin dashboard' });
  }
};
