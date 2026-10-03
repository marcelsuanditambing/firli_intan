import { Op } from 'sequelize';
import { Wish } from '../models/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { getPagination, buildMeta } from '../utils/pagination.js';
import { hashIp } from '../utils/hash.js';
import config from '../config/index.js';

// GET /api/wishes?page=&limit=&q=
// Public endpoint: only approved wishes are returned.
export const getWishes = asyncHandler(async (req, res) => {
  const { page, limit, offset } = getPagination(req.query);
  const where = { baby_id: req.baby.id, status: 'approved' };

  if (req.query.q) {
    const term = `%${req.query.q}%`;
    where[Op.or] = [{ guest_name: { [Op.like]: term } }, { message: { [Op.like]: term } }];
  }

  const { count, rows } = await Wish.findAndCountAll({
    where,
    order: [['created_at', 'DESC']],
    limit,
    offset,
  });
  return sendSuccess(res, {
    message: 'Wishes retrieved',
    data: rows,
    meta: buildMeta(count, page, limit),
  });
});

// POST /api/wishes  -> create a wish.
// WISH_AUTO_APPROVE=true (default): langsung tampil. false: menunggu moderasi.
export const createWish = asyncHandler(async (req, res) => {
  const { guest_name, guest_relation, message } = req.body;

  const created = await Wish.create({
    babyId: req.baby.id,
    guestName: guest_name,
    guestRelation: guest_relation ?? null,
    message,
    status: config.app.wishAutoApprove ? 'approved' : 'pending',
    ipHash: hashIp(req.ip),
  });

  // Re-read through the default scope so ipHash is not returned.
  const wish = await Wish.findByPk(created.id);
  return sendSuccess(res, {
    statusCode: 201,
    message: config.app.wishAutoApprove
      ? 'Terima kasih! Ucapan Anda sudah tampil di halaman.'
      : 'Terima kasih! Ucapan Anda terkirim dan akan tampil setelah disetujui.',
    data: wish,
  });
});
