import { Router } from 'express';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { sequelize } from '../models/index.js';

const router = Router();
router.get(
  '/',
  asyncHandler(async (req, res) => {
    let database = 'disconnected';
    try {
      await sequelize.authenticate();
      database = 'connected';
    } catch (_) {
      database = 'disconnected';
    }
    return sendSuccess(res, {
      message: 'OK',
      data: { service: 'baby-site-backend', status: 'ok', database, timestamp: new Date().toISOString() },
    });
  })
);
export default router;
