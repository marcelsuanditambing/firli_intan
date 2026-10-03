import { validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

// Runs after a chain of express-validator rules; aggregates any errors.
export default function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();
  const errors = result.array().map((e) => ({ field: e.path, message: e.msg }));
  return next(new ApiError(422, 'Validation failed', errors));
}
