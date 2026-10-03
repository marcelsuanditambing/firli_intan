import { Timeline } from '../models/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { getPagination, buildMeta, buildWhere, buildOrder } from '../utils/pagination.js';

// GET /api/timeline?page=&limit=&week_number=&sort=&order=
export const getTimeline = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query, { defaultLimit: 50 });
  const where = {
    baby_id: req.baby.id,
    ...buildWhere(req.query, { week_number: 'week_number' }),
  };
  const order = buildOrder(
    req.query,
    ['sort_order', 'week_number', 'event_date'],
    [['sort_order', 'ASC'], ['week_number', 'ASC']]
  );

  const { count, rows } = await Timeline.findAndCountAll({ where, order, limit, offset });
  return sendSuccess(res, {
    message: 'Timeline retrieved',
    data: rows,
    meta: buildMeta(count, page, limit),
  });
});
