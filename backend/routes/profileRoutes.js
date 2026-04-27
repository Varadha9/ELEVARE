// Import Express to create a modular router
import express from 'express';
// Import profile controller functions
import { getUserProfile, getTraitHistory, updateIkigai } from '../controllers/profileController.js';
// Import protect middleware — all profile routes require a valid JWT
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/profile — returns full profile with behavioral traits, personality, and stats
router.get('/', protect, getUserProfile);

// GET /api/profile/history — returns trait history array for the ProgressLineChart
router.get('/history', protect, getTraitHistory);

// PUT /api/profile/ikigai — saves the user's four Ikigai dimension inputs
router.put('/ikigai', protect, updateIkigai);

export default router;
