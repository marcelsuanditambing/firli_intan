import { body } from 'express-validator';

export const unlockRules = [
  body('pin')
    .isString().withMessage('pin is required')
    .bail()
    .trim()
    .notEmpty().withMessage('pin is required')
    .isLength({ max: 64 }).withMessage('pin is too long'),
];
