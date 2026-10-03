import { body } from 'express-validator';

export const createVisitorRules = [
  body('session_id')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 36 }).withMessage('session_id must be at most 36 characters'),
  body('page_path')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 150 }).withMessage('page_path must be at most 150 characters'),
  body('referrer')
    .optional({ nullable: true })
    .trim()
    .isLength({ max: 255 }).withMessage('referrer must be at most 255 characters'),
];
