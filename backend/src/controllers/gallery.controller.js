import { Gallery } from '../models/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { getPagination, buildMeta, buildWhere, buildOrder } from '../utils/pagination.js';

// GET /api/gallery?page=&limit=&is_featured=&sort=&order=
export const getGallery = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = {
    baby_id: req.baby.id,
    is_published: true,
    ...buildWhere(req.query, { is_featured: 'is_featured' }),
  };
  const order = buildOrder(req.query, ['sort_order', 'created_at'], [['sort_order', 'ASC'], ['id', 'ASC']]);

  const { count, rows } = await Gallery.findAndCountAll({ where, order, limit, offset });
  return sendSuccess(res, {
    message: 'Gallery retrieved',
    data: rows,
    meta: buildMeta(count, page, limit),
  });
});
