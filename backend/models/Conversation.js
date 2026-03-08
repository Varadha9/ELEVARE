import mongoose from 'mongoose';

const conversationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  messages: [{
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    
    // AI analysis results
    analysis: {
      emotions: [{ emotion: String, score: Number }],
      detectedTraits: [{ trait: String, value: Number }],
      keywords: [String],
      sentiment: { type: String, enum: ['positive', 'negative', 'neutral'] }
    }
  }],
  
  sessionDate: { type: Date, default: Date.now },
  sessionType: { type: String, enum: ['daily', 'followup', 'feedback'], default: 'daily' },
  completed: { type: Boolean, default: false }
});

conversationSchema.index({ userId: 1, sessionDate: -1 });

export default mongoose.model('Conversation', conversationSchema);
