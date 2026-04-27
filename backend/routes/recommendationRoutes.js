// Import Express to create a modular router
import express from 'express';
// Import recommendation controller functions
import { generateRecommendations, getRecommendations, submitFeedback } from '../controllers/recommendationController.js';
// Import protect middleware — all recommendation routes require authentication
import { protect } from '../middleware/auth.js';

const router = express.Router();

// POST /api/recommendations/generate — triggers AI service to compute new career matches
router.post('/generate', protect, generateRecommendations);

// GET /api/recommendations — returns the 5 most recent recommendation sets
router.get('/', protect, getRecommendations);

// POST /api/recommendations/feedback — saves user's rating/interest on a career
// Feedback is also forwarded to the AI service to improve future recommendations
router.post('/feedback', protect, submitFeedback);

export default router;
