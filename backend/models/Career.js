import mongoose from 'mongoose';

const careerSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  category: String,
  description: String,
  
  requiredTraits: {
    creativity: Number,
    analyticalThinking: Number,
    communication: Number,
    leadership: Number,
    empathy: Number,
    problemSolving: Number
  },
  
  personalityFit: {
    openness: Number,
    conscientiousness: Number,
    extraversion: Number,
    agreeableness: Number,
    neuroticism: Number
  },
  
  skills: [String],
  education: [String],
  averageSalary: String,
  growthRate: String,
  workEnvironment: String,
  
  ikigaiMapping: {
    passionArea: [String],
    talentArea: [String],
    demandArea: [String],
    profitArea: [String]
  }
});

careerSchema.index({ title: 1, category: 1 });

export default mongoose.model('Career', careerSchema);
