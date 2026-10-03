import { Music } from '../models/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { getPagination, buildMeta, buildWhere, buildOrder } from '../utils/pagination.js';

// GET /api/music?is_active=&page=&limit=
export const getMusic = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query, { defaultLimit: 20 });
  // Default to active tracks unless caller explicitly filters otherwise.
  const activeFilter = req.query.is_active === undefined ? { is_active: true } : buildWhere(req.query, { is_active: 'is_active' });
  const where = { baby_id: req.baby.id, ...activeFilter };
  const order = buildOrder(req.query, ['sort_order', 'title'], [['sort_order', 'ASC']]);

  const { count, rows } = await Music.findAndCountAll({ where, order, limit, offset });
  return sendSuccess(res, {
    message: 'Music tracks retrieved',
    data: rows,
    meta: buildMeta(count, page, limit),
  });
});
