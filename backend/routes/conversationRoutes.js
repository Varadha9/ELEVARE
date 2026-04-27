// Import Express to create a modular router
import express from 'express';
// Import conversation controller functions
import { sendMessage, getConversations, getConversation } from '../controllers/conversationController.js';
// Import protect middleware — all conversation routes require authentication
import { protect } from '../middleware/auth.js';

const router = express.Router();

// POST /api/conversations/message — send a message to the AI coach
// protect ensures only authenticated users can chat
router.post('/message', protect, sendMessage);

// GET /api/conversations — fetch all conversation sessions for the user
router.get('/', protect, getConversations);

// GET /api/conversations/history — alias for the above, used by the frontend
router.get('/history', protect, getConversations);

// GET /api/conversations/:id — fetch a single conversation by its ID
router.get('/:id', protect, getConversation);

export default router;
