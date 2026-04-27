// Import Conversation model — stores chat messages and NLP analysis per session
import Conversation from '../models/Conversation.js';
// Import UserProfile model — updated with trait changes after each message
import UserProfile from '../models/UserProfile.js';
// Import axios — used to call the Python AI service (FastAPI on port 8000)
import axios from 'axios';

// sendMessage — handles POST /api/conversations/message
// Sends user message to AI service, saves conversation, updates behavioral traits
export const sendMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user._id; // Set by JWT middleware

    let conversation;
    if (conversationId) {
      // Resume an existing conversation session
      conversation = await Conversation.findOne({ _id: conversationId, userId });
    } else {
      // Start a new daily session
      conversation = new Conversation({ userId, sessionType: 'daily' });
    }

    // Append the user's message to the conversation history
    conversation.messages.push({ role: 'user', content: message });

    // Forward message + last 10 messages of history to the Python AI service
    // The AI service runs NLP analysis and generates an LLM response
    const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/process`, {
      userId: userId.toString(),
      message,
      conversationHistory: conversation.messages.slice(-10) // Limit context window
    });

    const { response, analysis, traitUpdates } = aiResponse.data;

    // Attach NLP analysis (emotions, sentiment, keywords) to the user's message
    conversation.messages[conversation.messages.length - 1].analysis = analysis;

    // Append the AI's reply to the conversation
    conversation.messages.push({ role: 'assistant', content: response });

    // Persist the updated conversation to MongoDB
    await conversation.save();

    // If the AI detected behavioral traits, update the user's profile
    // Uses $push to append to traitHistory for longitudinal tracking
    if (traitUpdates) {
      await UserProfile.findOneAndUpdate(
        { userId },
        { 
          $set: traitUpdates,
          $push: { traitHistory: { date: new Date(), traits: traitUpdates } }
        }
      );
    }

    // Return the AI response and analysis to the frontend
    res.json({
      conversationId: conversation._id,
      aiResponse: response,
      message: response,
      analysis
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getConversations — handles GET /api/conversations
// Returns the 30 most recent conversation sessions for the logged-in user
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user._id })
      .sort({ sessionDate: -1 }) // Newest first
      .limit(30);                // Cap at 30 to avoid large payloads
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getConversation — handles GET /api/conversations/:id
// Returns a single conversation by ID, scoped to the authenticated user
export const getConversation = async (req, res) => {
  try {
    // userId check prevents users from accessing other users' conversations
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id
    });
    
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }
    
    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
