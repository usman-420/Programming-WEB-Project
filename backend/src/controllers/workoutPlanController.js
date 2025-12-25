const WorkoutPlan = require('../models/WorkoutPlan');
const Exercise = require('../models/Exercise');

// Get all workout plans
exports.getAllWorkoutPlans = async (req, res) => {
  try {
    const plans = await WorkoutPlan.findAll();
    res.json(plans);
  } catch (error) {
    console.error('Get workout plans error:', error);
    res.status(500).json({ error: 'Failed to fetch workout plans' });
  }
};

// Get workout plan by ID
exports.getWorkoutPlanById = async (req, res) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);
    
    if (!plan) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }
    
    res.json(plan);
  } catch (error) {
    console.error('Get workout plan error:', error);
    res.status(500).json({ error: 'Failed to fetch workout plan' });
  }
};

// Get workout plans by trainer
exports.getTrainerWorkoutPlans = async (req, res) => {
  try {
    const trainerId = req.params.trainerId || req.user.userId;
    const plans = await WorkoutPlan.findByTrainer(trainerId);
    res.json(plans);
  } catch (error) {
    console.error('Get trainer workout plans error:', error);
    res.status(500).json({ error: 'Failed to fetch trainer workout plans' });
  }
};

// Create workout plan
exports.createWorkoutPlan = async (req, res) => {
  try {
    const { planName, description, exercises, durationWeeks } = req.body;
    const trainerId = req.user.userId;
    
    // Create workout plan
    const planId = await WorkoutPlan.create({
      name: planName,
      description,
      trainerId,
      durationWeeks
    });
    
    // Add exercises if provided
    if (exercises && Array.isArray(exercises)) {
      for (const exercise of exercises) {
        await Exercise.create({
          name: exercise.exerciseName,
          sets: exercise.sets,
          reps: exercise.reps,
          restTime: exercise.restTime,
          notes: exercise.muscleGroup,
          workoutId: planId
        });
      }
    }
    
    // Get created plan with exercises
    const plan = await WorkoutPlan.findById(planId);
    
    res.status(201).json({
      message: 'Workout plan created successfully',
      plan
    });
  } catch (error) {
    console.error('Create workout plan error:', error);
    res.status(500).json({ error: 'Failed to create workout plan' });
  }
};

// Update workout plan
exports.updateWorkoutPlan = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const updated = await WorkoutPlan.update(req.params.id, {
      name,
      description
    });
    
    if (!updated) {
      return res.status(404).json({ error: 'Workout plan not found or no changes made' });
    }
    
    const plan = await WorkoutPlan.findById(req.params.id);
    res.json({
      message: 'Workout plan updated successfully',
      plan
    });
  } catch (error) {
    console.error('Update workout plan error:', error);
    res.status(500).json({ error: 'Failed to update workout plan' });
  }
};

// Delete workout plan
exports.deleteWorkoutPlan = async (req, res) => {
  try {
    const deleted = await WorkoutPlan.delete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ error: 'Workout plan not found' });
    }
    
    res.json({ message: 'Workout plan deleted successfully' });
  } catch (error) {
    console.error('Delete workout plan error:', error);
    res.status(500).json({ error: 'Failed to delete workout plan' });
  }
};
