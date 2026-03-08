import Recommendation from '../models/Recommendation.js';
import axios from 'axios';

export const generateRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Call AI service to generate recommendations
    const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/recommend`, {
      userId: userId.toString()
    });

    const { recommendations } = aiResponse.data;

    const recommendation = await Recommendation.create({
      userId,
      recommendations
    });

    res.json(recommendation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const recommendations = await Recommendation.find({ userId: req.user._id })
      .sort({ generatedAt: -1 })
      .limit(5);
    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitFeedback = async (req, res) => {
  try {
    const { recommendationId, careerTitle, interested, rating, comment } = req.body;

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

    // Send feedback to AI service for model improvement
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
