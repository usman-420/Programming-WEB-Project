const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const { validateCreateSession } = require('../validators/workoutValidator');
const { validate } = require('../middleware/validation');

// Public route for n8n
router.get('/missed', sessionController.getMissedSessions);

// Protected routes
router.use(authenticateToken);

router.get('/', sessionController.getAllSessions);
router.get('/stats/:memberId?', sessionController.getMemberStats);
router.get('/:id', sessionController.getSessionById);

// Trainer and admin can create sessions
router.post('/', 
  checkRole('trainer', 'admin'), 
  validateCreateSession, 
  validate, 
  sessionController.createSession
);

// Member can complete their own sessions
router.put('/:id/complete', sessionController.completeSession);

// Trainer and admin can update sessions
router.put('/:id', checkRole('trainer', 'admin'), sessionController.updateSession);

// Trainer and admin can delete sessions
router.delete('/:id', checkRole('trainer', 'admin'), sessionController.deleteSession);

module.exports = router;
