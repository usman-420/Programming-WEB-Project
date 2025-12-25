require('dotenv').config();
const app = require('./src/app');
const { testConnection } = require('./src/config/database');
const logger = require('./src/utils/logger');

const PORT = process.env.PORT || 3000;

// Test database connection
testConnection();

// Start server
const server = app.listen(PORT, () => {
  logger.log(`Server is running on port ${PORT}`);
  logger.log(`API: http://localhost:${PORT}/api`);
  logger.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  logger.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.log('HTTP server closed');
    process.exit(0);
  });
});
