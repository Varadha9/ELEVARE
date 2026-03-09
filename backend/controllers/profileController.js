import UserProfile from '../models/UserProfile.js';
import Conversation from '../models/Conversation.js';
import Recommendation from '../models/Recommendation.js';

export const getUserProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user._id }).populate('userId', 'name email');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const conversations = await Conversation.find({ userId: req.user._id }).sort({ sessionDate: -1 });
    const streak = calculateStreak(conversations);
    const recommendationCount = await Recommendation.countDocuments({ userId: req.user._id });

    res.json({
      ...profile.toObject(),
      stats: { streak, totalConversations: conversations.length, recommendationCount }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

function calculateStreak(conversations) {
  if (conversations.length === 0) return 0;
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let i = 0; i < conversations.length; i++) {
    const convDate = new Date(conversations[i].sessionDate);
    convDate.setHours(0, 0, 0, 0);
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);
    if (convDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

export const getTraitHistory = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user._id })
      .select('traitHistory');
    res.json(profile?.traitHistory || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateIkigai = async (req, res) => {
  try {
    const { loves, goodAt, worldNeeds, paidFor } = req.body;
    
    const profile = await UserProfile.findOneAndUpdate(
      { userId: req.user._id },
      { 
        $set: { 
          'ikigai.loves': loves,
          'ikigai.goodAt': goodAt,
          'ikigai.worldNeeds': worldNeeds,
          'ikigai.paidFor': paidFor
        }
      },
      { new: true }
    );
    
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
