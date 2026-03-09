import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing Backend Components...\n');

// Test 1: Environment Variables
console.log('[TEST] Environment Variables');
console.log(`  PORT: ${process.env.PORT || '5000'}`);
console.log(`  MONGODB_URI: ${process.env.MONGODB_URI ? 'Set' : 'Missing'}`);
console.log(`  JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'Missing'}`);
console.log(`  AI_SERVICE_URL: ${process.env.AI_SERVICE_URL || 'http://localhost:8000'}`);

// Test 2: Import Models
console.log('\n[TEST] Importing Models');
try {
  const { default: User } = await import('./models/User.js');
  console.log('  [OK] User model');
  
  const { default: UserProfile } = await import('./models/UserProfile.js');
  console.log('  [OK] UserProfile model');
  
  const { default: Conversation } = await import('./models/Conversation.js');
  console.log('  [OK] Conversation model');
  
  const { default: Recommendation } = await import('./models/Recommendation.js');
  console.log('  [OK] Recommendation model');
  
  const { default: Career } = await import('./models/Career.js');
  console.log('  [OK] Career model');
} catch (error) {
  console.log(`  [ERROR] ${error.message}`);
}

// Test 3: Import Controllers
console.log('\n[TEST] Importing Controllers');
try {
  await import('./controllers/authController.js');
  console.log('  [OK] Auth controller');
  
  await import('./controllers/conversationController.js');
  console.log('  [OK] Conversation controller');
  
  await import('./controllers/profileController.js');
  console.log('  [OK] Profile controller');
  
  await import('./controllers/recommendationController.js');
  console.log('  [OK] Recommendation controller');
} catch (error) {
  console.log(`  [ERROR] ${error.message}`);
}

// Test 4: Import Routes
console.log('\n[TEST] Importing Routes');
try {
  await import('./routes/authRoutes.js');
  console.log('  [OK] Auth routes');
  
  await import('./routes/conversationRoutes.js');
  console.log('  [OK] Conversation routes');
  
  await import('./routes/profileRoutes.js');
  console.log('  [OK] Profile routes');
  
  await import('./routes/recommendationRoutes.js');
  console.log('  [OK] Recommendation routes');
} catch (error) {
  console.log(`  [ERROR] ${error.message}`);
}

// Test 5: MongoDB Connection
console.log('\n[TEST] MongoDB Connection');
try {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('  [OK] Connected to MongoDB');
  await mongoose.connection.close();
  console.log('  [OK] Disconnected from MongoDB');
} catch (error) {
  console.log(`  [ERROR] ${error.message}`);
}

console.log('\n[SUCCESS] Backend tests completed!');
process.exit(0);
