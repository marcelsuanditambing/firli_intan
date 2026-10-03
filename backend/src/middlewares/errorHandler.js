import config from '../config/index.js';
import logger from '../utils/logger.js';
import ApiError from '../utils/ApiError.js';

// Centralised error handler. Normalises ApiError, Sequelize errors, and the rest.
// eslint-disable-next-line no-unused-vars
export default function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || undefined;

  // Sequelize validation / unique-constraint errors -> 422
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 422;
    message = 'Validation error';
    errors = err.errors?.map((e) => ({ field: e.path, message: e.message }));
  } else if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 409;
    message = 'Related resource constraint failed';
  } else if (err.name === 'SequelizeDatabaseError') {
    statusCode = 500;
    message = config.env === 'production' ? 'Database error' : err.message;
  }

  if (statusCode >= 500) logger.error(`${statusCode} ${req.method} ${req.originalUrl} - ${err.stack || err.message}`);
  else logger.warn(`${statusCode} ${req.method} ${req.originalUrl} - ${message}`);

  const body = { success: false, message };
  if (errors) body.errors = errors;
  if (config.env !== 'production' && statusCode >= 500) body.stack = err.stack;

  res.status(statusCode).json(body);
}
