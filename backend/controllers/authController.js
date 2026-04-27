// Import User model to query/create users in MongoDB
import User from '../models/User.js';
// Import UserProfile model — auto-created alongside every new user
import UserProfile from '../models/UserProfile.js';
// Import token generator — used to issue JWT after register/login
import { generateToken } from '../middleware/auth.js';

// register — handles POST /api/auth/register
// Creates a new user + blank profile, returns JWT token
export const register = async (req, res) => {
  try {
    const { name, email, password, age, education } = req.body;

    // Check if email is already taken — prevent duplicate accounts
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user — password is hashed automatically via pre-save hook in User model
    const user = await User.create({ name, email, password, age, education });
    
    // Create an empty behavioral profile linked to this user
    // Done here so the profile always exists when the user first logs in
    await UserProfile.create({ userId: user._id });

    // Return user info + JWT so the client can immediately authenticate
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// login — handles POST /api/auth/login
// Validates credentials and returns a fresh JWT token
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email; comparePassword checks bcrypt hash
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      // Return same message for both cases — avoids leaking which field is wrong
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update lastActive timestamp so we can track engagement
    user.lastActive = Date.now();
    await user.save();

    // Return user data + new JWT for the session
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// getProfile — handles GET /api/auth/profile (protected route)
// Returns the authenticated user's data without the password field
export const getProfile = async (req, res) => {
  try {
    // req.user._id is set by the protect middleware after verifying JWT
    // .select('-password') excludes the hashed password from the response
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
