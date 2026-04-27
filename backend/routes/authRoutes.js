// Import Express to create a modular router
import express from 'express';
// Import body() from express-validator to define field-level validation rules
import { body } from 'express-validator';
// Import controller functions that handle the actual business logic
import { register, login, getProfile } from '../controllers/authController.js';
// Import protect middleware — verifies JWT before allowing access to protected routes
import { protect } from '../middleware/auth.js';
// Import validate middleware — checks express-validator results and returns errors if any
import { validate } from '../middleware/validate.js';

const router = express.Router();

// POST /api/auth/register
// Validates name, email, and password before passing to the register controller
router.post('/register', [
  body('name').notEmpty().trim(),                // Name must not be empty
  body('email').isEmail().normalizeEmail(),      // Must be a valid email, normalized to lowercase
  body('password').isLength({ min: 6 }),         // Password must be at least 6 characters
  validate                                       // Middleware that returns 400 if any rule fails
], register);

// POST /api/auth/login
// Validates email and password presence before passing to the login controller
router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate
], login);

// GET /api/auth/profile — protected route
// protect middleware verifies JWT and attaches req.user before calling getProfile
router.get('/profile', protect, getProfile);

export default router;
