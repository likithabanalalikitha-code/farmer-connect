const app = require('./app');
const config = require('./config/env');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

const startServer = async () => {
  // Connect to Database
  await connectDB();

  const server = app.listen(config.port, () => {
    logger.info(`🚀 Farmer Market Connect Server running in ${config.nodeEnv} mode on port ${config.port}`);
    logger.info(`🌾 API Root: http://localhost:${config.port}/api`);
    logger.info(`🤖 Groq Model: ${config.groqModel} (${config.groqApiKey ? 'Live Groq API Enabled' : 'Simulated Agricultural Fallback Active'})`);
  });

  // Graceful shutdown handling
  const shutdown = () => {
    logger.info('Shutting down server gracefully...');
    server.close(() => {
      logger.info('HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Promise Rejection:', err.message);
    if (config.nodeEnv === 'production') {
      server.close(() => process.exit(1));
    }
  });
};

startServer();
