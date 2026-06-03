# Architecture

---

## Overview

ELEVARE uses a three-tier microservices architecture. The frontend talks to the Node.js backend over REST. The backend delegates all AI work to a separate Python FastAPI service. Both services share the same MongoDB database.

```
┌───────────────────────────────────────┐
│   Frontend — React 18 + Vite          │
│   Port 3000                           │
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
│   Groq LLM · Recommendations         │
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

**Key patterns:**
- JWT stored in `localStorage`, attached to all requests via `api.js` Axios interceptor
- `AuthContext` provides `user`, `token`, `login()`, `logout()` globally
- Custom hooks (`useProfile`, `useConversations`) for data fetching with loading/error states
- All pages have loading skeleton, empty state, and error boundary

---

## Backend API

**Stack:** Node.js, Express, Mongoose, JWT, Bcrypt, Helmet

**Security middleware stack (in order):**
1. `helmet()` — security headers (CSP, HSTS, etc.)
2. `cors()` — whitelist-based origin validation
3. `express.json({ limit: '1mb' })` — body parser with size limit
4. `mongoSanitize()` — strip `$` and `.` from inputs
5. `globalLimiter` — 100 req / 15 min per IP
6. `authLimiter` — 10 req / 15 min on login/register
7. `verifyToken` — JWT validation on protected routes
8. `express-validator` — field-level input validation

**Routes:**

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register user |
| POST | `/api/auth/login` | ❌ | Login |
| PUT | `/api/auth/change-password` | ✅ | Change password |
| DELETE | `/api/auth/account` | ✅ | Delete account |
| GET | `/api/profile` | ✅ | Get profile + traits |
| PUT | `/api/profile` | ✅ | Update name/email |
| GET | `/api/profile/export` | ✅ | Export all data |
| POST | `/api/conversations/message` | ✅ | Send message, get AI reply |
| GET | `/api/conversations/history` | ✅ | Get chat history |
| GET | `/api/recommendations` | ✅ | Get career recommendations |
| POST | `/api/recommendations/generate` | ✅ | Trigger recommendation generation |
| GET | `/health` | ❌ | Service health check |

**Fallback strategy:** If the AI service is unavailable, the backend uses a keyword-based NLP fallback and returns generic responses without failing the request.

---

## AI Services

**Stack:** Python, FastAPI, NLTK, TextBlob, Groq API

### NLP Processor

Runs on every user message:

```
Raw text
  → lowercase + clean
  → tokenize (NLTK punkt)
  → remove stopwords
  → keyword extraction
  → sentiment score (TextBlob polarity: -1 to +1)
  → emotion detection (keyword → emotion mapping)
  → trait signal detection (keyword → trait mapping)
  → personality signal detection (keyword → OCEAN mapping)
```

### Behavioral Analyzer

Updates user profile using **Exponential Weighted Moving Average (EWMA)**:

```python
# Trait update (scale 0–10)
new_trait = old_trait + (detected_signal - old_trait) * learning_rate
# learning_rate = 0.15

# Personality update (scale 0–1)
new_score = old_score + (signal - old_score) * learning_rate
```

This means recent conversations have more influence than older ones, allowing profiles to evolve naturally over time.

**Ikigai alignment** is recalculated after every conversation based on top traits, interests, and personality scores:
- `whatYouLove` → high openness + creativity + detected interests
- `whatYouAreGoodAt` → top 3 behavioral traits
- `whatTheWorldNeeds` → empathy + leadership + communication
- `whatYouCanBePaidFor` → analytical + problem-solving + top career skills

### Conversational Agent

Builds a context-aware prompt for the Groq LLM:

```
System prompt (career coach persona)
  + user's current trait profile
  + last 5 conversation turns
  + NLP analysis of current message
  → Groq API (Llama 3.3 70B)
  → empathetic, focused follow-up question
```

**Retry logic:** 3 attempts with exponential backoff. Falls back to a generic response if all attempts fail.

### Recommendation Engine

Scores each career using a weighted composite:

```
Confidence = (trait_match × 0.4) + (personality_fit × 0.3) + (ikigai_alignment × 0.3)
```

- **Trait match** — cosine similarity between user traits and career trait requirements
- **Personality fit** — dot product of user OCEAN scores and career OCEAN profile
- **Ikigai alignment** — overlap between user Ikigai keywords and career keywords

Returns top 5 careers ranked by confidence score.

---

## Database

**MongoDB Collections:**

### `users`
```js
{
  name: String,
  email: String (unique),
  password: String (bcrypt hash),
  age: Number,
  education: String,
  createdAt: Date
}
```

### `userprofiles`
```js
{
  userId: ObjectId (ref: users),
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
      a. NLP analysis (sentiment, emotions, traits)
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
      b. Score each career (trait + personality + ikigai)
      c. Rank top 5 careers
      d. Generate explanations
5.  AI service → Backend (ranked recommendations)
6.  Backend → Frontend (recommendations with scores)
```

---

## Security Model

| Layer | Controls |
|-------|---------|
| Network | CORS whitelist, HTTPS in production |
| API | Rate limiting (global + per endpoint), Helmet headers |
| Input | express-validator + mongoSanitize |
| Auth | JWT (HS256, 7-day expiry), bcrypt (12 rounds) |
| Data | MongoDB — no raw query exposure, sanitized inputs |

---

## Scalability Notes

The architecture is stateless at the API layer — JWT tokens carry auth state, so multiple backend instances can run behind a load balancer without session sharing.

The AI service is the most resource-intensive component (LLM calls). It can be scaled independently of the backend.

For higher traffic:
- Add Redis for caching profile data and recommendations
- Use MongoDB Atlas auto-scaling
- Add a queue (e.g. Bull/BullMQ) for LLM processing to avoid request timeouts
