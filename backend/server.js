import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { body, validationResult } from 'express-validator';
import Razorpay from 'razorpay';
import crypto from 'crypto';

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
      role: { type: String, enum: ['user', 'admin'], default: 'user' },
      trialStartDate: { type: Date, default: Date.now },
      subscriptionStatus: { type: String, enum: ['trial', 'active', 'expired'], default: 'trial' },
      subscriptionEndDate: { type: Date, default: null },
      razorpayOrderId: { type: String, default: null },
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

    // Seed admin user if not exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@elevare.com';
    const adminExists = await User.findOne({ email: adminEmail });
    if (!adminExists) {
      const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin@1234', 12);
      await User.create({ name: 'Admin', email: adminEmail, password: hashed, age: 30, education: 'other', role: 'admin', subscriptionStatus: 'active' });
      console.log(`✅ Admin user created: ${adminEmail}`);
    }
    
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

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parser & Sanitization
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(mongoSanitize());

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: { success: false, error: { message: 'Too many requests, please try again later.' } },
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  skipSuccessfulRequests: true,
  message: { success: false, error: { message: 'Too many authentication attempts, please try again later.' } }
});

app.use('/api/', globalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

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

// Validation helper
const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        details: errors.array().map(e => ({ field: e.path, message: e.msg }))
      }
    });
    return false;
  }
  return true;
};

// Razorpay instance (lazy — only created when keys are present)
const getRazorpay = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) throw new Error('Razorpay keys not configured');
  return new Razorpay({ key_id: keyId, key_secret: keySecret });
};

// Trial check middleware — blocks expired trial users (admins always pass)
const checkSubscription = (req, res, next) => {
  const u = req.user;
  if (!u) return next();
  if (u.role === 'admin') return next();
  // Active subscription — check if it hasn't expired
  if (u.subscriptionStatus === 'active') {
    if (u.subscriptionEndDate && Date.now() > new Date(u.subscriptionEndDate).getTime()) {
      // Mark as expired asynchronously
      if (!USE_MEMORY_DB && User) User.findByIdAndUpdate(u.userId, { subscriptionStatus: 'expired' }).catch(() => {});
      return res.status(403).json({ success: false, error: { message: 'Subscription expired. Please renew.', code: 'TRIAL_EXPIRED' } });
    }
    return next();
  }
  if (u.subscriptionStatus === 'expired') {
    return res.status(403).json({ success: false, error: { message: 'Trial expired. Please subscribe to continue.', code: 'TRIAL_EXPIRED' } });
  }
  // trial — check 7 days
  const trialEnd = new Date(u.trialStartDate).getTime() + 7 * 24 * 60 * 60 * 1000;
  if (Date.now() > trialEnd) {
    return res.status(403).json({ success: false, error: { message: 'Trial expired. Please subscribe to continue.', code: 'TRIAL_EXPIRED' } });
  }
  next();
};

// Admin-only middleware
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, error: { message: 'Admin access required.' } });
  }
  next();
};

// JWT middleware
const verifyToken = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Access denied. No token provided.' }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev_secret');
    // Attach fresh subscription info from DB if available
    if (!USE_MEMORY_DB && User) {
      const dbUser = await User.findById(decoded.userId).select('role trialStartDate subscriptionStatus subscriptionEndDate').lean();
      if (dbUser) {
        decoded.role = dbUser.role;
        decoded.trialStartDate = dbUser.trialStartDate;
        decoded.subscriptionStatus = dbUser.subscriptionStatus;
        decoded.subscriptionEndDate = dbUser.subscriptionEndDate;
      }
    } else if (USE_MEMORY_DB && memoryDB) {
      const dbUser = await memoryDB.findUserById(decoded.userId);
      if (dbUser) {
        decoded.role = dbUser.role || 'user';
        decoded.trialStartDate = dbUser.trialStartDate || dbUser.createdAt;
        decoded.subscriptionStatus = dbUser.subscriptionStatus || 'trial';
        decoded.subscriptionEndDate = dbUser.subscriptionEndDate || null;
      }
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { message: 'Invalid token' }
    });
  }
};

// ── Subscription / Payment Routes ──────────────────────────────────────────

// POST /api/subscription/create-order — creates a Razorpay order for ₹499/month
app.post('/api/subscription/create-order', verifyToken, async (req, res) => {
  try {
    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: 49900, // ₹499 in paise
      currency: 'INR',
      receipt: `order_${req.user.userId}_${Date.now()}`,
      notes: { userId: req.user.userId.toString() }
    });

    // Persist orderId on user so we can verify it later
    if (!USE_MEMORY_DB && User) {
      await User.findByIdAndUpdate(req.user.userId, { razorpayOrderId: order.id });
    } else if (USE_MEMORY_DB && memoryDB) {
      const u = await memoryDB.findUserById(req.user.userId);
      if (u) { u.razorpayOrderId = order.id; memoryDB.users.set(req.user.userId, u); }
    }

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (err) {
    console.error('Create order error:', err.message);
    res.status(500).json({ success: false, error: { message: err.message || 'Failed to create payment order' } });
  }
});

// POST /api/subscription/verify-payment — verifies Razorpay signature and activates subscription
app.post('/api/subscription/verify-payment', verifyToken, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: { message: 'Missing payment fields' } });
    }

    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ success: false, error: { message: 'Payment verification failed' } });
    }

    // Activate subscription for 30 days
    const subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    if (!USE_MEMORY_DB && User) {
      await User.findByIdAndUpdate(req.user.userId, {
        subscriptionStatus: 'active',
        subscriptionEndDate,
        razorpayOrderId: razorpay_order_id
      });
    } else if (USE_MEMORY_DB && memoryDB) {
      const u = await memoryDB.findUserById(req.user.userId);
      if (u) {
        u.subscriptionStatus = 'active';
        u.subscriptionEndDate = subscriptionEndDate;
        memoryDB.users.set(req.user.userId, u);
      }
    }

    res.json({
      success: true,
      message: 'Subscription activated successfully',
      data: { subscriptionStatus: 'active', subscriptionEndDate }
    });
  } catch (err) {
    console.error('Verify payment error:', err.message);
    res.status(500).json({ success: false, error: { message: 'Payment verification error' } });
  }
});

// POST /api/subscription/webhook — Razorpay webhook for async payment events
app.post('/api/subscription/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (webhookSecret) {
      const sig = req.headers['x-razorpay-signature'];
      const expected = crypto.createHmac('sha256', webhookSecret).update(req.body).digest('hex');
      if (sig !== expected) return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(req.body.toString());
    if (event.event === 'payment.captured') {
      const notes = event.payload?.payment?.entity?.notes || {};
      const userId = notes.userId;
      if (userId) {
        const subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        if (!USE_MEMORY_DB && User) {
          await User.findByIdAndUpdate(userId, { subscriptionStatus: 'active', subscriptionEndDate });
        }
      }
    }
    res.json({ received: true });
  } catch (err) {
    console.error('Webhook error:', err.message);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// GET /api/subscription/status — returns current subscription info
app.get('/api/subscription/status', verifyToken, async (req, res) => {
  try {
    let user;
    if (!USE_MEMORY_DB && User) {
      user = await User.findById(req.user.userId).select('subscriptionStatus subscriptionEndDate trialStartDate role').lean();
    } else if (USE_MEMORY_DB && memoryDB) {
      user = await memoryDB.findUserById(req.user.userId);
    }
    if (!user) return res.status(404).json({ success: false, error: { message: 'User not found' } });

    const trialEnd = new Date(user.trialStartDate).getTime() + 7 * 24 * 60 * 60 * 1000;
    const trialDaysLeft = user.subscriptionStatus === 'trial' ? Math.max(0, Math.ceil((trialEnd - Date.now()) / 86400000)) : null;
    const subDaysLeft = user.subscriptionStatus === 'active' && user.subscriptionEndDate
      ? Math.max(0, Math.ceil((new Date(user.subscriptionEndDate).getTime() - Date.now()) / 86400000))
      : null;

    res.json({
      success: true,
      data: {
        subscriptionStatus: user.subscriptionStatus,
        subscriptionEndDate: user.subscriptionEndDate,
        trialDaysLeft,
        subDaysLeft
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
});

// Routes
app.get('/', (req, res) => {
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
  res.json({
    status: 'healthy',
    database: USE_MEMORY_DB ? 'in-memory' : 'mongodb',
    uptime: process.uptime(),
    users: USE_MEMORY_DB ? memoryDB.users.size : 'N/A',
    timestamp: new Date().toISOString()
  });
});

// Auth Routes
app.post('/api/auth/register',
  [
    body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('age').isInt({ min: 13, max: 100 }).withMessage('Age must be between 13 and 100'),
    body('education').isIn(['high_school', 'undergraduate', 'graduate', 'postgraduate', 'other']).withMessage('Invalid education level')
  ],
  async (req, res) => {
  if (!handleValidation(req, res)) return;
  try {
    const { name, email, password, age, education } = req.body;

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
          id: user._id, name: user.name, email: user.email, age: user.age,
          education: user.education, createdAt: user.createdAt,
          role: user.role || 'user', subscriptionStatus: user.subscriptionStatus || 'trial', trialDaysLeft: 7
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

app.post('/api/auth/login',
  [
    body('email').trim().isEmail().withMessage('Valid email required').normalizeEmail(),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
  if (!handleValidation(req, res)) return;
  try {
    const { email, password } = req.body;

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

    const trialEndLogin = new Date(user.trialStartDate || user.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000;
    const trialDaysLeftLogin = (user.subscriptionStatus || 'trial') === 'trial' ? Math.max(0, Math.ceil((trialEndLogin - Date.now()) / 86400000)) : null;
    const subDaysLeftLogin = (user.subscriptionStatus === 'active' && user.subscriptionEndDate)
      ? Math.max(0, Math.ceil((new Date(user.subscriptionEndDate).getTime() - Date.now()) / 86400000)) : null;
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user._id, name: user.name, email: user.email, age: user.age,
          education: user.education, createdAt: user.createdAt,
          role: user.role || 'user', subscriptionStatus: user.subscriptionStatus || 'trial',
          subscriptionEndDate: user.subscriptionEndDate || null,
          trialDaysLeft: trialDaysLeftLogin, subDaysLeft: subDaysLeftLogin
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
    const _convs = USE_MEMORY_DB
      ? (await memoryDB.getUserConversations(req.user.userId, 100))
      : (await Conversation.find({ userId: req.user.userId }).sort({ timestamp: -1 }));
    const _profile = profile || createInitialProfile(req.user.userId);
    _profile.streak = calcStreak(_convs);

    // Compute trial info
    const trialEnd = new Date(user.trialStartDate || user.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000;
    const trialDaysLeft = (user.subscriptionStatus || 'trial') === 'trial' ? Math.max(0, Math.ceil((trialEnd - Date.now()) / 86400000)) : null;
    const subDaysLeft = (user.subscriptionStatus === 'active' && user.subscriptionEndDate)
      ? Math.max(0, Math.ceil((new Date(user.subscriptionEndDate).getTime() - Date.now()) / 86400000)) : null;

    res.json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email, age: user.age, education: user.education, createdAt: user.createdAt,
          role: user.role || 'user', subscriptionStatus: user.subscriptionStatus || 'trial',
          subscriptionEndDate: user.subscriptionEndDate || null,
          trialDaysLeft, subDaysLeft },
        profile: _profile
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
});

// Admin Routes
app.get('/api/admin/users', verifyToken, requireAdmin, async (req, res) => {
  try {
    let users;
    if (USE_MEMORY_DB) {
      users = [...memoryDB.users.values()].map(u => ({ ...u, password: undefined }));
    } else {
      users = await User.find({}).select('-password').lean();
      // Attach conversation count
      for (const u of users) {
        u.conversationCount = await Conversation.countDocuments({ userId: u._id });
        const trialEnd = new Date(u.trialStartDate).getTime() + 7 * 24 * 60 * 60 * 1000;
        u.trialDaysLeft = u.subscriptionStatus === 'trial' ? Math.max(0, Math.ceil((trialEnd - Date.now()) / 86400000)) : null;
      }
    }
    res.json({ success: true, data: users });
  } catch (e) {
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
});

app.get('/api/admin/stats', verifyToken, requireAdmin, async (req, res) => {
  try {
    if (USE_MEMORY_DB) {
      return res.json({ success: true, data: {
        totalUsers: memoryDB.users.size,
        totalConversations: [...memoryDB.conversations.values()].reduce((a, c) => a + c.length, 0),
        trialUsers: [...memoryDB.users.values()].filter(u => u.subscriptionStatus === 'trial').length,
        activeUsers: [...memoryDB.users.values()].filter(u => u.subscriptionStatus === 'active').length,
        expiredUsers: [...memoryDB.users.values()].filter(u => u.subscriptionStatus === 'expired').length,
      }});
    }
    const [totalUsers, totalConversations, trialUsers, activeUsers, expiredUsers] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Conversation.countDocuments(),
      User.countDocuments({ subscriptionStatus: 'trial' }),
      User.countDocuments({ subscriptionStatus: 'active' }),
      User.countDocuments({ subscriptionStatus: 'expired' }),
    ]);
    res.json({ success: true, data: { totalUsers, totalConversations, trialUsers, activeUsers, expiredUsers } });
  } catch (e) {
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
});

app.put('/api/admin/users/:id/subscription', verifyToken, requireAdmin, async (req, res) => {
  try {
    const { subscriptionStatus } = req.body;
    if (!['trial', 'active', 'expired'].includes(subscriptionStatus))
      return res.status(400).json({ success: false, error: { message: 'Invalid status' } });
    if (USE_MEMORY_DB) {
      const u = await memoryDB.findUserById(req.params.id);
      if (!u) return res.status(404).json({ success: false, error: { message: 'User not found' } });
      u.subscriptionStatus = subscriptionStatus;
      memoryDB.users.set(req.params.id, u);
    } else {
      await User.findByIdAndUpdate(req.params.id, { subscriptionStatus });
    }
    res.json({ success: true, message: 'Subscription updated' });
  } catch (e) {
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
});

// Conversation Routes
app.post('/api/conversations/message',
  verifyToken,
  checkSubscription,
  [body('message').trim().isLength({ min: 1, max: 2000 }).withMessage('Message must be 1-2000 characters')],
  async (req, res) => {
  if (!handleValidation(req, res)) return;
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
      conversations = await memoryDB.getUserConversations(req.user.userId, 50);
    } else {
      conversations = await Conversation.find({ userId: req.user.userId })
        .sort({ timestamp: 1 })
        .limit(50);
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
app.get('/api/recommendations', verifyToken, checkSubscription, async (req, res) => {
  try {
    let profile;
    if (USE_MEMORY_DB) {
      profile = await memoryDB.findUserProfile(req.user.userId);
    } else {
      profile = await UserProfile.findOne({ userId: req.user.userId });
    }

    if (!profile || profile.conversationCount < 1) {
      return res.json({ success: true, data: [] });
    }

    // Try AI service first
    try {
      const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const aiRes = await fetch(`${AI_SERVICE_URL}/recommend`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: req.user.userId })
      });
      if (aiRes.ok) {
        const aiData = await aiRes.json();
        const recs = aiData.recommendations || [];
        return res.json({
          success: true,
          data: recs.map(r => ({
            careerTitle:     r.careerTitle,
            category:        r.careerCategory,
            confidenceScore: r.confidenceScore,
            reasoning:       r.explanation?.summary || '',
            matchedTraits:   r.explanation?.matchingTraits || [],
            requiredSkills:  r.careerDetails?.requiredSkills || [],
            averageSalary:   r.careerDetails?.averageSalary || '',
            growthRate:      r.careerDetails?.growthOutlook || '',
          }))
        });
      }
    } catch (aiErr) {
      console.warn('AI service unavailable for recommendations, using fallback');
    }

    // Fallback: simple trait-based scoring
    const traits = profile.behavioralTraits;
    const careers = [
      { title: 'Software Engineer',  match: (traits.analyticalThinking * 0.3 + traits.problemSolving * 0.3 + traits.creativity * 0.2 + traits.adaptability * 0.2) / 10, description: 'Design and develop software applications', skills: ['Programming', 'Problem Solving', 'Logical Thinking'], salary: '$95,000',  growth: '22%' },
      { title: 'Product Manager',    match: (traits.leadership * 0.3 + traits.communication * 0.3 + traits.analyticalThinking * 0.2 + traits.teamwork * 0.2) / 10,        description: 'Guide product development from conception to launch', skills: ['Leadership', 'Communication', 'Strategic Thinking'], salary: '$115,000', growth: '19%' },
      { title: 'UX Designer',        match: (traits.creativity * 0.4 + traits.empathy * 0.3 + traits.problemSolving * 0.2 + traits.communication * 0.1) / 10,             description: 'Create intuitive and engaging user experiences', skills: ['Design', 'User Research', 'Creativity'], salary: '$85,000',  growth: '13%' },
      { title: 'Data Scientist',     match: (traits.analyticalThinking * 0.4 + traits.problemSolving * 0.3 + traits.creativity * 0.2 + traits.adaptability * 0.1) / 10,   description: 'Analyze complex data to drive business decisions', skills: ['Statistics', 'Programming', 'Critical Thinking'], salary: '$120,000', growth: '31%' },
      { title: 'Marketing Manager',  match: (traits.creativity * 0.3 + traits.communication * 0.3 + traits.leadership * 0.2 + traits.adaptability * 0.2) / 10,           description: 'Develop and execute marketing strategies', skills: ['Marketing', 'Communication', 'Creativity'], salary: '$75,000',  growth: '10%' }
    ];
    const recs = careers
      .map(c => ({ ...c, matchScore: Math.min(0.95, Math.max(0.4, c.match + (Math.random() * 0.1 - 0.05))) }))
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
    const topTraits = Object.entries(traits).sort(([,a],[,b]) => b-a).slice(0,3).map(([k]) => k.replace(/([A-Z])/g, ' $1').trim());
    res.json({
      success: true,
      data: recs.map(rec => ({
        careerTitle:     rec.title,
        confidenceScore: parseFloat((rec.matchScore * 100).toFixed(0)),
        reasoning:       rec.description,
        matchedTraits:   topTraits,
        requiredSkills:  rec.skills,
        averageSalary:   rec.salary,
        growthRate:      rec.growth
      }))
    });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ success: false, error: { message: 'Internal server error' } });
  }
});

app.post('/api/recommendations/generate', verifyToken, checkSubscription, async (req, res) => {
  try {
    let profile;

    if (USE_MEMORY_DB) {
      profile = await memoryDB.findUserProfile(req.user.userId);
    } else {
      profile = await UserProfile.findOne({ userId: req.user.userId });
    }
    
    if (!profile || profile.conversationCount < 1) {
      return res.status(400).json({
        success: false,
        error: { message: 'Please have at least 1 conversation before generating recommendations' }
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
