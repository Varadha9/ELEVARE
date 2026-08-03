# Project Overview

---

## What is ELEVARE?

ELEVARE is an AI-driven career discovery platform that replaces one-time career quizzes with **continuous behavioral analysis** through daily AI conversations. Over weeks and months, it builds a deep understanding of who you are — your personality, strengths, and values — and maps that to real career paths using the **Big Five (OCEAN) model** and the **Ikigai framework**.

```
You talk to the AI  →  AI learns your patterns  →  You get personalized career recommendations
       daily              over weeks/months               with transparent reasoning
```

---

## Research Foundation

### Psychological Models

- **Big Five Personality Model (OCEAN):** Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism — the most empirically validated personality framework in psychology
- **Ikigai Framework:** Japanese concept for life purpose — the intersection of what you love, what you're good at, what the world needs, and what you can be paid for
- **Behavioral Trait Analysis:** 8 core traits tracked longitudinally: creativity, analytical thinking, leadership, teamwork, communication, problem-solving, adaptability, empathy

### Technical Innovation

- **Longitudinal Analysis:** Behavioral patterns tracked over time using EWMA (Exponential Weighted Moving Average), not just a single session
- **Hybrid NLP Pipeline:** NLTK + TextBlob for fast local analysis, Groq LLM (Llama 3.3 70B) for empathetic, context-aware responses
- **Composite Recommendation Scoring:** Psychometric match (40%) + Ikigai alignment (35%) + Market viability (25%)
- **Explainable AI:** Every recommendation includes a confidence score, component breakdown, and human-readable reasoning

### Academic Citation

```bibtex
@article{shinde2025elevare,
  title   = {An NLP-Driven Ikigai-Based Career Recommendation Model
             Using Psychometric and Market Data},
  author  = {Shinde, Tanmay and Poonawala, Ibrahim and
             Mandhare, Varad Vikas and Bhujbal, Pallavi},
  journal = {IEEE Access},
  year    = {2025},
  url     = {https://github.com/Varadha9/ELEVARE}
}
```

---

## Architecture Summary

Three-tier microservices:

| Layer | Stack | Port |
|-------|-------|------|
| Frontend | React 18, Vite, TailwindCSS, Framer Motion, Recharts | 3000 |
| Backend API | Node.js, Express, JWT, Bcrypt, Helmet, Mongoose | 5000 |
| AI Services | Python, FastAPI, NLTK, TextBlob, Groq API | 8000 |
| Database | MongoDB 6+ | 27017 |

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full system design and data flow.

---

## Features

| Feature | Description |
|---------|-------------|
| LLM-Powered Coach | Groq API (Llama 3.3 70B) for natural, empathetic career conversations |
| Longitudinal Analysis | Behavioral patterns tracked over time, not just a single session |
| Big Five Personality | Full OCEAN model profiling with radar chart visualization |
| Ikigai Mapping | Four-quadrant career framework: love, skill, need, pay |
| 8 Behavioral Traits | Creativity, analytical thinking, leadership, teamwork, and more |
| Explainable AI | Every recommendation includes confidence score and reasoning |
| Real-time Dashboard | Trait evolution, streak tracking, and progress analytics |
| Dark Mode | Full dark/light theme with smooth transitions |
| Mobile Responsive | Works on all screen sizes |
| Payment Integration | Razorpay subscription (₹499/month) with HMAC-verified webhooks |
| Admin Panel | Role-protected admin dashboard |

---

## Security Highlights

- JWT authentication with configurable expiry (default 7 days)
- Bcrypt password hashing (12 rounds)
- Helmet security headers (CSP, HSTS, X-Frame-Options, etc.)
- MongoDB input sanitization (strips `$` and `.` operators)
- Rate limiting — global (100/15min) + auth endpoints (10/15min)
- CORS whitelist configuration
- Input validation on all endpoints (express-validator)
- Path traversal protection on all file reads
- HTML sanitization on user input before LLM context embedding
- Startup guards — server refuses to start with missing/weak secrets
- Razorpay webhook HMAC verification on raw request body

---

## Project Structure

```
ELEVARE/
├── backend/                    # Node.js Express API
│   ├── controllers/            # Route handlers
│   ├── middleware/
│   │   ├── auth.js             # JWT middleware
│   │   └── validators.js       # Input validation rules
│   ├── models/                 # Mongoose schemas
│   ├── routes/                 # Express routers
│   ├── utils/
│   │   ├── logger.js           # File + console logger
│   │   └── responseFormatter.js
│   └── server.js               # Main server + startup guards
│
├── frontend/                   # React Application
│   └── src/
│       ├── components/
│       │   ├── charts/         # Recharts visualizations
│       │   ├── layout/         # Navbar, Sidebar
│       │   └── ui/             # Reusable components
│       ├── context/            # AuthContext
│       ├── hooks/              # useProfile, useConversations
│       ├── pages/              # 10 pages + Admin
│       └── services/api.js     # Axios client with JWT interceptor
│
├── ai-services/                # Python AI Microservice
│   ├── data/                   # JSON datasets (career, OCEAN, emotion, LinkedIn)
│   ├── prompts/
│   │   └── career_coach_prompts.py  # Dynamic system prompt builder
│   ├── services/
│   │   ├── nlp_processor.py         # Sentiment, emotion, keywords
│   │   ├── behavioral_analyzer.py   # EWMA trait + Ikigai updates
│   │   ├── conversational_agent.py  # Groq LLM integration + sanitization
│   │   └── recommendation_engine.py # Composite scoring (Eq. 8–12)
│   ├── utils/
│   │   ├── database.py         # MongoDB connection with startup validation
│   │   └── llm_client.py       # Groq API client with retry logic
│   └── main.py                 # FastAPI server
│
├── datasets/                   # Research datasets and evaluation scripts
├── docs/                       # Documentation
├── figures/                    # Paper figures
├── docker-compose.yml
├── start.sh                    # One-command startup
└── .env.template               # Environment variable template
```

---

## Recommendation Algorithm

The composite score formula (Paper Eq. 8):

```
Score(c) = 0.40 × Psych(c) + 0.35 × Ikigai(c) + 0.25 × Market(c)
```

Where:
- **Psych(c)** — cosine similarity between user OCEAN vector and career OCEAN profile
- **Ikigai(c)** — mean Jaccard similarity across all 4 Ikigai dimensions
- **Market(c)** — weighted combination of growth rate (40%), salary (35%), LinkedIn demand (25%)
- **Confidence** — `1 - e^(-0.1 × n_sessions)` — grows with number of conversations

---

## Roadmap

### Current (v1.0)
- ✅ Core AI conversation system with Groq LLM
- ✅ Behavioral trait tracking (EWMA)
- ✅ Big Five personality profiling
- ✅ Ikigai framework mapping
- ✅ Composite recommendation engine
- ✅ Web dashboard with analytics
- ✅ Payment integration (Razorpay)
- ✅ Docker deployment

### Near-term
- [ ] Real-time WebSocket chat
- [ ] Mobile application
- [ ] Multi-language support
- [ ] Advanced ML models (deep learning)

### Long-term
- [ ] Career path visualization
- [ ] Mentor matching system
- [ ] Integration with job platforms (LinkedIn, Naukri)
- [ ] Enterprise / institutional tier

---

## Deployment Platforms

| Service | Recommended Platform |
|---------|---------------------|
| Frontend | Vercel / Netlify |
| Backend | Railway / Render |
| AI Service | Railway / Fly.io |
| Database | MongoDB Atlas |

See [DEPLOYMENT.md](./DEPLOYMENT.md) for the full production deployment guide.

---

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines. The project follows conventional commits and requires PRs against `main`.

---

## License

MIT — see [LICENSE](../LICENSE) for details.
