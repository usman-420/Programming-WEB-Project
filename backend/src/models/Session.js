const { pool } = require('../config/database');

class Session {
  // Get all sessions with filters
  static async findAll(filters = {}) {
    try {
      let query = `
        SELECT s.*, 
               m.name as memberName, m.email as memberEmail, m.phone as memberPhone,
               t.name as trainerName, t.email as trainerEmail,
               wp.name as workoutPlanName,
               (SELECT COUNT(*) FROM exercises WHERE workoutId = s.workoutPlansId) as totalExercises,
               CASE 
                 WHEN s.completedExercises IS NOT NULL AND s.completedExercises != '' 
                 THEN ROUND((LENGTH(s.completedExercises) - LENGTH(REPLACE(s.completedExercises, ',', '')) + 1) * 100.0 / 
                      (SELECT COUNT(*) FROM exercises WHERE workoutId = s.workoutPlansId), 0)
                 ELSE 0
               END as completionRate
        FROM sessions s
        JOIN users m ON s.memberId = m.id
        LEFT JOIN users t ON s.trainerId = t.id
        LEFT JOIN workoutPlans wp ON s.workoutPlansId = wp.id
        WHERE 1=1
      `;
      
      const values = [];
      
      if (filters.memberId) {
        query += ' AND s.memberId = ?';
        values.push(filters.memberId);
      }
      
      if (filters.trainerId) {
        query += ' AND s.trainerId = ?';
        values.push(filters.trainerId);
      }
      
      if (filters.status) {
        query += ' AND s.status = ?';
        values.push(filters.status);
      }
      
      if (filters.dateFrom) {
        query += ' AND s.date >= ?';
        values.push(filters.dateFrom);
      }
      
      if (filters.dateTo) {
        query += ' AND s.date <= ?';
        values.push(filters.dateTo);
      }
      
      query += ' ORDER BY s.date DESC, s.startTime DESC';
      
      const [sessions] = await pool.query(query, values);
      return sessions;
    } catch (error) {
      throw error;
    }
  }
  
  // Find session by ID
  static async findById(id) {
    try {
      const [sessions] = await pool.query(`
        SELECT s.*, 
               m.name as memberName, m.email as memberEmail, m.phone as memberPhone,
               t.name as trainerName, t.email as trainerEmail,
               wp.name as workoutPlanName, wp.description as workoutDescription
        FROM sessions s
        JOIN users m ON s.memberId = m.id
        LEFT JOIN users t ON s.trainerId = t.id
        LEFT JOIN workoutPlans wp ON s.workoutPlansId = wp.id
        WHERE s.id = ?
      `, [id]);
      
      if (sessions.length === 0) return null;
      
      // Get exercises for the workout plan
      if (sessions[0].workoutPlansId) {
        const [exercises] = await pool.query(
          'SELECT * FROM exercises WHERE workoutId = ?',
          [sessions[0].workoutPlansId]
        );
        sessions[0].exercises = exercises;
      }
      
      return sessions[0];
    } catch (error) {
      throw error;
    }
  }
  
  // Get missed sessions (for n8n automation)
  static async findMissed() {
    try {
      const [sessions] = await pool.query(`
        SELECT s.*, 
               m.name as memberName, m.email as memberEmail, m.phone as memberPhone,
               t.name as trainerName, t.email as trainerEmail,
               wp.name as workoutPlanName
        FROM sessions s
        JOIN users m ON s.memberId = m.id
        JOIN users t ON s.trainerId = t.id
        JOIN workoutPlans wp ON s.workoutPlansId = wp.id
        WHERE s.status = 'scheduled' 
        AND s.date < CURDATE()
      `);
      return sessions;
    } catch (error) {
      throw error;
    }
  }
  
  // Create new session
  static async create(sessionData) {
    try {
      const { trainerId, memberId, date, startTime, endTime, workoutPlansId } = sessionData;
      const [result] = await pool.query(
        'INSERT INTO sessions (trainerId, memberId, date, startTime, endTime, workoutPlansId) VALUES (?, ?, ?, ?, ?, ?)',
        [trainerId || null, memberId, date, startTime || null, endTime || null, workoutPlansId || null]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
  
  // Update session
  static async update(id, sessionData) {
    try {
      const fields = [];
      const values = [];
      
      if (sessionData.status) {
        fields.push('status = ?');
        values.push(sessionData.status);
      }
      if (sessionData.startTime) {
        fields.push('startTime = ?');
        values.push(sessionData.startTime);
      }
      if (sessionData.endTime) {
        fields.push('endTime = ?');
        values.push(sessionData.endTime);
      }
      if (sessionData.completedExercises !== undefined) {
        fields.push('completedExercises = ?');
        values.push(sessionData.completedExercises);
      }
      
      if (fields.length === 0) return false;
      
      values.push(id);
      const query = `UPDATE sessions SET ${fields.join(', ')} WHERE id = ?`;
      const [result] = await pool.query(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  
  // Delete session
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM sessions WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  
  // Get member workout stats
  static async getMemberStats(memberId) {
    try {
      const [stats] = await pool.query(`
        SELECT 
          COUNT(*) as totalSessions,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completedSessions,
          SUM(CASE WHEN status = 'missed' THEN 1 ELSE 0 END) as missedSessions,
          SUM(CASE WHEN status = 'scheduled' THEN 1 ELSE 0 END) as scheduledSessions
        FROM sessions
        WHERE memberId = ?
      `, [memberId]);
      return stats[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Session;
