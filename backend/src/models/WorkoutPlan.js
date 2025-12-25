const { pool } = require('../config/database');

class WorkoutPlan {
  // Get all workout plans
  static async findAll() {
    try {
      const [plans] = await pool.query(`
        SELECT wp.id, wp.name, wp.description, wp.durationWeeks, wp.trainerId, wp.createdAt, wp.updatedAt,
               u.name as trainerName,
               COUNT(e.id) as exerciseCount
        FROM workoutPlans wp
        JOIN users u ON wp.trainerId = u.id
        LEFT JOIN exercises e ON e.workoutId = wp.id
        GROUP BY wp.id, wp.name, wp.description, wp.durationWeeks, wp.trainerId, wp.createdAt, wp.updatedAt, u.name
        ORDER BY wp.createdAt DESC
      `);
      return plans;
    } catch (error) {
      throw error;
    }
  }
  
  // Find workout plan by ID with exercises
  static async findById(id) {
    try {
      const [plans] = await pool.query(`
        SELECT wp.*, u.name as trainerName, u.email as trainerEmail
        FROM workoutPlans wp
        JOIN users u ON wp.trainerId = u.id
        WHERE wp.id = ?
      `, [id]);
      
      if (plans.length === 0) return null;
      
      const [exercises] = await pool.query(
        'SELECT * FROM exercises WHERE workoutId = ? ORDER BY id',
        [id]
      );
      
      return {
        ...plans[0],
        exercises
      };
    } catch (error) {
      throw error;
    }
  }
  
  // Get workout plans by trainer ID
  static async findByTrainer(trainerId) {
    try {
      const [plans] = await pool.query(
        'SELECT * FROM workoutPlans WHERE trainerId = ? ORDER BY createdAt DESC',
        [trainerId]
      );
      return plans;
    } catch (error) {
      throw error;
    }
  }
  
  // Create new workout plan
  static async create(planData) {
    try {
      const { name, description, trainerId, durationWeeks } = planData;
      const [result] = await pool.query(
        'INSERT INTO workoutPlans (name, description, durationWeeks, trainerId) VALUES (?, ?, ?, ?)',
        [name, description || null, durationWeeks || 4, trainerId]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
  
  // Update workout plan
  static async update(id, planData) {
    try {
      const fields = [];
      const values = [];
      
      if (planData.name) {
        fields.push('name = ?');
        values.push(planData.name);
      }
      if (planData.description !== undefined) {
        fields.push('description = ?');
        values.push(planData.description);
      }
      
      if (fields.length === 0) return false;
      
      values.push(id);
      const query = `UPDATE workoutPlans SET ${fields.join(', ')} WHERE id = ?`;
      const [result] = await pool.query(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  
  // Delete workout plan
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM workoutPlans WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = WorkoutPlan;
