# ELEVARE - AI-Driven Career Discovery Platform

## Overview
ELEVARE is a production-grade AI-powered career discovery system that uses longitudinal behavioral analysis, personality profiling, and the Ikigai framework to provide personalized career recommendations through daily conversational interactions.

## Architecture

### System Layers
```
┌─────────────────────────────────────────┐
│     Presentation Layer (React)          │
│  - Chat Interface                       │
│  - Dashboard & Analytics                │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│   Application Layer (Node.js/Express)   │
│  - REST API                             │
│  - Authentication (JWT)                 │
│  - Business Logic                       │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│    AI Processing Layer (Python)         │
│  - NLP Pipeline                         │
│  - Behavioral Analysis                  │
│  - Personality Modeling                 │
│  - Recommendation Engine                │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│       Data Layer (MongoDB)              │
│  - User Profiles                        │
│  - Conversations                        │
│  - Behavioral Traits                    │
│  - Career Datasets                      │
└─────────────────────────────────────────┘
```

## Technology Stack

- **Frontend**: React 18, Vite, TailwindCSS, Recharts
- **Backend**: Node.js, Express, JWT, Bcrypt
- **AI Services**: Python, FastAPI, Transformers, Scikit-learn, TensorFlow
- **Database**: MongoDB
- **NLP**: Hugging Face Transformers, NLTK, spaCy

## Project Structure

```
ELEVARE/
├── backend/              # Node.js Express API
├── frontend/             # React application
├── ai-services/          # Python AI microservices
├── datasets/             # Kaggle datasets & preprocessing
├── docs/                 # Architecture diagrams & documentation
└── README.md
```

## Features

1. **Daily AI Conversations** - Reflective questions to understand user behavior
2. **Longitudinal Analysis** - Behavioral trait evolution over weeks/months
3. **Personality Profiling** - Big Five personality traits modeling
4. **Ikigai Framework** - Four-dimensional career mapping
5. **ML-Powered Recommendations** - Hybrid recommendation engine
6. **NLP Processing** - Emotion detection, sentiment analysis, intent recognition
7. **Interactive Dashboard** - Visual analytics and career insights
8. **Feedback Loop** - Continuous model improvement

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ ([Download](https://nodejs.org/))
- Python 3.9+ ([Download](https://python.org/))
- MongoDB 6+ ([Download](https://www.mongodb.com/try/download/community))

### ⚡ Automated Setup (Windows)

```bash
# 1. Run setup script (installs all dependencies)
setup.bat

# 2. Configure environment
# Edit backend/.env with your settings

# 3. Start all services
start-all.bat

# 4. Access the application
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
# AI:       http://localhost:8000
```

### 🔧 Manual Setup

**1. Backend Setup**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env file
npm run dev
```

**2. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```

**3. AI Services Setup**
```bash
cd ai-services
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Linux/Mac
pip install -r requirements.txt
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
python main.py
```

**4. Database Setup**
```bash
# Start MongoDB
mongod --dbpath ./data/db

# Optional: Seed career data
cd ai-services
python -c "from data.career_data import CAREER_DATABASE; from pymongo import MongoClient; client = MongoClient('mongodb://localhost:27017/'); db = client['elevare']; db.careers.delete_many({}); db.careers.insert_many(CAREER_DATABASE); print('Database seeded!')"
```

## API Documentation

See `docs/API.md` for complete API reference.

## AI Pipeline

```
User Message
    ↓
NLP Processing (tokenization, preprocessing)
    ↓
Emotion Detection (transformer model)
    ↓
Trait Extraction (keyword matching + ML)
    ↓
Personality Update (Big Five scoring)
    ↓
Ikigai Mapping (4-dimension analysis)
    ↓
Career Scoring (hybrid algorithm)
    ↓
Recommendation Generation
```

## Security

- JWT-based authentication
- Bcrypt password hashing
- Input validation & sanitization
- Rate limiting on API endpoints
- CORS configuration

## Scalability

- Microservices architecture for AI processing
- Horizontal scaling support
- Database indexing for performance
- Caching layer ready

## Research Applications

This platform is suitable for:
- Final year engineering projects
- Research papers on AI-driven career counseling
- Startup MVP/prototype
- Educational technology research

## License

MIT License

## Contributors

Built as a production-grade AI system for career discovery research.
