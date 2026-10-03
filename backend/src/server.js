import 'dotenv/config';
import app from './app.js';
import config from './config/index.js';
import logger from './utils/logger.js';
import db, { sequelize } from './models/index.js';

async function start() {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established');

    // Optional: align tables in development only (SQL migrations own prod schema).
    if (config.db.sync && config.env === 'development') {
      await sequelize.sync({ alter: true });
      logger.warn('Sequelize sync({ alter: true }) ran (development only)');
    }
  } catch (err) {
    logger.error(`Unable to connect to the database: ${err.message}`);
    // Keep serving so /api/health can report status; do not hard-exit.
  }

  const server = app.listen(config.port, () => {
    logger.info(`Backend listening on port ${config.port} (${config.env})`);
  });

  const shutdown = async (signal) => {
    logger.warn(`${signal} received, shutting down...`);
    server.close(async () => {
      await db.sequelize.close().catch(() => {});
      logger.info('HTTP server and DB pool closed');
      process.exit(0);
    });
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

start();
