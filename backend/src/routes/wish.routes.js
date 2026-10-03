import { Router } from 'express';
import { getWishes, createWish } from '../controllers/wish.controller.js';
import { createWishRules } from '../validations/wish.validation.js';
import validate from '../middlewares/validate.js';
import attachBaby from '../middlewares/attachBaby.js';

const router = Router();

// GET resolves baby first, then lists.
router.get('/', attachBaby, getWishes);

// POST validates BEFORE the DB lookup, then resolves baby, then creates.
router.post('/', createWishRules, validate, attachBaby, createWish);

export default router;
