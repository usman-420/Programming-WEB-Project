const Session = require('../models/Session');
const { sendMissedWorkoutEmail } = require('../utils/email');

// Get all sessions with filters
exports.getAllSessions = async (req, res) => {
  try {
    const filters = {};
    
    // If member role, only show their sessions
    if (req.user.roleName === 'member') {
      filters.memberId = req.user.userId;
    }
    
    // If trainer role, only show their sessions
    if (req.user.roleName === 'trainer') {
      filters.trainerId = req.user.userId;
    }
    
    // Apply query filters
    if (req.query.status) filters.status = req.query.status;
    if (req.query.memberId && req.user.roleName !== 'member') filters.memberId = req.query.memberId;
    if (req.query.trainerId && req.user.roleName === 'admin') filters.trainerId = req.query.trainerId;
    if (req.query.dateFrom) filters.dateFrom = req.query.dateFrom;
    if (req.query.dateTo) filters.dateTo = req.query.dateTo;
    
    const sessions = await Session.findAll(filters);
    res.json(sessions);
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
};

// Get session by ID
exports.getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Check authorization
    if (req.user.roleName === 'member' && session.memberId !== req.user.userId) {
      return res.status(403).json({ error: 'Access forbidden' });
    }
    
    if (req.user.roleName === 'trainer' && session.trainerId !== req.user.userId) {
      return res.status(403).json({ error: 'Access forbidden' });
    }
    
    res.json(session);
  } catch (error) {
    console.error('Get session error:', error);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
};

// Get missed sessions (for n8n)
exports.getMissedSessions = async (req, res) => {
  try {
    const missedSessions = await Session.findMissed();
    res.json(missedSessions);
  } catch (error) {
    console.error('Get missed sessions error:', error);
    res.status(500).json({ error: 'Failed to fetch missed sessions' });
  }
};

// Create session (assign workout to member)
exports.createSession = async (req, res) => {
  try {
    const { memberId, workoutPlansId, date, startTime, endTime } = req.body;
    const trainerId = req.user.userId;
    
    const sessionId = await Session.create({
      trainerId,
      memberId,
      date,
      startTime,
      endTime,
      workoutPlansId
    });
    
    const session = await Session.findById(sessionId);
    
    res.status(201).json({
      message: 'Session created successfully',
      session
    });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
};

// Update session
exports.updateSession = async (req, res) => {
  try {
    const { status, startTime, endTime, completedExercises } = req.body;
    
    const updated = await Session.update(req.params.id, {
      status,
      startTime,
      endTime,
      completedExercises
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'Session not found or no changes made' });
    }
    
    const session = await Session.findById(req.params.id);
    
    res.json({
      message: 'Session updated successfully',
      session
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({ error: 'Failed to update session' });
  }
};

// Mark session as completed
exports.completeSession = async (req, res) => {
  try {
    const { completedExercises } = req.body;
    
    const updated = await Session.update(req.params.id, {
      status: 'completed',
      completedExercises: JSON.stringify(completedExercises || [])
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const session = await Session.findById(req.params.id);
    
    res.json({
      message: 'Session marked as completed',
      session
    });
  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({ error: 'Failed to complete session' });
  }
};

// Delete session
exports.deleteSession = async (req, res) => {
  try {
    const deleted = await Session.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Delete session error:', error);
    res.status(500).json({ error: 'Failed to delete session' });
  }
};

// Get member stats
exports.getMemberStats = async (req, res) => {
  try {
    const memberId = req.params.memberId || req.user.userId;
    const stats = await Session.getMemberStats(memberId);
    res.json(stats);
  } catch (error) {
    console.error('Get member stats error:', error);
    res.status(500).json({ error: 'Failed to fetch member stats' });
  }
};
