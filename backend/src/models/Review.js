const { pool } = require('../config/database');

class Review {
  // Get all reviews
  static async findAll() {
    try {
      const [reviews] = await pool.query(`
        SELECT r.*, 
               c.name as clientName,
               t.name as trainerName,
               wp.name as workoutPlanName
        FROM reviews r
        LEFT JOIN users c ON r.clientId = c.id
        LEFT JOIN users t ON r.trainerId = t.id
        LEFT JOIN workoutPlans wp ON r.workoutPlans = wp.id
        ORDER BY r.createdAt DESC
      `);
      return reviews;
    } catch (error) {
      throw error;
    }
  }
  
  // Find review by ID
  static async findById(id) {
    try {
      const [reviews] = await pool.query(`
        SELECT r.*, 
               c.name as clientName,
               t.name as trainerName,
               wp.name as workoutPlanName
        FROM reviews r
        LEFT JOIN users c ON r.clientId = c.id
        LEFT JOIN users t ON r.trainerId = t.id
        LEFT JOIN workoutPlans wp ON r.workoutPlans = wp.id
        WHERE r.id = ?
      `, [id]);
      return reviews[0];
    } catch (error) {
      throw error;
    }
  }
  
  // Get reviews for a trainer
  static async findByTrainer(trainerId) {
    try {
      const [reviews] = await pool.query(`
        SELECT r.*, 
               c.name as clientName,
               wp.name as workoutPlanName
        FROM reviews r
        LEFT JOIN users c ON r.clientId = c.id
        LEFT JOIN workoutPlans wp ON r.workoutPlans = wp.id
        WHERE r.trainerId = ?
        ORDER BY r.createdAt DESC
      `, [trainerId]);
      return reviews;
    } catch (error) {
      throw error;
    }
  }

  // Get average rating for a trainer
  static async getAverageRating(trainerId) {
    try {
      const [result] = await pool.query(`
        SELECT AVG(rating) as averageRating, COUNT(*) as totalReviews
        FROM reviews
        WHERE trainerId = ?
      `, [trainerId]);
      return result[0];
    } catch (error) {
      throw error;
    }
  }
  
  // Create new review
  static async create(reviewData) {
    try {
      const { clientId, trainerId, workoutPlans, rating, comment } = reviewData;
      const [result] = await pool.query(
        'INSERT INTO reviews (clientId, trainerId, workoutPlans, rating, comment) VALUES (?, ?, ?, ?, ?)',
        [clientId || null, trainerId || null, workoutPlans || null, rating, comment || null]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
  
  // Update review
  static async update(id, reviewData) {
    try {
      const fields = [];
      const values = [];
      
      if (reviewData.rating) {
        fields.push('rating = ?');
        values.push(reviewData.rating);
      }
      if (reviewData.comment !== undefined) {
        fields.push('comment = ?');
        values.push(reviewData.comment);
      }
      
      if (fields.length === 0) return false;
      
      values.push(id);
      const query = `UPDATE reviews SET ${fields.join(', ')} WHERE id = ?`;
      const [result] = await pool.query(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  
  // Delete review
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM reviews WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Review;
