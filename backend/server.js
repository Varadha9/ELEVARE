import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
let USE_MEMORY_DB = process.env.USE_MEMORY_DB === 'true';

// Database setup
let mongoose, User, UserProfile, Conversation;
let memoryDB = null;

if (!USE_MEMORY_DB) {
  try {
    // Try to use MongoDB
    mongoose = await import('mongoose');
    
    // MongoDB Models
    const userSchema = new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      age: { type: Number, required: true },
      education: { type: String, required: true },
      createdAt: { type: Date, default: Date.now }
    });

    const userProfileSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      behavioralTraits: {
        creativity: { type: Number, default: 5.0 },
        analyticalThinking: { type: Number, default: 5.0 },
        leadership: { type: Number, default: 5.0 },
        teamwork: { type: Number, default: 5.0 },
        communication: { type: Number, default: 5.0 },
        problemSolving: { type: Number, default: 5.0 },
        adaptability: { type: Number, default: 5.0 },
        empathy: { type: Number, default: 5.0 }
      },
      personality: {
        openness: { type: Number, default: 0.5 },
        conscientiousness: { type: Number, default: 0.5 },
        extraversion: { type: Number, default: 0.5 },
        agreeableness: { type: Number, default: 0.5 },
        neuroticism: { type: Number, default: 0.5 }
      },
      ikigai: {
        whatYouLove: [String],
        whatYouAreGoodAt: [String],
        whatTheWorldNeeds: [String],
        whatYouCanBePaidFor: [String]
      },
      conversationCount: { type: Number, default: 0 },
      profileCompleteness: { type: Number, default: 20 },
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });

    const conversationSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      userMessage: { type: String, required: true },
      aiResponse: { type: String, required: true },
      analysis: {
        sentiment: mongoose.Schema.Types.Mixed,
        emotions: Object,
        keywords: [String],
        detectedTraits: Object
      },
      timestamp: { type: Date, default: Date.now }
    });

    User = mongoose.model('User', userSchema);
    UserProfile = mongoose.model('UserProfile', userProfileSchema);
    Conversation = mongoose.model('Conversation', conversationSchema);

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elevare');
    console.log('✅ MongoDB connected successfully');
    
  } catch (error) {
    console.log('⚠️  MongoDB connection failed, falling back to in-memory database');
    console.log('Error:', error.message);
    USE_MEMORY_DB = true;
  }
}

// In-memory database fallback
if (USE_MEMORY_DB) {
  const users = new Map();
  const userProfiles = new Map();
  const conversations = new Map();
  const recommendations = new Map();

  memoryDB = {
    users,
    userProfiles,
    conversations,
    recommendations,
    
    generateId: () => Date.now().toString() + Math.random().toString(36).substr(2, 9),
    
    async createUser(userData) {
      const id = this.generateId();
      const user = { _id: id, ...userData, createdAt: new Date() };
      this.users.set(id, user);
      return user;
    },
    
    async findUserByEmail(email) {
      for (const [id, user] of this.users) {
        if (user.email === email) return user;
      }
      return null;
    },
    
    async findUserById(id) {
      return this.users.get(id) || null;
    },
    
    async createUserProfile(userId, profileData) {
      const profile = {
        _id: this.generateId(),
        userId,
        ...profileData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.userProfiles.set(userId, profile);
      return profile;
    },
    
    async findUserProfile(userId) {
      return this.userProfiles.get(userId) || null;
    },
    
    async updateUserProfile(userId, updates) {
      const existing = this.userProfiles.get(userId);
      if (existing) {
        const updated = { ...existing, ...updates, updatedAt: new Date() };
        this.userProfiles.set(userId, updated);
        return updated;
      }
      return null;
    },
    
    async saveConversation(conversationData) {
      const id = this.generateId();
      const conversation = { _id: id, ...conversationData, timestamp: new Date() };
      
      if (!this.conversations.has(conversationData.userId)) {
        this.conversations.set(conversationData.userId, []);
      }
      this.conversations.get(conversationData.userId).push(conversation);
      return conversation;
    },
    
    async getUserConversations(userId, limit = 10) {
      const conversations = this.conversations.get(userId) || [];
      return conversations.slice(-limit).reverse();
    }
  };
}

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: { message: 'Too many requests from this IP, please try again later.' } }
});
app.use('/api/', limiter);

// Utility functions
const createInitialProfile = (userId) => ({
  userId,
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
  ikigai: {
    whatYouLove: [],
    whatYouAreGoodAt: [],
    whatTheWorldNeeds: [],
    whatYouCanBePaidFor: []
  },
  conversationCount: 0,
  profileCompleteness: 20
});

// JWT middleware
const verifyToken = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Access denied. No token provided.' }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { message: 'Invalid token' }
    });
  }
};

// Routes
app.get('/', (req, res) => {
    const calcStreak = (convs) => { if (!convs || convs.length === 0) return 0; const days = [...new Set(convs.map(c => new Date(c.timestamp).toDateString()))]; let s = 0; const t = new Date(); for (let j = 0; j < days.length; j++) { const e = new Date(t); e.setDate(t.getDate() - j); if (days[j] === e.toDateString()) s++; else break; } return s; };
    let _convs = USE_MEMORY_DB ? (await memoryDB.getUserConversations(req.user.userId, 100)) : (await Conversation.find({ userId: req.user.userId }).sort({ timestamp: -1 }));
    const _profile = profile || createInitialProfile(req.user.userId);
    _profile.streak = calcStreak(_convs);
  res.json({
    message: 'ELEVARE Backend API',
    version: '1.2.0',
    status: 'running',
    database: USE_MEMORY_DB ? 'in-memory' : 'mongodb',
    features: ['authentication', 'conversations', 'recommendations', 'profiles'],
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
    const calcStreak = (convs) => { if (!convs || convs.length === 0) return 0; const days = [...new Set(convs.map(c => new Date(c.timestamp).toDateString()))]; let s = 0; const t = new Date(); for (let j = 0; j < days.length; j++) { const e = new Date(t); e.setDate(t.getDate() - j); if (days[j] === e.toDateString()) s++; else break; } return s; };
    let _convs = USE_MEMORY_DB ? (await memoryDB.getUserConversations(req.user.userId, 100)) : (await Conversation.find({ userId: req.user.userId }).sort({ timestamp: -1 }));
    const _profile = profile || createInitialProfile(req.user.userId);
    _profile.streak = calcStreak(_convs);
  res.json({
    status: 'healthy',
    database: USE_MEMORY_DB ? 'in-memory' : 'mongodb',
    uptime: process.uptime(),
    users: USE_MEMORY_DB ? memoryDB.users.size : 'N/A',
    timestamp: new Date().toISOString()
  });
});

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, age, education } = req.body;
    
    // Validation
    if (!name || !email || !password || !age || !education) {
      return res.status(400).json({
        success: false,
        error: { message: 'All fields are required' }
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: { message: 'Password must be at least 6 characters long' }
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    let user, profile;

    if (USE_MEMORY_DB) {
      // Check if user exists
      const existingUser = await memoryDB.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: { message: 'User already exists with this email' }
        });
      }

      // Create user
      user = await memoryDB.createUser({
        name,
        email,
        password: hashedPassword,
        age: parseInt(age),
        education
      });

      // Create profile
      profile = await memoryDB.createUserProfile(user._id, createInitialProfile(user._id));
    } else {
      // MongoDB implementation
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: { message: 'User already exists with this email' }
        });
      }

      user = new User({
        name,
        email,
        password: hashedPassword,
        age: parseInt(age),
        education
      });
      await user.save();

      profile = new UserProfile(createInitialProfile(user._id));
      await profile.save();
    }

    // Generate JWT
    const token = jwt.sign(
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
          education: user.education,
          createdAt: user.createdAt
        },
        token
      }
    });
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

    let user;

    if (USE_MEMORY_DB) {
      user = await memoryDB.findUserByEmail(email);
    } else {
      user = await User.findOne({ email });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password' }
      });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password' }
      });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'dev_secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    const calcStreak = (convs) => { if (!convs || convs.length === 0) return 0; const days = [...new Set(convs.map(c => new Date(c.timestamp).toDateString()))]; let s = 0; const t = new Date(); for (let j = 0; j < days.length; j++) { const e = new Date(t); e.setDate(t.getDate() - j); if (days[j] === e.toDateString()) s++; else break; } return s; };
    let _convs = USE_MEMORY_DB ? (await memoryDB.getUserConversations(req.user.userId, 100)) : (await Conversation.find({ userId: req.user.userId }).sort({ timestamp: -1 }));
    const _profile = profile || createInitialProfile(req.user.userId);
    _profile.streak = calcStreak(_convs);
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          age: user.age,
          education: user.education,
          createdAt: user.createdAt
        },
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Profile Routes
app.get('/api/profile', verifyToken, async (req, res) => {
  try {
    let user, profile;
    if (USE_MEMORY_DB) {
      user = await memoryDB.findUserById(req.user.userId);
      profile = await memoryDB.findUserProfile(req.user.userId);
    } else {
      user = await User.findById(req.user.userId);
      profile = await UserProfile.findOne({ userId: req.user.userId });
    }
    if (!user) return res.status(404).json({ success: false, error: { message: 'User not found' } });

    const calcStreak = (convs) => {
      if (!convs || convs.length === 0) return 0;
      const days = [...new Set(convs.map(c => new Date(c.timestamp).toDateString()))];
      let s = 0; const t = new Date();
      for (let j = 0; j < days.length; j++) {
        const e = new Date(t); e.setDate(t.getDate() - j);
        if (days[j] === e.toDateString()) s++; else break;
      }
      return s;
    };
    let _convs = USE_MEMORY_DB
      ? (await memoryDB.getUserConversations(req.user.userId, 100))
      : (await Conversation.find({ userId: req.user.userId }).sort({ timestamp: -1 }));
    const _profile = profile || createInitialProfile(req.user.userId);
    _profile.streak = calcStreak(_convs);

    res.json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email, age: user.age, education: user.education, createdAt: user.createdAt },
        profile: _profile
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
});

// Conversation Routes
app.post('/api/conversations/message', verifyToken, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { message: 'Message is required' }
      });
    }

    let aiResponse, analysis;

    // Try to call AI service first
    try {
      const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      
      // Get conversation history
      let conversationHistory = [];
      if (USE_MEMORY_DB) {
        const userConvs = await memoryDB.getUserConversations(req.user.userId, 5);
        conversationHistory = userConvs.map(c => ([
          { role: 'user', content: c.userMessage },
          { role: 'assistant', content: c.aiResponse }
        ])).flat();
      } else {
        const convs = await Conversation.find({ userId: req.user.userId })
          .sort({ timestamp: -1 })
          .limit(5);
        conversationHistory = convs.reverse().map(c => ([
          { role: 'user', content: c.userMessage },
          { role: 'assistant', content: c.aiResponse }
        ])).flat();
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const aiServiceResponse = await fetch(`${AI_SERVICE_URL}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: req.user.userId,
          message: message,
          conversationHistory: conversationHistory
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (aiServiceResponse.ok) {
        const aiData = await aiServiceResponse.json();
        aiResponse = aiData.response;
        analysis = aiData.analysis;
        console.log('✅ AI Service response received');
      } else {
        throw new Error('AI service returned error');
      }
    } catch (aiError) {
      console.warn('⚠️ AI Service unavailable, using fallback:', aiError.message);
      
      // Fallback response generator
      const generateFallbackResponse = (userMessage) => {
        const responses = [
          "That's really interesting! Can you tell me more about how this makes you feel?",
          "I'd love to understand this better. What impact has this had on your thinking?",
          "Thank you for sharing that. What would you say is the most important part of this experience?",
          "How do you think this connects to your broader goals and interests?",
          "What aspects of this situation energize you the most?"
        ];
        return responses[Math.floor(Math.random() * responses.length)];
      };

      aiResponse = generateFallbackResponse(message);
      
      // Simple analysis fallback
      const analyzeMessage = (msg) => {
        const positiveWords = ['happy', 'excited', 'love', 'enjoy', 'great', 'amazing', 'wonderful', 'good', 'excellent'];
        const negativeWords = ['sad', 'frustrated', 'hate', 'difficult', 'hard', 'challenging', 'bad', 'terrible'];
        const creativityWords = ['create', 'design', 'art', 'music', 'write', 'imagine', 'innovative'];
        const analyticalWords = ['analyze', 'data', 'logic', 'research', 'study', 'calculate', 'solve'];
        
        const words = msg.toLowerCase().split(' ');
        let sentiment = 0;
        let creativity = 0;
        let analytical = 0;

        words.forEach(word => {
          if (positiveWords.includes(word)) sentiment += 0.1;
          if (negativeWords.includes(word)) sentiment -= 0.1;
          if (creativityWords.includes(word)) creativity += 0.1;
          if (analyticalWords.includes(word)) analytical += 0.1;
        });

        return {
          sentiment: Math.max(-1, Math.min(1, sentiment)),
          emotions: {
            joy: Math.max(0, sentiment),
            sadness: Math.max(0, -sentiment),
            engagement: Math.random() * 0.5 + 0.3
          },
          keywords: words.filter(word => word.length > 3).slice(0, 5),
          detectedTraits: {
            creativity: Math.max(0, Math.min(10, 5 + creativity * 10)),
            analyticalThinking: Math.max(0, Math.min(10, 5 + analytical * 10))
          }
        };
      };

      analysis = analyzeMessage(message);
    }

    // Extract detected traits from analysis
    const detectedTraits = {};
    if (analysis.detectedTraits) {
      if (Array.isArray(analysis.detectedTraits)) {
        analysis.detectedTraits.forEach(t => {
          detectedTraits[t.trait] = t.value;
        });
      } else {
        Object.assign(detectedTraits, analysis.detectedTraits);
      }
    }

    // Save conversation
    let conversation, profile;

    if (USE_MEMORY_DB) {
      conversation = await memoryDB.saveConversation({
        userId: req.user.userId,
        userMessage: message,
        aiResponse: aiResponse,
        analysis: analysis
      });

      // Update profile
      profile = await memoryDB.findUserProfile(req.user.userId);
      if (profile) {
        profile.conversationCount = (profile.conversationCount || 0) + 1;
        
        // Update traits from detected traits
        Object.entries(detectedTraits).forEach(([trait, value]) => {
          if (profile.behavioralTraits[trait] !== undefined) {
            profile.behavioralTraits[trait] = Math.min(10, 
              (profile.behavioralTraits[trait] * 0.9) + (value * 0.1)
            );
          }
        });
        
        await memoryDB.updateUserProfile(req.user.userId, profile);
      }
    } else {
      conversation = new Conversation({
        userId: req.user.userId,
        userMessage: message,
        aiResponse: aiResponse,
        analysis: analysis
      });
      await conversation.save();

      // Update profile
      profile = await UserProfile.findOne({ userId: req.user.userId });
      if (profile) {
        profile.conversationCount = (profile.conversationCount || 0) + 1;
        
        // Update traits from detected traits
        Object.entries(detectedTraits).forEach(([trait, value]) => {
          if (profile.behavioralTraits[trait] !== undefined) {
            profile.behavioralTraits[trait] = Math.min(10, 
              (profile.behavioralTraits[trait] * 0.9) + (value * 0.1)
            );
          }
        });
        
        profile.updatedAt = new Date();
        await profile.save();
      }
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
        analysis: {
          sentiment: analysis.sentiment,
          emotions: analysis.emotions,
          keywords: analysis.keywords,
          detectedTraits: Object.entries(detectedTraits).map(([trait, value]) => ({
            trait,
            value: parseFloat(Number(value).toFixed(1))
          }))
        },
        updatedTraits: profile ? Object.fromEntries(
          Object.entries(profile.behavioralTraits).map(([k, v]) => 
            [k, parseFloat(Number(v).toFixed(1))]
          )
        ) : {}
      }
    });
  } catch (error) {
    console.error('Conversation error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

app.get('/api/conversations/history', verifyToken, async (req, res) => {
  try {
    let conversations;

    if (USE_MEMORY_DB) {
      conversations = await memoryDB.getUserConversations(req.user.userId, 20);
    } else {
      conversations = await Conversation.find({ userId: req.user.userId })
        .sort({ timestamp: -1 })
        .limit(20);
    }

    res.json({
      success: true,
      data: {
        conversations: conversations.map(conv => ({
          id: conv._id,
          userMessage: conv.userMessage,
          aiResponse: conv.aiResponse,
          sentiment: conv.analysis?.sentiment || 0,
          timestamp: conv.timestamp
        })),
        total: conversations.length
      }
    });
  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// Recommendations Routes
app.get('/api/recommendations', verifyToken, async (req, res) => {
  try {
    let profile;
    if (USE_MEMORY_DB) {
      profile = await memoryDB.findUserProfile(req.user.userId);
    } else {
      profile = await UserProfile.findOne({ userId: req.user.userId });
    }

    if (!profile || profile.conversationCount < 3) {
      return res.json({ success: true, data: [] });
    }

    const generateRecommendations = (traits) => {
      const careers = [
        { title: 'Software Engineer', match: (traits.analyticalThinking * 0.3 + traits.problemSolving * 0.3 + traits.creativity * 0.2 + traits.adaptability * 0.2) / 10, description: 'Design and develop software applications', skills: ['Programming', 'Problem Solving', 'Logical Thinking'], salary: '$95,000', growth: '22%' },
        { title: 'Product Manager', match: (traits.leadership * 0.3 + traits.communication * 0.3 + traits.analyticalThinking * 0.2 + traits.teamwork * 0.2) / 10, description: 'Guide product development from conception to launch', skills: ['Leadership', 'Communication', 'Strategic Thinking'], salary: '$115,000', growth: '19%' },
        { title: 'UX Designer', match: (traits.creativity * 0.4 + traits.empathy * 0.3 + traits.problemSolving * 0.2 + traits.communication * 0.1) / 10, description: 'Create intuitive and engaging user experiences', skills: ['Design', 'User Research', 'Creativity'], salary: '$85,000', growth: '13%' },
        { title: 'Data Scientist', match: (traits.analyticalThinking * 0.4 + traits.problemSolving * 0.3 + traits.creativity * 0.2 + traits.adaptability * 0.1) / 10, description: 'Analyze complex data to drive business decisions', skills: ['Statistics', 'Programming', 'Critical Thinking'], salary: '$120,000', growth: '31%' },
        { title: 'Marketing Manager', match: (traits.creativity * 0.3 + traits.communication * 0.3 + traits.leadership * 0.2 + traits.adaptability * 0.2) / 10, description: 'Develop and execute marketing strategies', skills: ['Marketing', 'Communication', 'Creativity'], salary: '$75,000', growth: '10%' }
      ];
      return careers
        .map(c => ({ ...c, matchScore: Math.min(0.95, Math.max(0.4, c.match + (Math.random() * 0.1 - 0.05))), confidence: Math.min(0.9, Math.max(0.6, c.match * 0.8 + (Math.random() * 0.1))) }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);
    };

    const recs = generateRecommendations(profile.behavioralTraits);
    res.json({
      success: true,
      data: recs.map(rec => ({
        career: rec.title,
        careerTitle: rec.title,
        matchScore: parseFloat(rec.matchScore.toFixed(2)),
        confidenceScore: parseFloat((rec.matchScore * 100).toFixed(0)),
        confidence: parseFloat(rec.confidence.toFixed(2)),
        description: rec.description,
        reasoning: rec.description,
        requiredSkills: rec.skills,
        matchedTraits: Object.entries(profile.behavioralTraits).sort(([,a],[,b]) => b-a).slice(0,3).map(([k]) => k.replace(/([A-Z])/g, ' $1').trim()),
        averageSalary: rec.salary,
        growthRate: rec.growth
      }))
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
});

app.post('/api/recommendations/generate', verifyToken, async (req, res) => {
  try {
    let profile;

    if (USE_MEMORY_DB) {
      profile = await memoryDB.findUserProfile(req.user.userId);
    } else {
      profile = await UserProfile.findOne({ userId: req.user.userId });
    }
    
    if (!profile || profile.conversationCount < 3) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please have at least 3 conversations before generating recommendations' }
      });
    }

    // Generate recommendations based on traits
    const generateRecommendations = (traits) => {
      const careers = [
        {
          title: 'Software Engineer',
          match: (traits.analyticalThinking * 0.3 + traits.problemSolving * 0.3 + traits.creativity * 0.2 + traits.adaptability * 0.2) / 10,
          description: 'Design and develop software applications and systems',
          skills: ['Programming', 'Problem Solving', 'Logical Thinking'],
          salary: '$95,000',
          growth: '22%'
        },
        {
          title: 'Product Manager',
          match: (traits.leadership * 0.3 + traits.communication * 0.3 + traits.analyticalThinking * 0.2 + traits.teamwork * 0.2) / 10,
          description: 'Guide product development from conception to launch',
          skills: ['Leadership', 'Communication', 'Strategic Thinking'],
          salary: '$115,000',
          growth: '19%'
        },
        {
          title: 'UX Designer',
          match: (traits.creativity * 0.4 + traits.empathy * 0.3 + traits.problemSolving * 0.2 + traits.communication * 0.1) / 10,
          description: 'Create intuitive and engaging user experiences',
          skills: ['Design', 'User Research', 'Creativity'],
          salary: '$85,000',
          growth: '13%'
        },
        {
          title: 'Data Scientist',
          match: (traits.analyticalThinking * 0.4 + traits.problemSolving * 0.3 + traits.creativity * 0.2 + traits.adaptability * 0.1) / 10,
          description: 'Analyze complex data to drive business decisions',
          skills: ['Statistics', 'Programming', 'Critical Thinking'],
          salary: '$120,000',
          growth: '31%'
        },
        {
          title: 'Marketing Manager',
          match: (traits.creativity * 0.3 + traits.communication * 0.3 + traits.leadership * 0.2 + traits.adaptability * 0.2) / 10,
          description: 'Develop and execute marketing strategies',
          skills: ['Marketing', 'Communication', 'Creativity'],
          salary: '$75,000',
          growth: '10%'
        }
      ];

      return careers
        .map(career => ({
          ...career,
          matchScore: Math.min(0.95, Math.max(0.4, career.match + (Math.random() * 0.1 - 0.05))),
          confidence: Math.min(0.9, Math.max(0.6, career.match * 0.8 + (Math.random() * 0.1)))
        }))
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 5);
    };

    const recommendationData = generateRecommendations(profile.behavioralTraits);

    res.json({
      success: true,
      data: {
        recommendations: recommendationData.map(rec => ({
          career: rec.title,
          matchScore: parseFloat(rec.matchScore.toFixed(2)),
          confidence: parseFloat(rec.confidence.toFixed(2)),
          description: rec.description,
          requiredSkills: rec.skills,
          averageSalary: rec.salary,
          growthRate: rec.growth,
          reasoning: {
            strengths: [
              `Strong ${Object.entries(profile.behavioralTraits)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 2)
                .map(([trait]) => trait.replace(/([A-Z])/g, ' $1').toLowerCase())
                .join(' and ')} skills`,
              `Good fit for ${rec.title.toLowerCase()} role requirements`
            ]
          }
        })),
        generatedAt: new Date().toISOString(),
        basedOnConversations: profile.conversationCount
      }
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Internal server error' }
    });
  }
});

// PUT /api/profile — update name/email
app.put('/api/profile', verifyToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ success: false, error: { message: 'Name and email are required' } });

    if (USE_MEMORY_DB) {
      const user = await memoryDB.findUserById(req.user.userId);
      if (!user) return res.status(404).json({ success: false, error: { message: 'User not found' } });
      user.name = name; user.email = email;
      memoryDB.users.set(req.user.userId, user);
    } else {
      await User.findByIdAndUpdate(req.user.userId, { name, email });
    }
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
});

// PUT /api/auth/change-password
app.put('/api/auth/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) return res.status(400).json({ success: false, error: { message: 'Both passwords are required' } });
    if (newPassword.length < 6) return res.status(400).json({ success: false, error: { message: 'New password must be at least 6 characters' } });

    let user;
    if (USE_MEMORY_DB) {
      user = await memoryDB.findUserById(req.user.userId);
    } else {
      user = await User.findById(req.user.userId);
    }
    if (!user) return res.status(404).json({ success: false, error: { message: 'User not found' } });

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return res.status(401).json({ success: false, error: { message: 'Current password is incorrect' } });

    const hashed = await bcrypt.hash(newPassword, 12);
    if (USE_MEMORY_DB) {
      user.password = hashed;
      memoryDB.users.set(req.user.userId, user);
    } else {
      await User.findByIdAndUpdate(req.user.userId, { password: hashed });
    }
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
});

// GET /api/profile/export
app.get('/api/profile/export', verifyToken, async (req, res) => {
  try {
    let user, profile, conversations;
    if (USE_MEMORY_DB) {
      user = await memoryDB.findUserById(req.user.userId);
      profile = await memoryDB.findUserProfile(req.user.userId);
      conversations = await memoryDB.getUserConversations(req.user.userId, 100);
    } else {
      user = await User.findById(req.user.userId).select('-password');
      profile = await UserProfile.findOne({ userId: req.user.userId });
      conversations = await Conversation.find({ userId: req.user.userId }).sort({ timestamp: -1 }).limit(100);
    }
    res.json({
      success: true,
      data: {
        exportedAt: new Date().toISOString(),
        user: { name: user?.name, email: user?.email, age: user?.age, education: user?.education, createdAt: user?.createdAt },
        profile: profile,
        conversations: conversations
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
});

// DELETE /api/auth/account
app.delete('/api/auth/account', verifyToken, async (req, res) => {
  try {
    if (USE_MEMORY_DB) {
      memoryDB.users.delete(req.user.userId);
      memoryDB.userProfiles.delete(req.user.userId);
      memoryDB.conversations.delete(req.user.userId);
    } else {
      await User.findByIdAndDelete(req.user.userId);
      await UserProfile.findOneAndDelete({ userId: req.user.userId });
      await Conversation.deleteMany({ userId: req.user.userId });
    }
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: { message: 'Internal server error' }
  });
});

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
  console.log(`✨ Ready for user registration and full functionality!`);
  
  if (USE_MEMORY_DB) {
    console.log(`⚠️  Note: Using in-memory database - data will be lost on restart`);
  }
});

export default app;
