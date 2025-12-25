const { pool } = require('../config/database');

class Exercise {
  // Get all exercises for a workout plan
  static async findByWorkoutId(workoutId) {
    try {
      const [exercises] = await pool.query(
        'SELECT * FROM exercises WHERE workoutId = ? ORDER BY id',
        [workoutId]
      );
      return exercises;
    } catch (error) {
      throw error;
    }
  }
  
  // Find exercise by ID
  static async findById(id) {
    try {
      const [exercises] = await pool.query('SELECT * FROM exercises WHERE id = ?', [id]);
      return exercises[0];
    } catch (error) {
      throw error;
    }
  }
  
  // Create new exercise
  static async create(exerciseData) {
    try {
      const { name, sets, reps, restTime, notes, workoutId } = exerciseData;
      const [result] = await pool.query(
        'INSERT INTO exercises (name, sets, reps, restTime, notes, workoutId) VALUES (?, ?, ?, ?, ?, ?)',
        [name, sets, reps, restTime || 60, notes || null, workoutId]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
  
  // Update exercise
  static async update(id, exerciseData) {
    try {
      const fields = [];
      const values = [];
      
      if (exerciseData.name) {
        fields.push('name = ?');
        values.push(exerciseData.name);
      }
      if (exerciseData.sets) {
        fields.push('sets = ?');
        values.push(exerciseData.sets);
      }
      if (exerciseData.reps) {
        fields.push('reps = ?');
        values.push(exerciseData.reps);
      }
      if (exerciseData.restTime !== undefined) {
        fields.push('restTime = ?');
        values.push(exerciseData.restTime);
      }
      if (exerciseData.notes !== undefined) {
        fields.push('notes = ?');
        values.push(exerciseData.notes);
      }
      
      if (fields.length === 0) return false;
      
      values.push(id);
      const query = `UPDATE exercises SET ${fields.join(', ')} WHERE id = ?`;
      const [result] = await pool.query(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  
  // Delete exercise
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM exercises WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Exercise;
