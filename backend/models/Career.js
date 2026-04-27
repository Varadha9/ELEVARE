// Import mongoose for schema and model creation
import mongoose from 'mongoose';

// careerSchema — defines the structure of each career in the database
// Used by the recommendation engine to match against user profiles
const careerSchema = new mongoose.Schema({
  title:       { type: String, required: true, unique: true }, // Career name (e.g. "Software Engineer")
  category:    String,    // Broad field (e.g. "Technology", "Healthcare")
  description: String,    // Short summary shown on the Careers page

  // requiredTraits — ideal behavioral trait scores for this career (0-100 scale)
  // The recommendation engine compares these against the user's detected traits
  requiredTraits: {
    creativity:         Number,
    analyticalThinking: Number,
    communication:      Number,
    leadership:         Number,
    empathy:            Number,
    problemSolving:     Number
  },
  
  // personalityFit — ideal Big Five (OCEAN) scores for this career
  // Used in the psychometric match calculation (cosine similarity)
  personalityFit: {
    openness:          Number,
    conscientiousness: Number,
    extraversion:      Number,
    agreeableness:     Number,
    neuroticism:       Number
  },
  
  skills:          [String], // Required skills shown to the user
  education:       [String], // Typical education paths for this career
  averageSalary:   String,   // Used in market viability scoring
  growthRate:      String,   // Industry growth % — part of market score
  workEnvironment: String,   // e.g. "Remote", "Office", "Field"
  
  // ikigaiMapping — maps this career to the four Ikigai dimensions
  // Used to calculate Ikigai alignment score against the user's Ikigai profile
  ikigaiMapping: {
    passionArea: [String], // What you love
    talentArea:  [String], // What you're good at
    demandArea:  [String], // What the world needs
    profitArea:  [String]  // What you can be paid for
  }
});

// Compound index for fast lookups by title and category
careerSchema.index({ title: 1, category: 1 });

export default mongoose.model('Career', careerSchema);
