const { body } = require('express-validator');

const createWorkoutPlanValidation = [
  body('planName')
    .trim()
    .isLength({ min: 3 })
    .withMessage('Workout plan name must be at least 3 characters long'),
  body('description')
    .optional()
    .trim(),
  body('durationWeeks')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Duration must be at least 1 week'),
  body('trainerId')
    .optional()
    .isInt()
    .withMessage('Invalid trainer ID')
];

const createExerciseValidation = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Exercise name must be at least 2 characters long'),
  body('sets')
    .isInt({ min: 1 })
    .withMessage('Sets must be at least 1'),
  body('reps')
    .isInt({ min: 1 })
    .withMessage('Reps must be at least 1'),
  body('restTime')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Rest time must be a positive number'),
  body('workoutId')
    .isInt()
    .withMessage('Invalid workout plan ID')
];

const createSessionValidation = [
  body('memberId')
    .isInt()
    .withMessage('Invalid member ID'),
  body('workoutPlansId')
    .isInt()
    .withMessage('Invalid workout plan ID'),
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date')
];

module.exports = {
  validateCreateWorkoutPlan: createWorkoutPlanValidation,
  validateCreateExercise: createExerciseValidation,
  validateCreateSession: createSessionValidation
};
