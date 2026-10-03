import { Router } from 'express';
import { getMusic } from '../controllers/music.controller.js';
const router = Router();
router.get('/', getMusic);
export default router;
