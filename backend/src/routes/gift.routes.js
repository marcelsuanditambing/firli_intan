import { Router } from 'express';
import { getGifts } from '../controllers/gift.controller.js';
const router = Router();
router.get('/', getGifts);
export default router;
