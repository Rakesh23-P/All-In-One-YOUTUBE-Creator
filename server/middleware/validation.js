const { body, validationResult } = require('express-validator');

// Helper to return validation error responses
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  
  const extractedErrors = [];
  errors.array().map(err => extractedErrors.push({ [err.path]: err.msg }));

  return res.status(400).json({
    success: false,
    errors: extractedErrors,
    message: errors.array()[0].msg // Primary error message
  });
};

// User Registration Validation Rules
const registerRules = () => {
  return [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];
};

// User Login Validation Rules
const loginRules = () => {
  return [
    body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required'),
  ];
};

// Password Reset Validation Rules
const resetPasswordRules = () => {
  return [
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  ];
};

// Video Details Validation Rules
const videoRules = () => {
  return [
    body('title').trim().notEmpty().withMessage('Video title is required').isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description').optional().trim().isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),
  ];
};

// Task Details Validation Rules
const taskRules = () => {
  return [
    body('title').trim().notEmpty().withMessage('Task title is required'),
    body('dueDate').notEmpty().withMessage('Due date is required').isISO8601().toDate().withMessage('Please enter a valid ISO8601 date'),
    body('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status value'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority value'),
  ];
};

module.exports = {
  validate,
  registerRules,
  loginRules,
  resetPasswordRules,
  videoRules,
  taskRules
};
