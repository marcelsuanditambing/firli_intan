import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { resolveBaby } from '../services/baby.service.js';

// GET /api/baby  -> the baby profile incl. parents
export const getBaby = asyncHandler(async (req, res) => {
  const baby = await resolveBaby(req.query, { withParents: true });
  return sendSuccess(res, { message: 'Baby profile retrieved', data: baby });
});
