// Import mongoose for schema definition and model creation
import mongoose from 'mongoose';
// Import bcryptjs for password hashing — more secure than plain text storage
import bcrypt from 'bcryptjs';

// userSchema — defines the shape of every user document in MongoDB
const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true, lowercase: true }, // lowercase ensures case-insensitive login
  password: { type: String, required: true },
  age:      { type: Number },
  education:{ type: String },
  // currentStatus tracks whether the user is a student, employed, or exploring
  currentStatus: { type: String, enum: ['student', 'working', 'exploring'], default: 'student' },
  createdAt: { type: Date, default: Date.now },
  lastActive: { type: Date, default: Date.now }, // Updated on every login for engagement tracking
  conversationStreak: { type: Number, default: 0 } // Gamification — consecutive daily chat days
});

// Pre-save hook — runs automatically before every .save() call
// Only hashes the password if it was modified (avoids re-hashing on profile updates)
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  // 12 salt rounds — strong enough for security without being too slow
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// comparePassword — instance method used during login
// Compares the plain-text input against the stored bcrypt hash
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Export the compiled model — 'User' maps to the 'users' collection in MongoDB
export default mongoose.model('User', userSchema);
