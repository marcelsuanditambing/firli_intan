import { Sequelize } from 'sequelize';
import config from './index.js';
import logger from '../utils/logger.js';

const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, {
  host: config.db.host,
  port: config.db.port,
  dialect: config.db.dialect,
  // Pipe Sequelize SQL logging through our logger only in development.
  logging: config.env === 'development' ? (msg) => logger.debug(msg) : false,
  define: {
    underscored: true,
    freezeTableName: true,
  },
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sequelize;
