import { body } from 'express-validator';

export const createWishRules = [
  body('guest_name')
    .trim()
    .notEmpty().withMessage('guest_name is required')
    .isLength({ max: 100 }).withMessage('guest_name must be at most 100 characters'),
  body('message')
    .trim()
    .notEmpty().withMessage('message is required')
    .isLength({ max: 2000 }).withMessage('message must be at most 2000 characters'),
  body('guest_relation')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 60 }).withMessage('guest_relation must be at most 60 characters'),
];
