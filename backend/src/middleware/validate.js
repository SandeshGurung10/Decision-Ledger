import { body, validationResult } from 'express-validator';
import AppError from '../utils/AppError.js';

export const validate = (validations) => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

    return next(new AppError(`Validation Error: ${JSON.stringify(extractedErrors)}`, 400));
  };
};

export const userValidationRules = () => {
  return [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Must be a valid email address'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long'),
  ];
};

export const loginValidationRules = () => {
  return [
    body('email').isEmail().withMessage('Must be a valid email address'),
    body('password').notEmpty().withMessage('Password is required'),
  ];
};

export const decisionValidationRules = () => {
  return [
    body('title')
      .notEmpty()
      .withMessage('Title is required')
      .isLength({ max: 150 })
      .withMessage('Title cannot exceed 150 characters'),
    body('description').notEmpty().withMessage('Description is required'),
    body('rationale').notEmpty().withMessage('Rationale is required'),
    body('category')
      .isIn(['Strategic', 'Operational', 'Financial', 'HR', 'Technical', 'Other'])
      .withMessage('Please provide a valid category'),
  ];
};
