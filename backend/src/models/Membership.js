const { pool } = require('../config/database');

class Membership {
  // Get all memberships
  static async findAll() {
    try {
      const [memberships] = await pool.query(`
        SELECT m.*, u.name as userName, u.email as userEmail
        FROM memberships m
        JOIN users u ON m.userId = u.id
        ORDER BY m.created_at DESC
      `);
      return memberships;
    } catch (error) {
      throw error;
    }
  }
  
  // Find membership by ID
  static async findById(id) {
    try {
      const [memberships] = await pool.query(`
        SELECT m.*, u.name as userName, u.email as userEmail
        FROM memberships m
        JOIN users u ON m.userId = u.id
        WHERE m.id = ?
      `, [id]);
      return memberships[0];
    } catch (error) {
      throw error;
    }
  }
  
  // Get membership by user ID
  static async findByUserId(userId) {
    try {
      const [memberships] = await pool.query(
        'SELECT * FROM memberships WHERE userId = ? ORDER BY created_at DESC',
        [userId]
      );
      return memberships;
    } catch (error) {
      throw error;
    }
  }
  
  // Get active membership for user
  static async getActiveMembership(userId) {
    try {
      const [memberships] = await pool.query(
        'SELECT * FROM memberships WHERE userId = ? AND status = "active" ORDER BY endDate DESC LIMIT 1',
        [userId]
      );
      return memberships[0];
    } catch (error) {
      throw error;
    }
  }
  
  // Create new membership
  static async create(membershipData) {
    try {
      const { name, startDate, endDate, price, userId, status } = membershipData;
      const [result] = await pool.query(
        'INSERT INTO memberships (name, startDate, endDate, status, price, userId) VALUES (?, ?, ?, ?, ?, ?)',
        [name, startDate, endDate, status || 'active', price, userId]
      );
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }
  
  // Update membership
  static async update(id, membershipData) {
    try {
      const fields = [];
      const values = [];
      
      if (membershipData.name) {
        fields.push('name = ?');
        values.push(membershipData.name);
      }
      if (membershipData.startDate) {
        fields.push('startDate = ?');
        values.push(membershipData.startDate);
      }
      if (membershipData.endDate) {
        fields.push('endDate = ?');
        values.push(membershipData.endDate);
      }
      if (membershipData.status) {
        fields.push('status = ?');
        values.push(membershipData.status);
      }
      if (membershipData.price !== undefined) {
        fields.push('price = ?');
        values.push(membershipData.price);
      }
      
      if (fields.length === 0) return false;
      
      values.push(id);
      const query = `UPDATE memberships SET ${fields.join(', ')} WHERE id = ?`;
      const [result] = await pool.query(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  
  // Delete membership
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM memberships WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }
  
  // Get membership stats
  static async getStats() {
    try {
      const [stats] = await pool.query(`
        SELECT 
          COUNT(*) as totalMemberships,
          SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as activeMemberships,
          SUM(CASE WHEN status = 'expired' THEN 1 ELSE 0 END) as expiredMemberships,
          SUM(CASE WHEN status = 'active' THEN price ELSE 0 END) as totalRevenue
        FROM memberships
      `);
      return stats[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Membership;
