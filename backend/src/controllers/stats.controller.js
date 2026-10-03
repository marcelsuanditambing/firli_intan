import { Visitor, Wish } from '../models/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';

// GET /api/stats  -> aggregate counters for the active baby
export const getStats = asyncHandler(async (req, res) => {
  const babyId = req.baby.id;

  const [visits, uniqueVisitors, wishesApproved, wishesTotal] = await Promise.all([
    Visitor.count({ where: { baby_id: babyId } }),
    Visitor.count({ where: { baby_id: babyId }, distinct: true, col: 'session_id' }),
    Wish.count({ where: { baby_id: babyId, status: 'approved' } }),
    Wish.count({ where: { baby_id: babyId } }),
  ]);

  return sendSuccess(res, {
    message: 'Stats retrieved',
    data: {
      visits,
      unique_visitors: uniqueVisitors,
      wishes_approved: wishesApproved,
      wishes_total: wishesTotal,
    },
  });
});
