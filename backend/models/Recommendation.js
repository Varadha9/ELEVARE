import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  
  recommendations: [{
    careerTitle: { type: String, required: true },
    careerCategory: String,
    confidenceScore: { type: Number, required: true, min: 0, max: 100 },
    
    explanation: {
      summary: String,
      matchingTraits: [String],
      ikigaiAlignment: {
        loves: Number,
        goodAt: Number,
        worldNeeds: Number,
        paidFor: Number
      }
    },
    
    careerDetails: {
      description: String,
      requiredSkills: [String],
      averageSalary: String,
      growthOutlook: String,
      educationPath: [String]
    },
    
    userFeedback: {
      interested: { type: Boolean },
      rating: { type: Number, min: 1, max: 5 },
      comment: String,
      feedbackDate: Date
    }
  }],
  
  generatedAt: { type: Date, default: Date.now },
  modelVersion: { type: String, default: '1.0' }
});

recommendationSchema.index({ userId: 1, generatedAt: -1 });

export default mongoose.model('Recommendation', recommendationSchema);
