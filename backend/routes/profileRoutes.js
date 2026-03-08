import express from 'express';
import { getUserProfile, getTraitHistory, updateIkigai } from '../controllers/profileController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getUserProfile);
router.get('/history', protect, getTraitHistory);
router.put('/ikigai', protect, updateIkigai);

export default router;
