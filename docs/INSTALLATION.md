# ELEVARE - Installation & Setup Guide

## 🎯 Quick Start (5 Minutes)

```bash
# Clone and setup
git clone https://github.com/Varadha9/ELEVARE.git
cd ELEVARE
.\setup.bat

# Start all services
.\launch-elevare.bat

# Access application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# AI Service: http://localhost:8000
```

## 📋 Prerequisites Checklist

### Required Software
- [ ] **Node.js 18+** - [Download](https://nodejs.org/)
- [ ] **Python 3.9+** - [Download](https://python.org/)
- [ ] **MongoDB 6+** - [Download](https://mongodb.com/try/download/community)
- [ ] **Git** - [Download](https://git-scm.com/)

### System Requirements
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 2GB free space
- **Network**: Internet connection for dependencies

### Verification Commands
```bash
node --version    # Should show v18.0.0 or higher
python --version  # Should show 3.9.0 or higher
mongod --version  # Should show 6.0.0 or higher
git --version     # Should show 2.0.0 or higher
```

## 🚀 Detailed Installation

### Step 1: Repository Setup
```bash
# Clone repository
git clone https://github.com/Varadha9/ELEVARE.git
cd ELEVARE

# Verify project structure
dir  # Windows
ls   # Linux/Mac
```

### Step 2: Backend Configuration
```bash
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env  # Windows
cp .env.example .env    # Linux/Mac

# Edit .env file with your settings
```

**Backend Environment Variables (`backend/.env`):**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/elevare

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_change_this
JWT_EXPIRE=7d

# AI Service Integration
AI_SERVICE_URL=http://localhost:8000

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### Step 3: Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Verify installation
npm list react
```

**Frontend Configuration (Optional):**
Create `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=ELEVARE
VITE_APP_VERSION=1.0.0
```

### Step 4: AI Services Setup
```bash
cd ../ai-services

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate     # Windows
source venv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('vader_lexicon')"
```

**AI Services Environment Variables (`ai-services/.env`):**
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/elevare

# Service Configuration
AI_SERVICE_PORT=8000
AI_SERVICE_HOST=0.0.0.0

# LLM Configuration (Optional)
OPENAI_API_KEY=your_openai_key_here
HUGGINGFACE_API_KEY=your_hf_key_here

# Logging
LOG_LEVEL=INFO
```

### Step 5: Database Setup
```bash
# Create data directory
cd ..
mkdir data\db     # Windows
mkdir -p data/db  # Linux/Mac

# Start MongoDB (in separate terminal)
mongod --dbpath ./data/db

# Verify MongoDB connection
mongo --eval "db.adminCommand('ismaster')"
```

## ▶️ Running the Application

### Option 1: Automated Start (Recommended)
```bash
# First time setup
.\setup.bat

# Start all services
.\launch-elevare.bat

# Health check
.\health-check.bat
```

### Option 2: Manual Start

**Terminal 1 - MongoDB:**
```bash
mongod --dbpath ./data/db --port 27017
```

**Terminal 2 - Backend API:**
```bash
cd backend
npm run dev
# Server running on http://localhost:5000
```

**Terminal 3 - AI Services:**
```bash
cd ai-services
venv\Scripts\activate     # Windows
source venv/bin/activate  # Linux/Mac
python main.py
# AI Service running on http://localhost:8000
```

**Terminal 4 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend running on http://localhost:3000
```

## 🧪 Verification & Testing

### Health Checks
```bash
# Backend health
curl http://localhost:5000/health

# AI Service health
curl http://localhost:8000/health

# Frontend (open in browser)
http://localhost:3000
```

### Test User Registration
```bash
# Test registration endpoint
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "age": 22,
    "education": "undergraduate"
  }'
```

### Database Verification
```bash
# Connect to MongoDB
mongo elevare

# Check collections
show collections

# Verify user creation
db.users.find().pretty()
```

## 🔧 Troubleshooting

### Common Issues

**Port Already in Use:**
```bash
# Find process using port
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Linux/Mac

# Kill process
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                # Linux/Mac
```

**MongoDB Connection Failed:**
```bash
# Check MongoDB status
net start MongoDB            # Windows
sudo systemctl status mongod # Linux
brew services list | grep mongodb  # Mac

# Restart MongoDB
net stop MongoDB && net start MongoDB  # Windows
sudo systemctl restart mongod         # Linux
brew services restart mongodb         # Mac
```

**Python Virtual Environment Issues:**
```bash
# Recreate virtual environment
rm -rf venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

**Node.js Dependencies Issues:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Performance Optimization

**MongoDB Indexing:**
```javascript
// Connect to MongoDB and create indexes
use elevare

// User indexes
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "createdAt": 1 })

// Profile indexes
db.userprofiles.createIndex({ "userId": 1 }, { unique: true })
db.userprofiles.createIndex({ "lastUpdated": 1 })

// Conversation indexes
db.conversations.createIndex({ "userId": 1, "timestamp": -1 })
db.conversations.createIndex({ "timestamp": -1 })

// Recommendation indexes
db.recommendations.createIndex({ "userId": 1, "createdAt": -1 })
```

**Memory Optimization:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Python memory optimization
export PYTHONOPTIMIZE=1
```

## 🔐 Security Setup

### JWT Secret Generation
```bash
# Generate secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Environment Security
```bash
# Set proper file permissions
chmod 600 backend/.env      # Linux/Mac
chmod 600 ai-services/.env  # Linux/Mac

# Windows: Right-click → Properties → Security → Advanced
```

### Database Security
```javascript
// Create MongoDB admin user
use admin
db.createUser({
  user: "elevare_admin",
  pwd: "secure_password_here",
  roles: ["readWriteAnyDatabase", "dbAdminAnyDatabase"]
})

// Enable authentication in mongod.conf
security:
  authorization: enabled
```

## 📊 Monitoring & Logging

### Application Logs
```bash
# Backend logs
tail -f backend/logs/app.log

# AI Service logs
tail -f ai-services/logs/ai.log

# MongoDB logs
tail -f /var/log/mongodb/mongod.log  # Linux
tail -f /usr/local/var/log/mongodb/mongo.log  # Mac
```

### Performance Monitoring
```bash
# System resources
htop          # Linux/Mac
taskmgr       # Windows

# MongoDB performance
mongostat
mongotop

# Node.js performance
npm install -g clinic
clinic doctor -- node server.js
```

## 🚀 Production Deployment

### Environment Preparation
```bash
# Set production environment
export NODE_ENV=production
export PYTHONENV=production

# Install production dependencies only
npm ci --only=production
pip install -r requirements.txt --no-dev
```

### Build Optimization
```bash
# Frontend production build
cd frontend
npm run build

# Backend optimization
cd ../backend
npm run build  # If build script exists

# AI Services optimization
cd ../ai-services
python -m compileall .
```

### Docker Deployment (Optional)
```dockerfile
# Dockerfile example for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📚 Additional Resources

### Documentation Links
- [API Documentation](./API.md)
- [Architecture Guide](./ARCHITECTURE.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Troubleshooting Guide](../TROUBLESHOOTING.md)

### Community Support
- [GitHub Issues](https://github.com/Varadha9/ELEVARE/issues)
- [Discussions](https://github.com/Varadha9/ELEVARE/discussions)
- [Wiki](https://github.com/Varadha9/ELEVARE/wiki)

### Development Tools
- [Postman Collection](./postman/ELEVARE.postman_collection.json)
- [VS Code Extensions](./.vscode/extensions.json)
- [Git Hooks](./scripts/git-hooks/)

---

**🎉 Congratulations! ELEVARE is now ready for development and testing.**

**Next Steps:**
1. Create your first user account
2. Start a conversation with the AI agent
3. Explore the dashboard analytics
4. Review the API documentation
5. Begin customizing for your needs