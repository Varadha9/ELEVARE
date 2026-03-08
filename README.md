# ELEVARE - AI-Driven Career Discovery Platform

> Production-grade AI system for personalized career recommendations through longitudinal behavioral analysis

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://www.mongodb.com/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Technology Stack](#technology-stack)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

ELEVARE is an AI-powered career discovery platform that helps students identify suitable career paths through **longitudinal behavioral analysis**. Unlike traditional career tests that provide instant results, ELEVARE:

- 🤖 Interacts with users daily through an AI conversational agent
- 📊 Analyzes behavioral patterns over weeks/months
- 🧠 Models personality using the Big Five framework
- 🎯 Maps careers using the Ikigai framework
- 💡 Provides explainable, personalized recommendations

**Perfect for:**
- Final year engineering projects
- Research papers
- Startup prototypes
- Educational technology

---

## ✨ Features

### Core Features
- ✅ **Daily AI Conversations** - Reflective questions about interests and activities
- ✅ **Behavioral Analysis** - 8 traits tracked continuously (creativity, analytical thinking, etc.)
- ✅ **Personality Profiling** - Big Five personality model (OCEAN)
- ✅ **Ikigai Framework** - Four-dimensional career mapping
- ✅ **Career Recommendations** - Hybrid ML algorithm with confidence scores
- ✅ **NLP Processing** - Emotion detection, sentiment analysis, keyword extraction
- ✅ **Interactive Dashboard** - Visual analytics and career insights
- ✅ **Feedback Loop** - Continuous model improvement

### Technical Features
- 🔐 JWT Authentication
- 📈 Real-time Analytics
- 🎨 Responsive UI (React + TailwindCSS)
- 🚀 RESTful API
- 💾 MongoDB Database
- 🧪 Production-ready code

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│     Frontend (React + Vite)             │
│  - Chat Interface                       │
│  - Dashboard & Analytics                │
└─────────────────┬───────────────────────┘
                  │ HTTP/REST
┌─────────────────▼───────────────────────┐
│   Backend API (Node.js + Express)       │
│  - Authentication (JWT)                 │
│  - Business Logic                       │
└─────────────────┬───────────────────────┘
                  │ HTTP
┌─────────────────▼───────────────────────┐
│    AI Services (Python + FastAPI)       │
│  - NLP Pipeline                         │
│  - Behavioral Analysis                  │
│  - Recommendation Engine                │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│       Database (MongoDB)                │
│  - Users, Profiles, Conversations       │
│  - Behavioral Traits, Recommendations   │
└─────────────────────────────────────────┘
```

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Download Link |
|----------|---------|---------------|
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) |
| **Python** | 3.9+ | [python.org](https://www.python.org/) |
| **MongoDB** | 6+ | [mongodb.com](https://www.mongodb.com/try/download/community) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Varadha9/ELEVARE.git
cd ELEVARE
```

### 2. Backend Setup
```bash
cd backend
npm install
copy .env.example .env
```

**Edit `backend/.env`:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elevare
JWT_SECRET=your_secret_key_here
AI_SERVICE_URL=http://localhost:8000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. AI Services Setup
```bash
cd ../ai-services
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac
pip install -r requirements.txt
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

### 5. Create MongoDB Data Directory
```bash
cd ..
mkdir data\db                  # Windows
# mkdir -p data/db             # Linux/Mac
```

---

## ▶️ Running the Application

### Option 1: Automated Start (Windows)
```bash
.\setup.bat          # First time only
.\start-all.bat      # Start all services
```

### Option 2: Manual Start

**Terminal 1 - MongoDB:**
```bash
mongod --dbpath ./data/db
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - AI Services:**
```bash
cd ai-services
venv\Scripts\activate
python main.py
```

**Terminal 4 - Frontend:**
```bash
cd frontend
npm run dev
```

### Access the Application
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **AI Service:** http://localhost:8000

---

## 📁 Project Structure

```
ELEVARE/
│
├── backend/                    # Node.js Express API
│   ├── config/                # Database configuration
│   ├── controllers/           # Business logic
│   ├── models/                # MongoDB schemas
│   ├── routes/                # API endpoints
│   ├── middleware/            # Auth & validation
│   ├── server.js              # Main server file
│   └── package.json
│
├── frontend/                   # React Application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Chat.jsx       # Chat interface
│   │   │   └── Dashboard.jsx  # Analytics dashboard
│   │   ├── pages/             # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Home.jsx
│   │   ├── context/           # State management
│   │   ├── services/          # API client
│   │   └── App.jsx
│   ├── index.html
│   └── package.json
│
├── ai-services/                # Python AI Microservices
│   ├── services/
│   │   ├── nlp_processor.py           # NLP pipeline
│   │   ├── behavioral_analyzer.py     # Trait analysis
│   │   ├── conversational_agent.py    # AI agent
│   │   └── recommendation_engine.py   # Career matching
│   ├── data/
│   │   └── career_data.py     # Career database
│   ├── utils/
│   │   └── database.py        # DB utilities
│   ├── main.py                # FastAPI server
│   └── requirements.txt
│
├── docs/                       # Documentation
│   ├── API.md                 # API reference
│   ├── ARCHITECTURE.md        # System design
│   └── DEPLOYMENT.md          # Deployment guide
│
├── datasets/                   # Dataset preprocessing
│   └── README.md
│
├── setup.bat                   # Setup script
├── start-all.bat              # Start all services
├── .gitignore
└── README.md                  # This file
```

---

## 📚 API Documentation

### Authentication

**Register:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "age": 22,
  "education": "undergraduate"
}
```

**Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Conversations

**Send Message:**
```http
POST /api/conversations/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "I enjoyed coding today"
}
```

### Profile

**Get User Profile:**
```http
GET /api/profile
Authorization: Bearer <token>
```

### Recommendations

**Generate Recommendations:**
```http
POST /api/recommendations/generate
Authorization: Bearer <token>
```

**Complete API documentation:** See `docs/API.md`

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Recharts** - Data visualization
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing

### AI Services
- **Python 3.9+** - Programming language
- **FastAPI** - API framework
- **NLTK** - Natural language processing
- **TextBlob** - Sentiment analysis
- **NumPy** - Numerical computing
- **PyMongo** - MongoDB client

---

## 🎓 Usage Guide

### First Time User

1. **Register** - Create a new account
2. **Login** - Access your dashboard
3. **Start Chatting** - Answer daily reflective questions
4. **View Dashboard** - See your behavioral traits evolve
5. **Get Recommendations** - After 10+ conversations
6. **Provide Feedback** - Help improve recommendations

### Daily Workflow

1. Open ELEVARE
2. Chat with AI agent (5-10 minutes)
3. Answer reflective questions honestly
4. View updated analytics
5. Track your trait evolution

---

## 🔧 Configuration

### Backend Configuration (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elevare
JWT_SECRET=change_this_secret_key
JWT_EXPIRE=7d
AI_SERVICE_URL=http://localhost:8000
NODE_ENV=development
```

### AI Service Configuration (`ai-services/.env`)
```env
MONGODB_URI=mongodb://localhost:27017/elevare
AI_SERVICE_PORT=8000
```

---

## 🧪 Testing

### Test Backend
```bash
curl http://localhost:5000/health
```

### Test AI Service
```bash
curl http://localhost:8000/health
```

### Test Frontend
Open http://localhost:3000 in browser

---

## 🚢 Deployment

### Production Deployment Options

1. **Frontend:** Vercel, Netlify
2. **Backend:** AWS EC2, Heroku, DigitalOcean
3. **AI Service:** AWS EC2 (with GPU optional)
4. **Database:** MongoDB Atlas

**See `docs/DEPLOYMENT.md` for detailed instructions**

---

## 📊 Database Schema

### Collections

- **users** - User authentication and profile
- **userprofiles** - Behavioral traits, personality, Ikigai
- **conversations** - Chat history with analysis
- **recommendations** - Career suggestions with feedback
- **careers** - Career database (50+ careers)

---

## 🔐 Security Features

- ✅ JWT token authentication
- ✅ Bcrypt password hashing (12 rounds)
- ✅ Input validation
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configuration
- ✅ SQL injection prevention

---

## 📈 Performance

- **Response Time:** < 500ms average
- **Scalability:** Horizontal scaling ready
- **Database:** Indexed for performance
- **Caching:** Model and data caching

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Varadha** - [GitHub](https://github.com/Varadha9)

---

## 🙏 Acknowledgments

- Big Five Personality Model
- Ikigai Framework
- NLTK and TextBlob libraries
- React and Node.js communities

---

## 📞 Support

For issues and questions:
- **GitHub Issues:** [Create an issue](https://github.com/Varadha9/ELEVARE/issues)
- **Documentation:** Check `docs/` folder
- **Email:** support@elevare.com

---

## 🎯 Roadmap

- [ ] Multi-language support
- [ ] Mobile application
- [ ] Advanced ML models
- [ ] Real-time WebSocket chat
- [ ] Career path visualization
- [ ] Mentor matching system

---

## 📸 Screenshots

### Chat Interface
![Chat Interface](screenshots/chat.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Recommendations
![Recommendations](screenshots/recommendations.png)

---

## ⚡ Quick Start Summary

```bash
# 1. Install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ../ai-services && pip install -r requirements.txt

# 2. Configure environment
# Edit backend/.env with your settings

# 3. Start services
.\start-all.bat  # Windows
# Or start each service manually

# 4. Access application
# http://localhost:3000
```

---

**Built with ❤️ for career discovery and personal development**

**⭐ Star this repo if you find it helpful!**
