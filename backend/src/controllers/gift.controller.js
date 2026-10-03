import { Gift } from '../models/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { getPagination, buildMeta, buildWhere, buildOrder } from '../utils/pagination.js';

// GET /api/gift?type=&is_active=&page=&limit=
export const getGifts = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query, { defaultLimit: 20 });
  const activeFilter = req.query.is_active === undefined ? { is_active: true } : buildWhere(req.query, { is_active: 'is_active' });
  const where = {
    baby_id: req.baby.id,
    ...activeFilter,
    ...buildWhere(req.query, { type: 'type' }),
  };
  const order = buildOrder(req.query, ['sort_order', 'type'], [['sort_order', 'ASC']]);

  const { count, rows } = await Gift.findAndCountAll({ where, order, limit, offset });
  return sendSuccess(res, {
    message: 'Gifts retrieved',
    data: rows,
    meta: buildMeta(count, page, limit),
  });
});
