// Import Recommendation model — stores AI-generated career suggestions per user
import Recommendation from '../models/Recommendation.js';
// Import axios — used to call the Python AI service for recommendation generation
import axios from 'axios';

// generateRecommendations — handles POST /api/recommendations/generate
// Asks the AI service to compute career matches based on the user's current profile
export const generateRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Send userId to AI service — it fetches the profile internally and runs scoring
    const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/recommend`, {
      userId: userId.toString()
    });

    const { recommendations } = aiResponse.data;

    // Persist the generated recommendations so they can be retrieved later
    const recommendation = await Recommendation.create({
      userId,
      recommendations
    });

    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getRecommendations — handles GET /api/recommendations
// Returns the 5 most recent recommendation sets for the logged-in user
export const getRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.find({ userId: req.user._id })
      .sort({ generatedAt: -1 }) // Newest first
      .limit(5);                 // Only show recent sets to keep UI clean
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// submitFeedback — handles POST /api/recommendations/feedback
// Saves user's rating/interest on a specific career recommendation
// Also forwards feedback to the AI service for future model improvement
export const submitFeedback = async (req, res) => {
  try {
    const { recommendationId, careerTitle, interested, rating, comment } = req.body;

    // Use positional operator ($) to update the specific career inside the recommendations array
    // Matches by both recommendationId and careerTitle to target the exact entry
    const recommendation = await Recommendation.findOneAndUpdate(
      { 
        _id: recommendationId, 
        userId: req.user._id,
        'recommendations.careerTitle': careerTitle
      },
      {
        $set: {
          'recommendations.$.userFeedback': {
            interested,
            rating,
            comment,
            feedbackDate: new Date()
          }
        }
      },
      { new: true }
    );

    // Forward feedback to AI service so it can adjust future recommendations
    await axios.post(`${process.env.AI_SERVICE_URL}/feedback`, {
      userId: req.user._id.toString(),
      careerTitle,
      interested,
      rating
    });

    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
