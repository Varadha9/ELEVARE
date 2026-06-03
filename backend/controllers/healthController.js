export const healthCheck = async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      services: {}
    };

    // Database check
    if (USE_MEMORY_DB) {
      health.services.database = {
        status: 'healthy',
        type: 'in-memory',
        users: memoryDB.users.size
      };
    } else {
      try {
        await mongoose.connection.db.admin().ping();
        health.services.database = {
          status: 'healthy',
          type: 'mongodb',
          readyState: mongoose.connection.readyState
        };
      } catch (dbError) {
        health.services.database = {
          status: 'unhealthy',
          error: dbError.message
        };
        health.status = 'degraded';
      }
    }

    // AI Service check
    try {
      const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const aiResponse = await fetch(`${AI_SERVICE_URL}/health`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (aiResponse.ok) {
        health.services.aiService = { status: 'healthy' };
      } else {
        health.services.aiService = { status: 'unhealthy' };
        health.status = 'degraded';
      }
    } catch (aiError) {
      health.services.aiService = {
        status: 'unhealthy',
        error: 'AI service unreachable'
      };
      health.status = 'degraded';
    }

    // Memory check
    const memUsage = process.memoryUsage();
    health.memory = {
      heapUsed: Math.round(memUsage.heapUsed / 1024 / 1024) + ' MB',
      heapTotal: Math.round(memUsage.heapTotal / 1024 / 1024) + ' MB',
      rss: Math.round(memUsage.rss / 1024 / 1024) + ' MB'
    };

    const statusCode = health.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(health);
    
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};
