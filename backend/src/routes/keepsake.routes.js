import { Router } from 'express';
import { getStatus, unlock, downloadBook } from '../controllers/keepsake.controller.js';
import { unlockRules } from '../validations/keepsake.validation.js';
import validate from '../middlewares/validate.js';

// Buku Kenangan (PDF) — khusus orang tua, dibuka dengan PIN (KEEPSAKE_PIN di .env).
const router = Router();

router.get('/status', getStatus);
router.post('/unlock', unlockRules, validate, unlock);
router.get('/book.pdf', downloadBook);

export default router;
