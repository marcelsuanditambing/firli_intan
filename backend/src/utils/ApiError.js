// Application error carrying an HTTP status code and optional field errors.
export default class ApiError extends Error {
  constructor(statusCode, message, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors; // array of { field, message } for validation
    this.isOperational = true;
    this.name = 'ApiError';
    Error.captureStackTrace(this, this.constructor);
  }
}
