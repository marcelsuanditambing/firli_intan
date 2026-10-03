import { Router } from 'express';
import { getBaby } from '../controllers/baby.controller.js';
const router = Router();
router.get('/', getBaby);
export default router;
