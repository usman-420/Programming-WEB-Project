const express = require('express');
const router = express.Router();
const workoutPlanController = require('../controllers/workoutPlanController');
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const { validateCreateWorkoutPlan } = require('../validators/workoutValidator');
const { validate } = require('../middleware/validation');

router.use(authenticateToken);

router.get('/', workoutPlanController.getAllWorkoutPlans);
router.get('/:id', workoutPlanController.getWorkoutPlanById);
router.get('/trainer/:trainerId', workoutPlanController.getTrainerWorkoutPlans);

// Only trainers and admins can create/update/delete workout plans
router.post('/', 
  checkRole('trainer', 'admin'), 
  validateCreateWorkoutPlan, 
  validate, 
  workoutPlanController.createWorkoutPlan
);

router.put('/:id', checkRole('trainer', 'admin'), workoutPlanController.updateWorkoutPlan);
router.delete('/:id', checkRole('trainer', 'admin'), workoutPlanController.deleteWorkoutPlan);

module.exports = router;
