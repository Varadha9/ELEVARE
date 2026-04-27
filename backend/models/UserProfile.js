// Import mongoose for schema and model creation
import mongoose from 'mongoose';

// userProfileSchema — stores all AI-analyzed behavioral data for a user
// Separate from User model to keep auth data and profile data cleanly separated
const userProfileSchema = new mongoose.Schema({
  // Reference to the User document — one profile per user (unique: true enforces this)
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  
  // Big Five Personality Traits (OCEAN model) on a 0-100 scale
  // Initialized at 50 (neutral) and updated via EWMA after each conversation
  personality: {
    openness:          { type: Number, default: 50 }, // Curiosity, creativity, openness to experience
    conscientiousness: { type: Number, default: 50 }, // Organization, discipline, reliability
    extraversion:      { type: Number, default: 50 }, // Sociability, assertiveness, energy
    agreeableness:     { type: Number, default: 50 }, // Cooperation, trust, empathy
    neuroticism:       { type: Number, default: 50 }  // Emotional instability, anxiety
  },
  
  // 8 Behavioral Traits on a 0-100 scale
  // Detected from conversation text by the NLP processor and updated over time
  behavioralTraits: {
    creativity:         { type: Number, default: 50 },
    analyticalThinking: { type: Number, default: 50 },
    communication:      { type: Number, default: 50 },
    leadership:         { type: Number, default: 50 },
    empathy:            { type: Number, default: 50 },
    motivation:         { type: Number, default: 50 },
    stressTolerance:    { type: Number, default: 50 },
    problemSolving:     { type: Number, default: 50 }
  },
  
  // Ikigai Framework — four dimensions that together define a fulfilling career
  ikigai: {
    loves:       [String], // What the user is passionate about
    goodAt:      [String], // Skills and strengths
    worldNeeds:  [String], // Problems the user wants to solve
    paidFor:     [String]  // Areas where the user can earn a living
  },
  
  // Interest categories with scores — used to refine career recommendations
  interests: [{
    category:    String,
    score:       Number,
    lastUpdated: Date
  }],
  
  // Trait evolution history — each entry records trait values at a point in time
  // Used to render the ProgressLineChart showing growth over sessions
  traitHistory: [{
    date:   Date,
    traits: mongoose.Schema.Types.Mixed // Flexible object to store any trait snapshot
  }],
  
  updatedAt: { type: Date, default: Date.now }
});

// Index on userId for fast profile lookups (used on every authenticated request)
userProfileSchema.index({ userId: 1 });

export default mongoose.model('UserProfile', userProfileSchema);
