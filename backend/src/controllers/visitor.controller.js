import { Visitor } from '../models/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { hashIp } from '../utils/hash.js';

// POST /api/visitor  -> record a page visit (for statistics)
export const logVisit = asyncHandler(async (req, res) => {
  const { session_id, page_path, referrer } = req.body;

  await Visitor.create({
    babyId: req.baby.id,
    sessionId: session_id ?? null,
    ipHash: hashIp(req.ip),
    userAgent: (req.get('user-agent') || '').slice(0, 255) || null,
    referrer: referrer ?? (req.get('referer') || null),
    pagePath: page_path ?? null,
  });

  return sendSuccess(res, { statusCode: 201, message: 'Visit recorded' });
});
