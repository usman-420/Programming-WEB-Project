const Exercise = require('../models/Exercise');

// Get all exercises
exports.getAllExercises = async (req, res) => {
  try {
    const exercises = await Exercise.findAll();
    res.json(exercises);
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({ error: 'Failed to fetch exercises' });
  }
};

// Get exercise by ID
exports.getExerciseById = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    
    res.json(exercise);
  } catch (error) {
    console.error('Get exercise error:', error);
    res.status(500).json({ error: 'Failed to fetch exercise' });
  }
};

// Get exercises by workout plan ID
exports.getExercisesByWorkout = async (req, res) => {
  try {
    const exercises = await Exercise.findByWorkoutId(req.params.workoutId);
    res.json(exercises);
  } catch (error) {
    console.error('Get workout exercises error:', error);
    res.status(500).json({ error: 'Failed to fetch workout exercises' });
  }
};

// Create exercise
exports.createExercise = async (req, res) => {
  try {
    const { workoutId, exerciseName, sets, reps, duration, restTime, instructions, videoUrl, muscleGroup } = req.body;
    
    const exerciseId = await Exercise.create({
      workoutId,
      exerciseName,
      sets,
      reps,
      duration,
      restTime,
      instructions,
      videoUrl,
      muscleGroup
    });
    
    const exercise = await Exercise.findById(exerciseId);
    
    res.status(201).json({
      message: 'Exercise created successfully',
      exercise
    });
  } catch (error) {
    console.error('Create exercise error:', error);
    res.status(500).json({ error: 'Failed to create exercise' });
  }
};

// Update exercise
exports.updateExercise = async (req, res) => {
  try {
    const { exerciseName, sets, reps, duration, restTime, instructions, videoUrl, muscleGroup } = req.body;
    
    const updated = await Exercise.update(req.params.id, {
      exerciseName,
      sets,
      reps,
      duration,
      restTime,
      instructions,
      videoUrl,
      muscleGroup
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'Exercise not found or no changes made' });
    }
    
    const exercise = await Exercise.findById(req.params.id);
    
    res.json({
      message: 'Exercise updated successfully',
      exercise
    });
  } catch (error) {
    console.error('Update exercise error:', error);
    res.status(500).json({ error: 'Failed to update exercise' });
  }
};

// Delete exercise
exports.deleteExercise = async (req, res) => {
  try {
    const deleted = await Exercise.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Exercise not found' });
    }
    
    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error('Delete exercise error:', error);
    res.status(500).json({ error: 'Failed to delete exercise' });
  }
};
