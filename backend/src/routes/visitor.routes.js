import { Router } from 'express';
import { logVisit } from '../controllers/visitor.controller.js';
import { createVisitorRules } from '../validations/visitor.validation.js';
import validate from '../middlewares/validate.js';
import attachBaby from '../middlewares/attachBaby.js';

const router = Router();

// Validate first, then resolve baby, then record.
router.post('/', createVisitorRules, validate, attachBaby, logVisit);

export default router;
