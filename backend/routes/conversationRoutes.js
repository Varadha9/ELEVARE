import express from 'express';
import { sendMessage, getConversations, getConversation } from '../controllers/conversationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/message', protect, sendMessage);
router.get('/', protect, getConversations);
router.get('/history', protect, getConversations);
router.get('/:id', protect, getConversation);

export default router;
