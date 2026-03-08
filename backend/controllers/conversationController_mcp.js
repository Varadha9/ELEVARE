import axios from 'axios';

const ORCHESTRATOR_URL = process.env.ORCHESTRATOR_URL || 'http://localhost:9001';

export const sendMessage = async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user._id;

    // Call MCP Orchestrator instead of old AI service
    const response = await axios.post(`${ORCHESTRATOR_URL}/chat`, {
      user_id: userId.toString(),
      message,
      conversation_history: []
    });

    const { response: aiResponse, analysis, recommendations } = response.data;

    // Save conversation to MongoDB
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findOne({ _id: conversationId, userId });
    } else {
      conversation = new Conversation({ userId, sessionType: 'daily' });
    }

    conversation.messages.push(
      { role: 'user', content: message, analysis },
      { role: 'assistant', content: aiResponse }
    );

    await conversation.save();

    res.json({
      conversationId: conversation._id,
      message: aiResponse,
      analysis,
      recommendations
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
