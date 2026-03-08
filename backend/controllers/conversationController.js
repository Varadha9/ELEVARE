import Conversation from '../models/Conversation.js';
import UserProfile from '../models/UserProfile.js';
import axios from 'axios';

export const sendMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user._id;

    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, userId });
    } else {
      conversation = new Conversation({ userId, sessionType: 'daily' });
    }

    // Add user message
    conversation.messages.push({ role: 'user', content: message });

    // Call AI service for processing
    const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/process`, {
      userId: userId.toString(),
      message,
      conversationHistory: conversation.messages.slice(-10)
    });

    const { response, analysis, traitUpdates } = aiResponse.data;

    // Update last user message with analysis
    conversation.messages[conversation.messages.length - 1].analysis = analysis;

    // Add AI response
    conversation.messages.push({ role: 'assistant', content: response });

    await conversation.save();

    // Update user profile with trait changes
    if (traitUpdates) {
      await UserProfile.findOneAndUpdate(
        { userId },
        { 
          $set: traitUpdates,
          $push: { traitHistory: { date: new Date(), traits: traitUpdates } }
        }
      );
    }

    res.json({
      conversationId: conversation._id,
      message: response,
      analysis
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({ userId: req.user._id })
      .sort({ sessionDate: -1 })
      .limit(30);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
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
