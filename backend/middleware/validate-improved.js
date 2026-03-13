import { validationResult } from 'express-validator';

/**
 * Validate request using express-validator
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value
    }));

    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: formattedErrors,
        statusCode: 400
      }
    });
  }
  
  next();
};

/**
 * Custom validation helpers
 */
export const validateObjectId = (id) => {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
};

export const validateEmail = (email) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
};

export const validatePassword = (password) => {
  // At least 6 characters
  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long' };
  }
  
  return { valid: true };
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  return input;
};
