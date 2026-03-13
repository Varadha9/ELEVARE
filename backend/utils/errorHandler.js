/**
 * Custom Error Class
 */
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Async handler wrapper to catch errors
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Success response helper
 */
export const successResponse = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Error response helper
 */
export const errorResponse = (res, message, statusCode = 500, details = null) => {
  const response = {
    success: false,
    error: {
      message,
      statusCode
    }
  };

  if (details) {
    response.error.details = details;
  }

  if (process.env.NODE_ENV === 'development') {
    response.timestamp = new Date().toISOString();
  }

  return res.status(statusCode).json(response);
};

/**
 * Not found error
 */
export const notFound = (message = 'Resource not found') => {
  return new AppError(message, 404);
};

/**
 * Validation error
 */
export const validationError = (message = 'Validation failed', details = null) => {
  const error = new AppError(message, 400);
  error.details = details;
  return error;
};

/**
 * Unauthorized error
 */
export const unauthorized = (message = 'Unauthorized access') => {
  return new AppError(message, 401);
};

/**
 * Forbidden error
 */
export const forbidden = (message = 'Access forbidden') => {
  return new AppError(message, 403);
};

/**
 * Conflict error
 */
export const conflict = (message = 'Resource conflict') => {
  return new AppError(message, 409);
};

/**
 * Internal server error
 */
export const serverError = (message = 'Internal server error') => {
  return new AppError(message, 500);
};
