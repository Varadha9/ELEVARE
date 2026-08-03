# Installation Guide

---

## Prerequisites

| Software | Version | Download |
|----------|---------|---------|
| Node.js | 18+ | https://nodejs.org/ |
| Python | 3.9+ (3.13 supported) | https://python.org/ |
| MongoDB | 6+ | https://mongodb.com/try/download/community |
| Git | Latest | https://git-scm.com/ |

**System requirements:** 4 GB RAM minimum · 2 GB free disk space · Internet connection

Verify your versions:
```bash
node --version    # v18.0.0 or higher
python --version  # 3.9.0 or higher
mongod --version  # 6.0.0 or higher
git --version
```

---

## Quick Start (One Command)

```bash
git clone https://github.com/Varadha9/ELEVARE.git
cd ELEVARE
cp .env.template .env   # fill in GROQ_API_KEY and JWT_SECRET
./start.sh
```

Then open http://localhost:3000

---

## Manual Setup

### 1. Clone & Configure

```bash
git clone https://github.com/Varadha9/ELEVARE.git
cd ELEVARE
cp .env.template .env
```

Edit `.env` and set these required values:

```env
MONGODB_URI=mongodb://localhost:27017/elevare
JWT_SECRET=<generate with: openssl rand -base64 32>
GROQ_API_KEY=<from https://console.groq.com/keys>
```

---

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/elevare
JWT_SECRET=<strong random secret, min 32 chars>
JWT_EXPIRE=7d
AI_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:3000
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

> The server will refuse to start if `JWT_SECRET` is missing or shorter than 32 characters.

Start the backend:
```bash
node server.js
```

---

### 3. AI Services

```bash
cd ai-services
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

pip install -r requirements.txt
```

Edit `ai-services/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/elevare
GROQ_API_KEY=<your Groq API key>
AI_SERVICE_PORT=8000
```

Start the AI service:
```bash
python main.py
```

---

### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

Optionally create `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5000
```

---

### 5. MongoDB

```bash
# Create data directory
mkdir -p data/db

# Start MongoDB (separate terminal)
mongod --dbpath ./data/db
```

---

## Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| AI Service | http://localhost:8000 |

---

## Verify Installation

```bash
# Backend health
curl http://localhost:5000/health

# AI service health
curl http://localhost:8000/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"<your_password>","age":22,"education":"undergraduate"}'
```

---

## MongoDB Indexes (Recommended)

Connect to MongoDB and run once:

```javascript
use elevare

db.users.createIndex({ email: 1 }, { unique: true })
db.userprofiles.createIndex({ userId: 1 }, { unique: true })
db.conversations.createIndex({ userId: 1, timestamp: -1 })
db.recommendations.createIndex({ userId: 1, createdAt: -1 })
```

---

## Troubleshooting

**Port already in use:**
```bash
lsof -i :5000   # Linux/Mac — find the PID
kill -9 <PID>
```

**MongoDB connection failed:**
```bash
# Check if mongod is running
sudo systemctl status mongod   # Linux
brew services list | grep mongodb  # Mac

# Development fallback (data lost on restart)
# Add to backend/.env:
USE_MEMORY_DB=true
```

**Python venv issues:**
```bash
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

**Node.js dependency issues:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**NLTK data missing:**
```bash
python -c "
import nltk
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('stopwords')
"
```

---

## Security Setup

**Generate a strong JWT secret:**
```bash
openssl rand -base64 32
# or
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Set file permissions on .env files (Linux/Mac):**
```bash
chmod 600 backend/.env
chmod 600 ai-services/.env
```

**MongoDB authentication (production):**
```javascript
use admin
db.createUser({
  user: "elevare_admin",
  pwd: "<your_mongo_password>",
  roles: ["readWriteAnyDatabase", "dbAdminAnyDatabase"]
})
```

Then enable auth in `mongod.conf`:
```yaml
security:
  authorization: enabled
```

---

## Next Steps

1. Create your first user account at http://localhost:3000/register
2. Start a conversation with the AI coach
3. Explore the dashboard analytics after a few sessions
4. See [API.md](./API.md) for the full API reference
5. See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
