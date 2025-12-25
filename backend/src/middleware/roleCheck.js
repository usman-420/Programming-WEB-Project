// Check if user has required role(s)
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roleName) {
      return res.status(403).json({ error: 'Access forbidden. Role not found.' });
    }
    
    const hasRole = allowedRoles.includes(req.user.roleName);
    
    if (!hasRole) {
      return res.status(403).json({ 
        error: `Access forbidden. Required role: ${allowedRoles.join(' or ')}` 
      });
    }
    
    next();
  };
};

module.exports = { checkRole };
