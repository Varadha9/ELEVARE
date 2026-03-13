import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Protect routes - Verify JWT token
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: {
          message: 'Access denied. No token provided.',
          statusCode: 401
        }
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
      
      // Get user from token
      const user = await User.findById(decoded.userId || decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          error: {
            message: 'User not found. Token invalid.',
            statusCode: 401
          }
        });
      }

      // Attach user to request
      req.user = user;
      req.userId = user._id;
      
      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Token expired. Please login again.',
            statusCode: 401
          }
        });
      }

      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          error: {
            message: 'Invalid token. Please login again.',
            statusCode: 401
          }
        });
      }

      throw error;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: {
        message: 'Authentication error',
        statusCode: 500
      }
    });
  }
};

/**
 * Generate JWT token
 */
export const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'dev_secret',
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

/**
 * Optional auth - Attach user if token exists but don't require it
 */
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
        const user = await User.findById(decoded.userId || decoded.id).select('-password');
        
        if (user) {
          req.user = user;
          req.userId = user._id;
        }
      } catch (error) {
        // Token invalid but continue anyway
        console.log('Optional auth: Invalid token, continuing without user');
      }
    }

    next();
  } catch (error) {
    next();
  }
};

/**
 * Check if user is admin (for future use)
 */
export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: {
        message: 'Access denied. Admin privileges required.',
        statusCode: 403
      }
    });
  }
};
