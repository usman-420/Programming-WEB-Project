const { verifyToken } = require('../utils/jwt');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(403).json({ error: 'Invalid or expired token.' });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Token verification failed.' });
  }
};

module.exports = { authenticateToken };
