const { pool } = require('../config/database');

class User {
  // Get all users
  static async findAll(roleFilter = null) {
    try {
      let query = `
        SELECT u.id, u.name, u.email, u.dateOfBirth, u.phone, u.profilePic, 
               u.isActive, u.createdAt, u.updatedAt, r.name as roleName,
               COUNT(CASE WHEN s.status = 'scheduled' THEN 1 END) as activeSessions
        FROM users u
        JOIN roles r ON u.roleId = r.id
        LEFT JOIN sessions s ON s.memberId = u.id
        GROUP BY u.id, u.name, u.email, u.dateOfBirth, u.phone, u.profilePic, 
                 u.isActive, u.createdAt, u.updatedAt, r.name
      `;
      
      if (roleFilter) {
        query = `
          SELECT u.id, u.name, u.email, u.dateOfBirth, u.phone, u.profilePic, 
                 u.isActive, u.createdAt, u.updatedAt, r.name as roleName,
                 COUNT(CASE WHEN s.status = 'scheduled' THEN 1 END) as activeSessions
          FROM users u
          JOIN roles r ON u.roleId = r.id
          LEFT JOIN sessions s ON s.memberId = u.id
          WHERE r.name = ?
          GROUP BY u.id, u.name, u.email, u.dateOfBirth, u.phone, u.profilePic, 
                   u.isActive, u.createdAt, u.updatedAt, r.name
        `;
        const [users] = await pool.query(query, [roleFilter]);
        return users;
      }
      
      const [users] = await pool.query(query);
      return users;
    } catch (error) {
      throw error;
    }
  }
  
  // Find user by ID
  static async findById(id) {
    try {
      const [users] = await pool.query(
        `SELECT u.id, u.name, u.email, u.dateOfBirth, u.phone, u.profilePic, 
                u.isActive, u.createdAt, u.updatedAt, u.roleId, r.name as roleName
         FROM users u
         JOIN roles r ON u.roleId = r.id
         WHERE u.id = ?`,
        [id]
      );
      return users[0];
    } catch (error) {
      throw error;
    }
  }
  
  // Find user by email
  static async findByEmail(email) {
    try {
      const [users] = await pool.query(
        `SELECT u.*, r.name as roleName 
         FROM users u
         JOIN roles r ON u.roleId = r.id
         WHERE u.email = ?`,
        [email]
      );
      return users[0];
    } catch (error) {
      throw error;
    }
  }
  
  // Create new user
  static async create(userData) {
    try {
      const { name, email, password, dateOfBirth, phone, roleId } = userData;
      const [result] = await pool.query(
        'INSERT INTO users (name, email, password, dateOfBirth, phone, roleId) VALUES (?, ?, ?, ?, ?, ?)',
        [name, email, password, dateOfBirth || null, phone || null, roleId || 3]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
  
  // Update user
  static async update(id, userData) {
    try {
      const fields = [];
      const values = [];
      
      if (userData.name) {
        fields.push('name = ?');
        values.push(userData.name);
      }
      if (userData.email) {
        fields.push('email = ?');
        values.push(userData.email);
      }
      if (userData.phone !== undefined) {
        fields.push('phone = ?');
        values.push(userData.phone);
      }
      if (userData.dateOfBirth) {
        fields.push('dateOfBirth = ?');
        values.push(userData.dateOfBirth);
      }
      if (userData.profilePic) {
        fields.push('profilePic = ?');
        values.push(userData.profilePic);
      }
      if (userData.roleId) {
        fields.push('roleId = ?');
        values.push(userData.roleId);
      }
      if (userData.isActive !== undefined) {
        fields.push('isActive = ?');
        values.push(userData.isActive);
      }
      
      if (fields.length === 0) {
        return false;
      }
      
      values.push(id);
      const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
      const [result] = await pool.query(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  
  // Delete user
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  
  // Get user stats
  static async getStats() {
    try {
      const [stats] = await pool.query(`
        SELECT 
          COUNT(*) as totalUsers,
          SUM(CASE WHEN r.name = 'member' THEN 1 ELSE 0 END) as totalMembers,
          SUM(CASE WHEN r.name = 'trainer' THEN 1 ELSE 0 END) as totalTrainers,
          SUM(CASE WHEN u.isActive = 1 THEN 1 ELSE 0 END) as activeUsers
        FROM users u
        JOIN roles r ON u.roleId = r.id
      `);
      return stats[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
