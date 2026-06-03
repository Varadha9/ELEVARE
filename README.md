<div align="center">

<img src="frontend/public/elevare-icon.svg" alt="ELEVARE Logo" width="80" height="80" />

# ELEVARE

### AI-Driven Career Discovery Platform

*Personalized career guidance through longitudinal behavioral analysis*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Python](https://img.shields.io/badge/Python-3.9+-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6+-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)

[![GitHub Stars](https://img.shields.io/github/stars/Varadha9/ELEVARE?style=social)](https://github.com/Varadha9/ELEVARE/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Varadha9/ELEVARE?style=social)](https://github.com/Varadha9/ELEVARE/network/members)
[![GitHub Issues](https://img.shields.io/github/issues/Varadha9/ELEVARE)](https://github.com/Varadha9/ELEVARE/issues)

[Demo](#-demo) · [Quick Start](#-quick-start) · [Documentation](#-documentation) · [Contributing](#-contributing)

</div>

---

## What is ELEVARE?

ELEVARE replaces one-time career quizzes with **continuous behavioral analysis** through daily AI conversations. Over time, it builds a deep understanding of who you are — your personality, strengths, and values — and maps that to real career paths using the **Big Five model** and **Ikigai framework**.

```
You talk to the AI  →  AI learns your patterns  →  You get personalized career recommendations
       daily              over weeks/months               with transparent reasoning
```

---

## Features

| Feature | Description |
|---------|-------------|
| **LLM-Powered Coach** | Groq API (Llama 3.3 70B) for natural, empathetic career conversations |
| **Longitudinal Analysis** | Behavioral patterns tracked over time, not just a single session |
| **Big Five Personality** | Full OCEAN model profiling with radar chart visualization |
| **Ikigai Mapping** | Four-quadrant career framework: love, skill, need, pay |
| **8 Behavioral Traits** | Creativity, analytical thinking, leadership, teamwork, and more |
| **Explainable AI** | Every recommendation includes confidence score and reasoning |
| **Real-time Dashboard** | Trait evolution, streak tracking, and progress analytics |
| **Dark Mode** | Full dark/light theme with smooth transitions |
| **Mobile Responsive** | Works on all screen sizes |

---

## Architecture

```
┌─────────────────────────────────────┐
│   Frontend  (React 18 + Vite)       │
│   Dashboard · Chat · Analytics      │
└────────────────┬────────────────────┘
                 │ REST / JSON
┌────────────────▼────────────────────┐
│   Backend API  (Node.js + Express)  │
│   Auth · Validation · Rate Limiting │
└────────────────┬────────────────────┘
                 │ HTTP
┌────────────────▼────────────────────┐
│   AI Services  (Python + FastAPI)   │
│   NLP · Behavioral Analysis         │
│   Groq LLM · Recommendations        │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│   MongoDB                           │
│   Users · Profiles · Conversations  │
└─────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, TailwindCSS, Framer Motion, Recharts |
| **Backend** | Node.js, Express, JWT, Bcrypt, Helmet, express-rate-limit |
| **AI Engine** | Python, FastAPI, Groq (Llama 3.3 70B), NLTK, TextBlob |
| **Database** | MongoDB, Mongoose |
| **DevOps** | Docker, Docker Compose, GitHub Actions CI/CD |

---

## Quick Start

### One-Command Start (Recommended)

```bash
git clone https://github.com/Varadha9/ELEVARE.git
cd ELEVARE
cp .env.template .env   # fill in GROQ_API_KEY
./start.sh
```

Then open http://localhost:3000

### Manual Setup

#### Prerequisites

| Software | Version |
|----------|---------|
| Node.js | 18+ |
| Python | 3.9+ (3.13 supported) |
| MongoDB | 6+ |
| Git | Latest |

#### 1. Clone & Configure

```bash
git clone https://github.com/Varadha9/ELEVARE.git
cd ELEVARE
cp .env.template .env
```

Edit `.env` and set these required values:

```env
MONGODB_URI=mongodb://localhost:27017/elevare
JWT_SECRET=your_strong_secret_here        # openssl rand -base64 32
GROQ_API_KEY=your_groq_api_key_here       # https://console.groq.com/keys
```

#### 2. Backend

```bash
cd backend
npm install
cp .env.example .env   # fill in your values
node server.js
```

#### 3. AI Services

```bash
cd ai-services
python -m venv venv
source venv/bin/activate        # Linux/Mac
# venv\Scripts\activate         # Windows

pip install -r requirements.txt
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

cp .env.example .env            # add GROQ_API_KEY
python main.py
```

#### 4. Frontend

```bash
cd frontend
npm install
npm run dev
```

#### 5. Open in Browser

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| AI Service | http://localhost:8000 |

---

## Project Structure

```
ELEVARE/
├── backend/                    # Node.js Express API
│   ├── middleware/
│   │   ├── auth.js             # JWT middleware
│   │   └── validators.js       # Input validation
│   ├── models/                 # MongoDB schemas
│   ├── utils/
│   │   └── logger.js           # Production logger
│   └── server.js               # Main server
│
├── frontend/                   # React Application
│   └── src/
│       ├── components/
│       │   ├── charts/         # Recharts visualizations
│       │   ├── layout/         # Navbar, Sidebar
│       │   └── ui/             # Reusable components
│       ├── pages/              # 10 pages
│       ├── context/            # Auth state
│       ├── hooks/              # Custom React hooks
│       └── services/api.js     # Axios client
│
├── ai-services/                # Python AI Microservice
│   ├── services/
│   │   ├── nlp_processor.py       # Sentiment, emotion, keywords
│   │   ├── behavioral_analyzer.py # Trait & Ikigai analysis (EWMA)
│   │   ├── conversational_agent.py # Groq LLM integration
│   │   └── recommendation_engine.py
│   ├── utils/
│   │   └── llm_client.py       # Groq API client with retry logic
│   └── main.py                 # FastAPI server
│
├── docker-compose.yml
├── start.sh                    # One-command startup script
├── .env.template               # All environment variables
└── docs/                       # Full documentation
```

---

## API Reference

### Auth

```http
POST /api/auth/register
POST /api/auth/login
PUT  /api/auth/change-password
DELETE /api/auth/account
```

### Profile

```http
GET  /api/profile
PUT  /api/profile
GET  /api/profile/export
```

### Conversations

```http
POST /api/conversations/message
GET  /api/conversations/history
```

### Recommendations

```http
GET  /api/recommendations
POST /api/recommendations/generate
```

Full API docs → [docs/API.md](docs/API.md)

---

## Environment Variables

### Backend (`backend/.env`)

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/elevare
JWT_SECRET=your_secure_random_secret
JWT_EXPIRE=7d
AI_SERVICE_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_MAX_REQUESTS=100
```

### AI Services (`ai-services/.env`)

```env
MONGODB_URI=mongodb://localhost:27017/elevare
GROQ_API_KEY=your_groq_api_key
AI_SERVICE_PORT=8000
```

Get a free Groq API key → [console.groq.com/keys](https://console.groq.com/keys)

---

## How It Works

### Conversation → Analysis → Profile Update

```
User message
    ↓
NLP Pipeline (NLTK + TextBlob)
  → sentiment score
  → emotion detection
  → keyword extraction
  → trait signals
    ↓
Behavioral Analyzer (EWMA)
  → updates 8 trait scores
  → updates Big Five personality
  → recalculates Ikigai alignment
    ↓
Groq LLM (Llama 3.3 70B)
  → generates empathetic response
  → asks targeted follow-up question
    ↓
Saved to MongoDB
```

### Recommendation Scoring

```
Confidence Score = (trait match × 0.4) + (personality fit × 0.3) + (ikigai alignment × 0.3)
```

---

## Testing

```bash
# Backend tests
cd backend && npm test

# AI service tests
cd ai-services && pytest

# Health checks
curl http://localhost:5000/health
curl http://localhost:8000/health
```

---

## Deployment

| Service | Platform |
|---------|----------|
| Frontend | [Vercel](https://vercel.com) / [Netlify](https://netlify.com) |
| Backend | [Railway](https://railway.app) / [Render](https://render.com) |
| AI Service | [Railway](https://railway.app) / [Fly.io](https://fly.io) |
| Database | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) |

Full deployment guide → [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)

---

## Database Collections

| Collection | Purpose |
|------------|---------|
| `users` | Authentication, basic info |
| `userprofiles` | Behavioral traits, personality, Ikigai |
| `conversations` | Chat history with NLP analysis |
| `recommendations` | Career suggestions with confidence scores |

---

## Security

- JWT authentication with configurable expiry
- Bcrypt password hashing (12 rounds)
- Helmet security headers
- MongoDB input sanitization
- Rate limiting — global (100/15min) + auth endpoints (10/15min)
- CORS whitelist configuration
- Input validation on all endpoints (express-validator)

---

## Documentation

| Document | Description |
|----------|-------------|
| [API Reference](docs/API.md) | Complete API endpoint documentation |
| [Architecture](docs/ARCHITECTURE.md) | System design and data flow |
| [Installation](docs/INSTALLATION.md) | Detailed setup guide |
| [Deployment](docs/DEPLOYMENT.md) | Production deployment guide |
| [LLM Integration](docs/LLM_INTEGRATION.md) | Groq API integration details |
| [Troubleshooting](TROUBLESHOOTING.md) | Common issues and fixes |
| [Contributing](CONTRIBUTING.md) | How to contribute |
| [Changelog](CHANGELOG.md) | Version history |

---

## Contributing

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature`
3. Commit with [conventional commits](https://www.conventionalcommits.org/): `git commit -m "feat: add feature"`
4. Push and open a Pull Request against `main`

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

---

## License

MIT — see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- [Big Five Personality Model](https://en.wikipedia.org/wiki/Big_Five_personality_traits) — OCEAN framework
- [Ikigai Framework](https://en.wikipedia.org/wiki/Ikigai) — Japanese concept for life purpose
- [Groq API](https://groq.com) — Ultra-fast Llama 3.3 70B inference
- [NLTK](https://www.nltk.org/) and [TextBlob](https://textblob.readthedocs.io/) — NLP libraries

---

<div align="center">

Built with ❤️ for students discovering their career path

⭐ Star this repo if ELEVARE helps you!

**Author:** [Varadha](https://github.com/Varadha9)

</div>
