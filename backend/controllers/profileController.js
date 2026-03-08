import UserProfile from '../models/UserProfile.js';

export const getUserProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ userId: req.user._id });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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
