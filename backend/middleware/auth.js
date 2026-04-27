// Import JWT library for token creation and verification
// Used to implement stateless authentication without storing sessions
import jwt from 'jsonwebtoken';

// Import User model to fetch user data from database
// Needed to validate that the user in the token still exists
import User from '../models/User.js';

/**
 * Middleware to protect routes that require authentication
 * Verifies JWT token from request headers and attaches user to request object
 * Used on all protected API endpoints to ensure only authenticated users can access them
 */
export const protect = async (req, res, next) => {
  // Variable to store the extracted token
  let token;

  // Check if Authorization header exists and starts with 'Bearer'
  // Standard format: "Bearer <token>" - industry standard for JWT authentication
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract token by splitting "Bearer <token>" and taking the second part
      // [0] = 'Bearer', [1] = actual token
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token signature and decode payload using secret key
      // Throws error if token is invalid, expired, or tampered with
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Fetch user from database using ID from token payload
      // .select('-password') excludes password field for security
      req.user = await User.findById(decoded.id).select('-password');
      
      // Check if user still exists in database
      // Handles case where user was deleted after token was issued
      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }
      
      // User is authenticated - proceed to next middleware/route handler
      next();
    } catch (error) {
      // Token verification failed (invalid, expired, or malformed)
      // Return 401 Unauthorized status
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // No token was provided in the request
  // Return 401 Unauthorized status
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * Generate JWT token for authenticated user
 * Used during login and registration to create session token
 * Token contains user ID and expiration time
 * 
 * @param {string} id - User's MongoDB ObjectId
 * @returns {string} Signed JWT token
 */
export const generateToken = (id) => {
  // Create and sign JWT with user ID as payload
  // Secret key ensures token cannot be forged
  // expiresIn sets token lifetime (e.g., '7d' = 7 days)
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};
