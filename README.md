# ELEVARE - AI-Driven Career Discovery Platform

> 🚀 **AI system for personalized career recommendations through longitudinal behavioral analysis**

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-green.svg)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Latest-green.svg)](https://fastapi.tiangolo.com/)

[![GitHub Stars](https://img.shields.io/github/stars/Varadha9/ELEVARE?style=social)](https://github.com/Varadha9/ELEVARE/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Varadha9/ELEVARE?style=social)](https://github.com/Varadha9/ELEVARE/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/Varadha9/ELEVARE)](https://github.com/Varadha9/ELEVARE/issues)

[🚀 **Quick Start**](#-quick-start) • [📚 **Documentation**](#-documentation) • [🤝 **Contributing**](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Configuration](#-configuration)
- [Technology Stack](#-technology-stack)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

**ELEVARE** revolutionizes career discovery by replacing traditional one-time assessments with **continuous behavioral analysis** through AI-powered conversations. The platform provides personalized career recommendations based on longitudinal data patterns.

### 🌟 What Makes ELEVARE Special?

- 🤖 **LLM-Powered Conversations** — Groq API (Llama 3.3 70B) for natural, empathetic dialogues
- 📊 **Longitudinal Analysis** — Tracks behavioral patterns over time, not just a single session
- 🧠 **Scientific Foundation** — Built on Big Five personality model and Ikigai framework
- 🎯 **Explainable AI** — Transparent reasoning for every career recommendation
- 🔒 **Privacy-First** — Your data stays secure and private
- 🌙 **Dark Mode** — Full dark/light theme support

---

## ✨ Features

| Feature | Description | Status |
|---------|-------------|--------|
| 🤖 **LLM-Powered AI Coach** | Groq API (Llama 3.3 70B) for intelligent conversations | ✅ Live |
| 📊 **Behavioral Analysis** | 8 traits: creativity, analytical thinking, leadership, etc. | ✅ Live |
| 🧠 **Personality Profiling** | Big Five model (OCEAN) with detailed insights | ✅ Live |
| 🎯 **Ikigai Mapping** | Four-dimensional career framework visualization | ✅ Live |
| 💡 **Smart Recommendations** | Trait-based career matching with confidence scores | ✅ Live |
| 🔍 **NLP Processing** | Emotion detection, sentiment analysis, keyword extraction | ✅ Live |
| 📈 **Progress Tracking** | Real-time analytics and streak tracking | ✅ Live |
| 🔄 **Feedback Loop** | Continuous improvement through user feedback | ✅ Live |
| 📱 **Mobile Responsive** | Works seamlessly on all devices | ✅ Live |
| 🌙 **Dark Mode** | Full dark theme support | ✅ Live |

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
│  - Ikigai Calculation                   │
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

| Software | Version | Download |
|----------|---------|----------|
| **Node.js** | 18+ | [nodejs.org](https://nodejs.org/) |
| **Python** | 3.9+ | [python.org](https://www.python.org/) |
| **MongoDB** | 6+ | [mongodb.com](https://www.mongodb.com/try/download/community) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |

---

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# 1. Clone the repository
git clone https://github.com/Varadha9/ELEVARE.git
cd ELEVARE

# 2. Run automated setup
.\setup.bat          # Windows

# 3. Start all services
.\launch-elevare.bat      # Windows

# 4. Open your browser
# Frontend:   http://localhost:3000
# Backend:    http://localhost:5000
# AI Service: http://localhost:8000
```

### Option 2: Manual Setup

**1. Clone Repository**
```bash
git clone https://github.com/Varadha9/ELEVARE.git
cd ELEVARE
```

**2. Backend Setup**
```bash
cd backend
npm install
copy .env.example .env
# Edit .env with your values
```

**3. Frontend Setup**
```bash
cd ../frontend
npm install
```

**4. AI Services Setup**
```bash
cd ../ai-services
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac
pip install -r requirements.txt
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
```

**5. Database Setup**
```bash
cd ..
mkdir data\db
mongod --dbpath=data/db
```

---

## 📁 Project Structure

```
ELEVARE/
│
├── backend/                        # Node.js Express API
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/               # Business logic
│   │   ├── authController.js
│   │   ├── conversationController.js
│   │   ├── profileController.js
│   │   └── recommendationController.js
│   ├── middleware/
│   │   ├── auth.js                # JWT middleware
│   │   └── validate.js            # Input validation
│   ├── models/                    # MongoDB schemas
│   │   ├── User.js
│   │   ├── UserProfile.js
│   │   ├── Conversation.js
│   │   └── Recommendation.js
│   ├── routes/                    # API endpoints
│   │   ├── authRoutes.js
│   │   ├── conversationRoutes.js
│   │   ├── profileRoutes.js
│   │   └── recommendationRoutes.js
│   ├── utils/
│   │   ├── errorHandler.js
│   │   └── responseFormatter.js
│   ├── server.js                  # Main server (inline routes + memory DB fallback)
│   └── package.json
│
├── frontend/                       # React Application
│   ├── public/
│   │   └── elevare-icon.svg       # App favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── charts/            # Recharts visualizations
│   │   │   │   ├── TraitsRadarChart.jsx
│   │   │   │   ├── PersonalityRadarChart.jsx
│   │   │   │   └── ProgressLineChart.jsx
│   │   │   ├── layout/            # App shell
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   └── ui/                # Reusable UI components
│   │   │       ├── Badge.jsx
│   │   │       ├── Button.jsx
│   │   │       ├── Card.jsx
│   │   │       ├── ConfirmModal.jsx
│   │   │       ├── ErrorBoundary.jsx
│   │   │       ├── Loading.jsx
│   │   │       ├── PageTransition.jsx
│   │   │       ├── Progress.jsx
│   │   │       ├── Skeleton.jsx
│   │   │       ├── Toast.jsx
│   │   │       ├── Tooltip.jsx
│   │   │       └── index.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth state management
│   │   ├── hooks/
│   │   │   ├── useProfile.js      # Profile fetch hook
│   │   │   └── useConversations.js # Conversations fetch hook
│   │   ├── lib/
│   │   │   └── utils.js           # cn() utility
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Reflection.jsx     # AI chat interface
│   │   │   ├── Personality.jsx
│   │   │   ├── Careers.jsx
│   │   │   ├── Ikigai.jsx
│   │   │   ├── ProgressTracking.jsx
│   │   │   ├── Settings.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/
│   │   │   └── api.js             # Axios API client
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── tailwind.config.js
│   └── package.json
│
├── ai-services/                    # Python AI Microservices
│   ├── data/
│   │   └── career_data.py         # Career database
│   ├── prompts/
│   │   └── career_coach_prompts.py
│   ├── services/
│   │   ├── nlp_processor.py       # NLP pipeline
│   │   ├── behavioral_analyzer.py # Trait + Ikigai analysis
│   │   ├── conversational_agent.py # Groq LLM agent
│   │   └── recommendation_engine.py
│   ├── utils/
│   │   ├── database.py            # MongoDB utilities
│   │   ├── llm_client.py          # Groq API client
│   │   ├── logger.py
│   │   └── response_formatter.py
│   ├── main.py                    # FastAPI server
│   └── requirements.txt
│
├── docs/                           # Documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   ├── INSTALLATION.md
│   └── LLM_INTEGRATION.md
│
├── datasets/                       # Career dataset
│   ├── career_dataset.csv
│   └── preprocess_dataset.py
│
├── data/db/                        # MongoDB data directory
├── setup.bat                       # Automated setup script
├── launch-elevare.bat              # Launch all services
├── health-check.bat                # Service health check
├── .gitignore
├── CHANGELOG.md
├── CONTRIBUTING.md
├── LICENSE
├── TROUBLESHOOTING.md
└── README.md
```

---

## 📚 API Documentation

### 🔗 Access Points

| Service | URL |
|---------|-----|
| 🌐 Frontend | http://localhost:3000 |
| 🔌 Backend API | http://localhost:5000 |
| 🤖 AI Service | http://localhost:8000 |

---

### Authentication

**Register**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "age": 22,
  "education": "undergraduate"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "jane@example.com",
  "password": "password123"
}
```

**Change Password**
```http
PUT /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

**Delete Account**
```http
DELETE /api/auth/account
Authorization: Bearer <token>
```

---

### Profile

**Get Profile**
```http
GET /api/profile
Authorization: Bearer <token>
```

**Update Profile**
```http
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Export Data**
```http
GET /api/profile/export
Authorization: Bearer <token>
```

---

### Conversations

**Send Message**
```http
POST /api/conversations/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "I really enjoyed solving that algorithm problem today"
}
```

**Get History**
```http
GET /api/conversations/history
Authorization: Bearer <token>
```

---

### Recommendations

**Get Recommendations**
```http
GET /api/recommendations
Authorization: Bearer <token>
```

**Generate Recommendations**
```http
POST /api/recommendations/generate
Authorization: Bearer <token>
```

---

### Health

```http
GET /health
```

---

## 🔧 Configuration

### Backend (`backend/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elevare
JWT_SECRET=your_super_secure_secret_key_here
JWT_EXPIRE=7d
AI_SERVICE_URL=http://localhost:8000
NODE_ENV=development
USE_MEMORY_DB=false
```

### AI Service (`ai-services/.env`)
```env
MONGODB_URI=mongodb://localhost:27017/elevare
AI_SERVICE_PORT=8000
GROQ_API_KEY=your_groq_api_key_here
```

> Get a free Groq API key at [console.groq.com](https://console.groq.com/keys)

---

## 🛠️ Technology Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, TailwindCSS, Framer Motion, Recharts |
| **Backend** | Node.js, Express, JWT, Bcrypt, express-rate-limit |
| **AI Engine** | Python, FastAPI, Groq API (Llama 3.3 70B), NLTK, TextBlob |
| **Database** | MongoDB, Mongoose |
| **DevOps** | GitHub Actions CI/CD |

---

## 🧪 Testing

```bash
# Backend health
curl http://localhost:5000/health

# AI Service health
curl http://localhost:8000/health

# Frontend
open http://localhost:3000
```

---

## 🚢 Deployment

| Service | Recommended Platform |
|---------|---------------------|
| Frontend | Vercel, Netlify |
| Backend | AWS EC2, Railway, Render |
| AI Service | AWS EC2, Fly.io |
| Database | MongoDB Atlas |

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed instructions.

---

## 📊 Database Collections

| Collection | Purpose |
|------------|---------|
| `users` | Authentication and basic info |
| `userprofiles` | Behavioral traits, personality, Ikigai |
| `conversations` | Chat history with NLP analysis |
| `recommendations` | Career suggestions with feedback |

---

## 🔐 Security

- JWT token authentication
- Bcrypt password hashing (12 rounds)
- Input validation on all endpoints
- Rate limiting (100 req / 15 min)
- CORS configuration
- Helmet security headers

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature` or `fix/issue-description`
3. Make your changes and test thoroughly
4. Commit: `git commit -m "feat: add your feature"`
5. Push: `git push origin feature/your-feature`
6. Open a Pull Request against `main`

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

---

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 👤 Author

**Varadha** — [GitHub](https://github.com/Varadha9)

---

## 🙏 Acknowledgments

- [Big Five Personality Model](https://en.wikipedia.org/wiki/Big_Five_personality_traits)
- [Ikigai Framework](https://en.wikipedia.org/wiki/Ikigai)
- [Groq API](https://groq.com) — Llama 3.3 70B
- NLTK and TextBlob open source libraries
- React and Node.js communities

---

<div align="center">

**Built with ❤️ for students discovering their career path**

⭐ Star this repo if ELEVARE helps you!

</div>
