const express = require('express');
const router = express.Router();
const exerciseController = require('../controllers/exerciseController');
const { authenticateToken } = require('../middleware/auth');
const { checkRole } = require('../middleware/roleCheck');
const { validateCreateExercise } = require('../validators/workoutValidator');
const { validate } = require('../middleware/validation');

router.use(authenticateToken);

router.get('/', exerciseController.getAllExercises);
router.get('/:id', exerciseController.getExerciseById);
router.get('/workout/:workoutId', exerciseController.getExercisesByWorkout);

// Only trainers and admins can create/update/delete exercises
router.post('/', 
  checkRole('trainer', 'admin'), 
  validateCreateExercise, 
  validate, 
  exerciseController.createExercise
);

router.put('/:id', checkRole('trainer', 'admin'), exerciseController.updateExercise);
router.delete('/:id', checkRole('trainer', 'admin'), exerciseController.deleteExercise);

module.exports = router;
