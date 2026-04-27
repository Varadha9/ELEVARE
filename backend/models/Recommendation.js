// Import mongoose for schema and model creation
import mongoose from 'mongoose';

// recommendationSchema — stores AI-generated career suggestions for a user
// Each document represents one generation run containing multiple career matches
const recommendationSchema = new mongoose.Schema({
  // Link to the user who received these recommendations
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  // Array of individual career recommendations in this generation run
  recommendations: [{
    careerTitle:    { type: String, required: true },
    careerCategory: String,
    // confidenceScore (0-100) — how well the user's profile matches this career
    confidenceScore: { type: Number, required: true, min: 0, max: 100 },
    
    // Explanation provides transparency — users can see WHY a career was suggested
    explanation: {
      summary:       String,
      matchingTraits:[String], // Which behavioral traits drove this recommendation
      // Ikigai alignment scores per dimension — shows how the career fits the framework
      ikigaiAlignment: {
        loves:      Number,
        goodAt:     Number,
        worldNeeds: Number,
        paidFor:    Number
      }
    },
    
    // Career details shown on the Careers page
    careerDetails: {
      description:   String,
      requiredSkills:[String],
      averageSalary: String,
      growthOutlook: String,
      educationPath: [String]
    },
    
    // User feedback collected after viewing the recommendation
    // Used to improve future recommendations via the feedback loop
    userFeedback: {
      interested:   { type: Boolean },
      rating:       { type: Number, min: 1, max: 5 },
      comment:      String,
      feedbackDate: Date
    }
  }],
  
  generatedAt:  { type: Date, default: Date.now },
  modelVersion: { type: String, default: '1.0' } // Tracks which version of the recommendation engine was used
});

// Compound index for fast retrieval of a user's most recent recommendations
recommendationSchema.index({ userId: 1, generatedAt: -1 });

export default mongoose.model('Recommendation', recommendationSchema);
