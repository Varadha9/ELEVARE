import express from 'express';
import { generateRecommendations, getRecommendations, submitFeedback } from '../controllers/recommendationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', protect, generateRecommendations);
router.get('/', protect, getRecommendations);
router.post('/feedback', protect, submitFeedback);

export default router;
