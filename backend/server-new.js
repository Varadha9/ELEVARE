import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Connect to database
connectDB();

// Security middleware
app.use(helmet()); // Set security headers
app.use(mongoSanitize()); // Prevent NoSQL injection

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later.'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
    next();
  });
}

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: '2.0.0'
  });
});

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'ELEVARE Backend API',
    version: '2.0.0',
    status: 'running',
    documentation: '/api-docs',
    health: '/health',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile',
      conversations: '/api/conversations',
      recommendations: '/api/recommendations'
    },
    timestamp: new Date().toISOString()
  });
});

// Import routes
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import conversationRoutes from './routes/conversationRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/recommendations', recommendationRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`,
      statusCode: 404
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation Error',
        details: errors
      }
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      success: false,
      error: {
        message: `${field} already exists`
      }
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid token'
      }
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Token expired'
      }
    });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
});

// Start server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('');
  console.log('🚀 ═══════════════════════════════════════════════════════');
  console.log(`   ELEVARE Backend Server v2.0.0`);
  console.log('   ═══════════════════════════════════════════════════════');
  console.log(`   🌐 Server running on port: ${PORT}`);
  console.log(`   📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   🗄️  Database: MongoDB`);
  console.log(`   🔒 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
  console.log('   ═══════════════════════════════════════════════════════');
  console.log(`   📍 API Base: http://localhost:${PORT}/api`);
  console.log(`   ❤️  Health Check: http://localhost:${PORT}/health`);
  console.log('   ═══════════════════════════════════════════════════════');
  console.log('');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

export default app;
