import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const USE_MEMORY_DB = process.env.USE_MEMORY_DB === 'true';

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Database setup
let db;
if (USE_MEMORY_DB) {
  console.log('🗄️  Using in-memory database for development');
  const memoryDB = await import('./config/memoryDB.js');
  db = memoryDB.default;
} else {
  console.log('🗄️  Connecting to MongoDB...');
  try {
    const mongoose = await import('mongoose');
    await mongoose.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevare');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('💡 Tip: Run with USE_MEMORY_DB=true for development without MongoDB');
    process.exit(1);
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'ELEVARE Backend API',
    version: '1.2.0',
    status: 'running',
    database: USE_MEMORY_DB ? 'in-memory' : 'mongodb',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    database: USE_MEMORY_DB ? 'in-memory' : 'mongodb',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Auth routes with memory DB support
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, age, education } = req.body;
    
    // Basic validation
    if (!name || !email || !password || !age || !education) {
      return res.status(400).json({
        success: false,
        error: { message: 'All fields are required' }
      });
    }

    if (USE_MEMORY_DB) {
      // Check if user exists
      const existingUser = await db.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: { message: 'User already exists' }
        });
      }

      // Hash password (simplified for demo)
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.default.hash(password, 12);

      // Create user
      const user = await db.createUser({
        name,
        email,
        password: hashedPassword,
        age: parseInt(age),
        education
      });

      // Create initial profile
      await db.createUserProfile(user._id, {
        behavioralTraits: {
          creativity: 5.0,
          analyticalThinking: 5.0,
          leadership: 5.0,
          teamwork: 5.0,
          communication: 5.0,
          problemSolving: 5.0,
          adaptability: 5.0,
          empathy: 5.0
        },
        personality: {
          openness: 0.5,
          conscientiousness: 0.5,
          extraversion: 0.5,
          agreeableness: 0.5,
          neuroticism: 0.5
        },
        conversationCount: 0,
        profileCompleteness: 20
      });

      // Generate JWT
      const jwt = await import('jsonwebtoken');
      const token = jwt.default.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'dev_secret',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            age: user.age,
            education: user.education
          },
          token
        }
      });
    } else {
      // MongoDB implementation would go here
      res.status(501).json({
        success: false,
        error: { message: 'MongoDB implementation needed' }
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email and password are required' }
      });
    }

    if (USE_MEMORY_DB) {
      // Find user
      const user = await db.findUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          error: { message: 'Invalid credentials' }
        });
      }

      // Check password
      const bcrypt = await import('bcryptjs');
      const isValidPassword = await bcrypt.default.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: { message: 'Invalid credentials' }
        });
      }

      // Generate JWT
      const jwt = await import('jsonwebtoken');
      const token = jwt.default.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'dev_secret',
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            age: user.age,
            education: user.education
          },
          token
        }
      });
    } else {
      // MongoDB implementation would go here
      res.status(501).json({
        success: false,
        error: { message: 'MongoDB implementation needed' }
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Simple middleware to verify JWT
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Access denied. No token provided.' }
      });
    }

    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { message: 'Invalid token' }
    });
  }
};

// Profile routes
app.get('/api/profile', verifyToken, async (req, res) => {
  try {
    if (USE_MEMORY_DB) {
      const user = await db.findUserById(req.user.userId);
      const profile = await db.findUserProfile(req.user.userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          error: { message: 'User not found' }
        });
      }

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            age: user.age,
            education: user.education,
            createdAt: user.createdAt
          },
          profile: profile || {
            behavioralTraits: {},
            personality: {},
            conversationCount: 0,
            profileCompleteness: 20
          }
        }
      });
    } else {
      res.status(501).json({
        success: false,
        error: { message: 'MongoDB implementation needed' }
      });
    }
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Conversation routes
app.post('/api/conversations/message', verifyToken, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({
        success: false,
        error: { message: 'Message is required' }
      });
    }

    // Simple AI response for demo
    const responses = [
      "That's interesting! Tell me more about what motivated you in that experience.",
      "I can see you're passionate about this. How did it make you feel?",
      "What aspects of this situation challenged you the most?",
      "That sounds like a great learning experience. What would you do differently?",
      "How do you think this experience relates to your career goals?"
    ];
    
    const aiResponse = responses[Math.floor(Math.random() * responses.length)];

    if (USE_MEMORY_DB) {
      // Save conversation
      const conversation = await db.saveConversation({
        userId: req.user.userId,
        userMessage: message,
        aiResponse: aiResponse,
        analysis: {
          sentiment: Math.random() * 2 - 1, // Random sentiment between -1 and 1
          emotions: {
            joy: Math.random(),
            sadness: Math.random(),
            anger: Math.random(),
            fear: Math.random(),
            surprise: Math.random()
          },
          keywords: message.split(' ').filter(word => word.length > 3).slice(0, 5)
        }
      });

      // Update conversation count
      const profile = await db.findUserProfile(req.user.userId);
      if (profile) {
        await db.updateUserProfile(req.user.userId, {
          conversationCount: (profile.conversationCount || 0) + 1
        });
      }

      res.json({
        success: true,
        data: {
          conversation: {
            id: conversation._id,
            userMessage: message,
            aiResponse: aiResponse,
            timestamp: conversation.timestamp
          },
          analysis: conversation.analysis
        }
      });
    } else {
      res.status(501).json({
        success: false,
        error: { message: 'MongoDB implementation needed' }
      });
    }
  } catch (error) {
    console.error('Conversation error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Get conversation history
app.get('/api/conversations/history', verifyToken, async (req, res) => {
  try {
    if (USE_MEMORY_DB) {
      const conversations = await db.getUserConversations(req.user.userId, 20);
      
      res.json({
        success: true,
        data: {
          conversations: conversations.map(conv => ({
            id: conv._id,
            userMessage: conv.userMessage,
            aiResponse: conv.aiResponse,
            timestamp: conv.timestamp
          })),
          total: conversations.length
        }
      });
    } else {
      res.status(501).json({
        success: false,
        error: { message: 'MongoDB implementation needed' }
      });
    }
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: { message: 'Internal server error' }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: { message: 'Route not found' }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ELEVARE Backend running on port ${PORT}`);
  console.log(`🗄️  Database: ${USE_MEMORY_DB ? 'In-Memory (Development)' : 'MongoDB'}`);
  console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  
  if (USE_MEMORY_DB) {
    console.log('💡 Demo login: demo@elevare.com / password123');
    console.log('⚠️  Note: Data will be lost when server restarts');
  }
});

export default app;