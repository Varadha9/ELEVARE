import mongoose from 'mongoose';

const userProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  // Big Five Personality Traits (0-100 scale)
  personality: {
    openness: { type: Number, default: 50 },
    conscientiousness: { type: Number, default: 50 },
    extraversion: { type: Number, default: 50 },
    agreeableness: { type: Number, default: 50 },
    neuroticism: { type: Number, default: 50 }
  },
  
  // Behavioral Traits (0-100 scale)
  behavioralTraits: {
    creativity: { type: Number, default: 50 },
    analyticalThinking: { type: Number, default: 50 },
    communication: { type: Number, default: 50 },
    leadership: { type: Number, default: 50 },
    empathy: { type: Number, default: 50 },
    motivation: { type: Number, default: 50 },
    stressTolerance: { type: Number, default: 50 },
    problemSolving: { type: Number, default: 50 }
  },
  
  // Ikigai Framework
  ikigai: {
    loves: [String],           // What user loves
    goodAt: [String],          // What user is good at
    worldNeeds: [String],      // What world needs
    paidFor: [String]          // What user can be paid for
  },
  
  // Interest tracking
  interests: [{
    category: String,
    score: Number,
    lastUpdated: Date
  }],
  
  // Trait evolution history
  traitHistory: [{
    date: Date,
    traits: mongoose.Schema.Types.Mixed
  }],
  
  updatedAt: { type: Date, default: Date.now }
});

userProfileSchema.index({ userId: 1 });

export default mongoose.model('UserProfile', userProfileSchema);
