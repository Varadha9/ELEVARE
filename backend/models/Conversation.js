// Import mongoose for schema and model creation
import mongoose from 'mongoose';

// conversationSchema — stores each chat session between the user and the AI coach
const conversationSchema = new mongoose.Schema({
  // Link to the user who owns this conversation
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Array of messages in this session — alternates between 'user' and 'assistant' roles
  messages: [{
    role:      { type: String, enum: ['user', 'assistant'], required: true },
    content:   { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    
    // NLP analysis attached to each user message by the AI service
    // Stored here so the frontend can display insights per message
    analysis: {
      emotions:      [{ emotion: String, score: Number }], // Top detected emotions with confidence scores
      detectedTraits:[{ trait: String, value: Number }],   // Behavioral traits inferred from the message
      keywords:      [String],                             // Key topics extracted from the message
      sentiment:     { type: String, enum: ['positive', 'negative', 'neutral'] }
    }
  }],
  
  sessionDate: { type: Date, default: Date.now },
  // sessionType distinguishes daily reflections from follow-ups or feedback sessions
  sessionType: { type: String, enum: ['daily', 'followup', 'feedback'], default: 'daily' },
  // completed flag can be used to mark sessions the user finished vs abandoned
  completed:   { type: Boolean, default: false }
});

// Compound index on userId + sessionDate for fast sorted queries
// Used in getConversations to fetch recent sessions efficiently
conversationSchema.index({ userId: 1, sessionDate: -1 });

export default mongoose.model('Conversation', conversationSchema);
