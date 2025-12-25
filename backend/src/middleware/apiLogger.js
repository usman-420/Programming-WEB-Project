const logger = require('../utils/logger');

/**
 * API Request Logger Middleware
 * Logs: Method - URL - Status Code - Response Time
 */
const apiLogger = (req, res, next) => {
  const startTime = Date.now();
  
  // Store original end function
  const originalEnd = res.end;
  
  // Override end function to log after response
  res.end = function(...args) {
    const duration = Date.now() - startTime;
    const logMessage = `${req.method} - ${req.originalUrl} - ${res.statusCode} - ${duration}ms`;
    
    // Color code based on status
    if (res.statusCode >= 500) {
      logger.log(logMessage, 'error');
    } else if (res.statusCode >= 400) {
      logger.log(logMessage, 'warning');
    } else {
      logger.log(logMessage, 'success');
    }
    
    // Call original end function
    originalEnd.apply(res, args);
  };
  
  next();
};

module.exports = apiLogger;
