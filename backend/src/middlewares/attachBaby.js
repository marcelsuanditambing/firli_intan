import asyncHandler from '../utils/asyncHandler.js';
import { resolveBaby } from '../services/baby.service.js';

// Resolves the active baby once and attaches it to req.baby for downstream handlers.
const attachBaby = asyncHandler(async (req, res, next) => {
  req.baby = await resolveBaby(req.query);
  next();
});

export default attachBaby;
