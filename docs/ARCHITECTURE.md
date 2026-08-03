# Architecture

---

## Overview

ELEVARE is a three-tier microservices system. The React frontend communicates with a Node.js/Express backend over REST. The backend delegates all AI and NLP work to a Python/FastAPI service. Both backend services share the same MongoDB database.

```
┌───────────────────────────────────────┐
│   Frontend — React 18 + Vite          │
│   Port 3000 (dev) / 80 (Docker)       │
│   Chat · Dashboard · Analytics        │
└──────────────────┬────────────────────┘
                   │ REST / JSON
┌──────────────────▼────────────────────┐
│   Backend API — Node.js + Express     │
│   Port 5000                           │
│   Auth · Validation · Rate Limiting   │
│   Business Logic · API Gateway        │
└──────────────────┬────────────────────┘
                   │ HTTP
┌──────────────────▼────────────────────┐
│   AI Services — Python + FastAPI      │
│   Port 8000                           │
│   NLP · Behavioral Analysis           │
│   Groq LLM · Recommendations          │
└──────────────────┬────────────────────┘
                   │
┌──────────────────▼────────────────────┐
│   MongoDB — Port 27017                │
│   users · userprofiles                │
│   conversations · recommendations     │
└───────────────────────────────────────┘
```

---

## Frontend

**Stack:** React 18, Vite, TailwindCSS, Framer Motion, Recharts

**Pages (10):**

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page |
| Login | `/login` | Authentication |
| Register | `/register` | Account creation |
| Dashboard | `/dashboard` | Overview, traits, top careers |
| Reflection | `/reflection` | AI chat interface |
| Personality | `/personality` | Big Five radar charts |
| Careers | `/careers` | Career recommendations |
| Ikigai | `/ikigai` | Four-quadrant Ikigai analysis |
| Progress | `/progress` | Trait trends, streaks, calendar |
| Settings | `/settings` | Profile, password, theme, data export |
| Admin | `/admin` | Admin panel (role-protected) |

**Key patterns:**
- JWT stored in `localStorage`, attached to all requests via `api.js` Axios interceptor
- `AuthContext` provides `user`, `token`, `login()`, `logout()` globally
- `ProtectedRoute` — redirects unauthenticated users to `/login`
- `AdminRoute` — checks `user.role === 'admin'`, redirects others to `/dashboard`
- Custom hooks (`useProfile`, `useConversations`) for data fetching with loading/error states
- All pages have loading skeleton, empty state, and error boundary

---

## Backend API

**Stack:** Node.js, Express, Mongoose, JWT, Bcrypt, Helmet

**Security middleware stack (in order):**
1. `helmet()` — security headers (CSP, HSTS, X-Frame-Options, etc.)
2. `cors()` — whitelist-based origin validation via `CORS_ORIGIN` env var
3. Razorpay webhook route — registered **before** `express.json()` to preserve raw Buffer for HMAC verification
4. `express.json({ limit: '1mb' })` — body parser with size limit
5. `mongoSanitize()` — strips `$` and `.` from all inputs to prevent NoSQL injection
6. `globalLimiter` — 100 req / 15 min per IP
7. `authLimiter` — 10 req / 15 min on login/register
8. `verifyToken` — JWT validation on protected routes
9. `express-validator` — field-level input validation

**Startup guards:**
- Server exits with `process.exit(1)` if `JWT_SECRET` is missing or weak (< 32 chars)
- Server exits with `process.exit(1)` if `ADMIN_PASSWORD` is missing or uses the default placeholder

**Routes:**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register user |
| POST | `/api/auth/login` | ❌ | Login |
| PUT | `/api/auth/change-password` | ✅ | Change password (min 8 chars) |
| DELETE | `/api/auth/account` | ✅ | Delete account |
| GET | `/api/profile` | ✅ | Get profile + traits |
| PUT | `/api/profile` | ✅ | Update name/email (email uniqueness enforced) |
| GET | `/api/profile/export` | ✅ | Export all data |
| POST | `/api/conversations/message` | ✅ | Send message, get AI reply |
| GET | `/api/conversations/history` | ✅ | Get chat history |
| GET | `/api/recommendations` | ✅ | Get career recommendations |
| POST | `/api/recommendations/generate` | ✅ | Trigger recommendation generation |
| GET | `/health` | ❌ | Service health check |
| POST | `/api/payment/webhook` | ❌ (raw) | Razorpay webhook (HMAC verified) |

**Fallback strategy:** If the AI service is unavailable, the backend uses a keyword-based NLP fallback and returns a generic response without failing the request.

---

## AI Services

**Stack:** Python, FastAPI, NLTK, TextBlob, Groq API (Llama 3.3 70B)

### NLP Processor (`services/nlp_processor.py`)

Runs on every user message:

```
Raw text
  → lowercase + strip punctuation
  → tokenize (NLTK punkt / punkt_tab for NLTK 3.9+)
  → remove stopwords
  → keyword extraction (top 10)
  → sentiment score (TextBlob polarity: -1 to +1)
  → emotion detection (keyword → emotion mapping from emotion_keywords.json)
  → trait signal detection (keyword → trait mapping)
  → personality signal detection (keyword → OCEAN mapping)
```

Data files are loaded from `ai-services/data/` using `os.path.realpath()` with path traversal protection — filenames are validated to stay within the data directory.

### Behavioral Analyzer (`services/behavioral_analyzer.py`)

Updates user profile using **Exponential Weighted Moving Average (EWMA)**:

```python
# Trait update (scale 0–10)
new_trait = old_trait + (detected_signal - old_trait) * 0.15

# Personality update (scale 0–1)
new_score = old_score + (signal - old_score) * 0.15
```

Recent conversations have more influence than older ones, allowing profiles to evolve naturally over time.

**Ikigai alignment** is recalculated after every conversation:
- `whatYouLove` → high openness + creativity + detected interests
- `whatYouAreGoodAt` → top 3 behavioral traits
- `whatTheWorldNeeds` → empathy + leadership + communication
- `whatYouCanBePaidFor` → analytical + problem-solving + top career skills

### Conversational Agent (`services/conversational_agent.py`)

Builds a context-aware prompt for the Groq LLM:

```
System prompt (career coach persona, personalized to user profile)
  + NLP analysis of current message (sanitized — HTML/script tags stripped)
  + last 5 conversation turns
  → Groq API (Llama 3.3 70B)
  → empathetic, focused follow-up question
```

All user-controlled values (message, sentiment, emotions, keywords, traits) are sanitized via `_sanitize()` before being embedded in the LLM context string to prevent prompt injection / XSS.

**Retry logic:** 3 attempts with exponential backoff. Falls back to a generic response if all attempts fail.

### Recommendation Engine (`services/recommendation_engine.py`)

Scores each career using the composite formula from the paper (Eq. 8):

```
Score(c) = 0.40 × Psych(c) + 0.35 × Ikigai(c) + 0.25 × Market(c)
```

- **Psych(c)** — cosine similarity between user OCEAN vector and career OCEAN profile
- **Ikigai(c)** — mean Jaccard similarity across all 4 Ikigai dimensions
- **Market(c)** — weighted combination of growth rate (40%), salary (35%), LinkedIn demand (25%)
- **Confidence** — `1 - e^(-0.1 × n_sessions)` grows with conversation count

Returns top 5 careers ranked by composite score.

---

## Database

**MongoDB Collections:**

### `users`
```js
{
  name: String,
  email: String (unique, indexed),
  password: String (bcrypt, 12 rounds),
  age: Number,
  education: String,
  role: String ('user' | 'admin'),
  createdAt: Date
}
```

### `userprofiles`
```js
{
  userId: ObjectId (ref: users, unique),
  behavioralTraits: {
    creativity, analyticalThinking, leadership,
    teamwork, communication, problemSolving,
    adaptability, empathy  // all 0–10
  },
  personality: {
    openness, conscientiousness, extraversion,
    agreeableness, neuroticism  // all 0–1
  },
  ikigai: {
    whatYouLove: [String],
    whatYouAreGoodAt: [String],
    whatTheWorldNeeds: [String],
    whatYouCanBePaidFor: [String]
  },
  conversationCount: Number,
  profileCompleteness: Number,
  updatedAt: Date
}
```

### `conversations`
```js
{
  userId: ObjectId,
  userMessage: String,
  aiResponse: String,
  analysis: {
    sentiment: Number,
    emotions: Object,
    keywords: [String],
    detectedTraits: Object
  },
  timestamp: Date
}
```

### `recommendations`
```js
{
  userId: ObjectId,
  careerTitle: String,
  confidenceScore: Number,
  reasoning: String,
  matchedTraits: [String],
  requiredSkills: [String],
  averageSalary: String,
  growthRate: String,
  createdAt: Date
}
```

**Recommended indexes:**
```js
db.users.createIndex({ email: 1 }, { unique: true })
db.userprofiles.createIndex({ userId: 1 }, { unique: true })
db.conversations.createIndex({ userId: 1, timestamp: -1 })
db.recommendations.createIndex({ userId: 1, createdAt: -1 })
```

---

## Data Flow

### Message Processing

```
1.  User sends message → React frontend
2.  Frontend → POST /api/conversations/message (with JWT)
3.  Backend validates token and input
4.  Backend → POST /process on AI service (message + history)
5.  AI service:
      a. NLP analysis (sentiment, emotions, traits) — user input sanitized
      b. Fetch user profile from MongoDB
      c. Update traits with EWMA
      d. Update personality
      e. Recalculate Ikigai
      f. Save updates to MongoDB
      g. Call Groq LLM → generate response
6.  AI service → Backend (response + analysis + updated traits)
7.  Backend saves conversation to MongoDB
8.  Backend → Frontend (AI message + analysis data)
9.  Frontend displays message and updates trait visualizations
```

### Recommendation Flow

```
1.  User clicks "Generate Recommendations"
2.  Frontend → POST /api/recommendations/generate
3.  Backend → POST /recommend on AI service
4.  AI service:
      a. Fetch user profile
      b. Score each career (Psych + Ikigai + Market)
      c. Rank top 5 careers
      d. Generate explanations
5.  AI service → Backend (ranked recommendations)
6.  Backend → Frontend (recommendations with scores)
```

---

## Security Model

| Layer | Controls |
|-------|---------|
| Startup | `process.exit(1)` if JWT_SECRET or ADMIN_PASSWORD missing/weak |
| Network | CORS whitelist, HTTPS in production |
| API | Rate limiting (global + per endpoint), Helmet headers |
| Input | express-validator + mongoSanitize + HTML sanitization in AI context |
| Auth | JWT (HS256, 7-day expiry), bcrypt (12 rounds) |
| Files | Path traversal protection on all data file reads |
| Payments | Razorpay HMAC signature verification on raw webhook body |
| Logs | Log level sanitized before use in filenames |

---

## Scalability Notes

The architecture is stateless at the API layer — JWT tokens carry auth state, so multiple backend instances can run behind a load balancer without session sharing.

The AI service is the most resource-intensive component (LLM calls, ~2–4s per request). It can be scaled independently of the backend.

For higher traffic:
- Add Redis for caching profile data and recommendations
- Use MongoDB Atlas auto-scaling
- Add a queue (e.g. BullMQ) for LLM processing to avoid request timeouts under load
