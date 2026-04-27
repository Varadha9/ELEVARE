// Import models needed to build the full profile response
import UserProfile from '../models/UserProfile.js';
import Conversation from '../models/Conversation.js';
import Recommendation from '../models/Recommendation.js';

// getUserProfile — handles GET /api/profile
// Returns the user's behavioral profile, personality, ikigai, and computed stats
export const getUserProfile = async (req, res) => {
  try {
    // Populate userId so we get name/email alongside the profile data
    const profile = await UserProfile.findOne({ userId: req.user._id }).populate('userId', 'name email');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    // Fetch all conversations sorted newest-first to calculate streak
    const conversations = await Conversation.find({ userId: req.user._id }).sort({ sessionDate: -1 });
    const streak = calculateStreak(conversations);

    // Count total recommendations generated for this user
    const recommendationCount = await Recommendation.countDocuments({ userId: req.user._id });

    // Merge profile data with computed stats into a single response object
    res.json({
      ...profile.toObject(),
      stats: { streak, totalConversations: conversations.length, recommendationCount }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// calculateStreak — counts consecutive days the user had at least one conversation
// Used to gamify engagement and encourage daily reflections
function calculateStreak(conversations) {
  if (conversations.length === 0) return 0;
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to midnight for day comparison

  for (let i = 0; i < conversations.length; i++) {
    const convDate = new Date(conversations[i].sessionDate);
    convDate.setHours(0, 0, 0, 0);

    // Expected date for this streak position (today, yesterday, day before, ...)
    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    if (convDate.getTime() === expectedDate.getTime()) {
      streak++; // Conversation exists on the expected day — continue streak
    } else {
      break; // Gap found — streak is broken
    }
  }
  return streak;
}

// getTraitHistory — handles GET /api/profile/history
// Returns the time-series trait data used to render the ProgressLineChart
export const getTraitHistory = async (req, res) => {
  try {
    // Only select traitHistory to avoid sending the full profile unnecessarily
    const profile = await UserProfile.findOne({ userId: req.user._id })
      .select('traitHistory');
    res.json(profile?.traitHistory || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// updateIkigai — handles PUT /api/profile/ikigai
// Saves the four Ikigai dimensions entered by the user on the Ikigai page
export const updateIkigai = async (req, res) => {
  try {
    const { loves, goodAt, worldNeeds, paidFor } = req.body;
    
    // Use $set with dot notation to update only the ikigai sub-document fields
    // { new: true } returns the updated document instead of the old one
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
