# API Reference

ELEVARE uses one external API (Groq) and two internal REST APIs (Backend + AI Service).

---

## External APIs

### Groq API (LLM)

**Purpose:** Intelligent conversational AI for career coaching

**Provider:** Groq · **Model:** Llama 3.3 70B Versatile  
**Endpoint:** `POST https://api.groq.com/openai/v1/chat/completions`

**Configuration:**
```env
# ai-services/.env
GROQ_API_KEY=<your key from https://console.groq.com/keys>
```

**Request format:**
```json
{
  "model": "llama-3.3-70b-versatile",
  "messages": [
    {"role": "system", "content": "You are ELEVARE Career Coach..."},
    {"role": "user", "content": "I enjoy coding"}
  ],
  "max_tokens": 500,
  "temperature": 0.7
}
```

**Response format:**
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "That's great! What kind of coding projects do you find most engaging?"
      }
    }
  ]
}
```

**Pricing:**
- Free tier: 30 requests/minute
- Paid tier: ~$0.59 / 1M input tokens · ~$0.79 / 1M output tokens

**Docs:** https://console.groq.com/docs · **Get key:** https://console.groq.com/keys

---

### MongoDB

**Purpose:** NoSQL database for users, profiles, conversations, recommendations

**Configuration:**
```env
# Local
MONGODB_URI=mongodb://localhost:27017/elevare
# Atlas (production)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/elevare
```

**Collections:** `users` · `userprofiles` · `conversations` · `recommendations` · `careers`

**Pricing:** Free (self-hosted) · MongoDB Atlas free M0 tier (512 MB)

---

## Backend REST API

**Base URL:** `http://localhost:5000` (dev) · `https://your-backend.com` (prod)

All protected endpoints require:
```http
Authorization: Bearer <jwt_token>
```

---

### Authentication

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "<your_password>",
  "age": 22,
  "education": "undergraduate"
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

**Validation:** password min 8 chars, uppercase + lowercase + number required.

---

#### Login User

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "<your_password>"
}
```

---

#### Change Password

```http
PUT /api/auth/change-password
Authorization: Bearer <token>

{
  "currentPassword": "<current_password>",
  "newPassword": "<new_password>"
}
```

---

#### Delete Account

```http
DELETE /api/auth/account
Authorization: Bearer <token>
```

---

### Profile

#### Get Profile

```http
GET /api/profile
Authorization: Bearer <token>
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "behavioralTraits": {
      "creativity": 75,
      "analyticalThinking": 80,
      "leadership": 60,
      "teamwork": 70,
      "communication": 65,
      "problemSolving": 78,
      "adaptability": 60,
      "empathy": 63
    },
    "personality": {
      "openness": 0.72,
      "conscientiousness": 0.68,
      "extraversion": 0.55,
      "agreeableness": 0.70,
      "neuroticism": 0.32
    },
    "ikigai": {
      "whatYouLove": ["technology", "problem-solving"],
      "whatYouAreGoodAt": ["programming", "analysis"],
      "whatTheWorldNeeds": ["innovation"],
      "whatYouCanBePaidFor": ["software development"]
    }
  }
}
```

---

#### Update Profile

```http
PUT /api/profile
Authorization: Bearer <token>

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

Email uniqueness is enforced — returns `409` if the email is already taken by another user.

---

#### Export User Data

```http
GET /api/profile/export
Authorization: Bearer <token>
```

Returns all user data including profile and up to 100 conversations.

---

### Conversations

#### Send Message

```http
POST /api/conversations/message
Authorization: Bearer <token>

{
  "message": "I really enjoy solving complex coding problems"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "response": "That's great! What kind of coding projects do you find most engaging?",
    "analysis": {
      "sentiment": "positive",
      "emotions": [{"emotion": "joy", "score": 0.85}],
      "keywords": ["coding", "problems", "solving"],
      "detectedTraits": {
        "analyticalThinking": 5,
        "problemSolving": 3
      }
    },
    "traitUpdates": {
      "analyticalThinking": 7.3,
      "problemSolving": 7.9
    }
  }
}
```

---

#### Get Conversation History

```http
GET /api/conversations/history?limit=20
Authorization: Bearer <token>
```

---

### Recommendations

#### Generate Recommendations

```http
POST /api/recommendations/generate
Authorization: Bearer <token>
```

Requires at least 1 conversation. Triggers the AI service composite scoring pipeline.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "careerTitle": "Software Engineer",
        "confidenceScore": 87,
        "componentScores": {
          "psychometric": 0.82,
          "ikigaiAlignment": 0.75,
          "marketViability": 0.91
        },
        "reasoning": "Strong analytical and problem-solving traits",
        "requiredSkills": ["Python", "JavaScript", "Problem Solving"]
      }
    ]
  }
}
```

---

#### Get All Recommendations

```http
GET /api/recommendations
Authorization: Bearer <token>
```

---

#### Submit Feedback

```http
POST /api/recommendations/:id/feedback
Authorization: Bearer <token>

{
  "interested": true,
  "rating": 5
}
```

---

### Health

```http
GET /health
```

Returns `healthy` (200) or `degraded` (503).

---

## AI Service API

**Base URL:** `http://localhost:8000`

These endpoints are called by the backend — not directly by the frontend.

---

#### Process Message

```http
POST /process
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "message": "I enjoy helping people",
  "conversationHistory": [
    {"role": "user", "content": "I like coding"},
    {"role": "assistant", "content": "What kind of coding?"}
  ]
}
```

**Response:**
```json
{
  "response": "That's wonderful! Helping others is a valuable trait...",
  "analysis": {
    "emotions": [{"emotion": "joy", "score": 0.85}],
    "sentiment": "positive",
    "keywords": ["helping", "people"],
    "detectedTraits": {
      "empathy": 5,
      "communication": 3
    }
  },
  "traitUpdates": {
    "behavioralTraits": {
      "empathy": 7.8,
      "communication": 7.2
    }
  }
}
```

---

#### Generate Recommendations

```http
POST /recommend
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011"
}
```

---

#### Submit Feedback

```http
POST /feedback
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011",
  "careerTitle": "Software Engineer",
  "interested": true,
  "rating": 5
}
```

---

#### Health Check

```http
GET /health
```

```json
{
  "status": "healthy",
  "services": ["nlp", "behavioral", "recommendation"],
  "groq_api_configured": true,
  "mongodb_configured": true
}
```

---

## Third-Party Libraries

| Library | Purpose | Cost |
|---------|---------|------|
| NLTK | Tokenization, keyword extraction | Free |
| TextBlob | Sentiment analysis | Free |
| Groq SDK | LLM API client | Free (usage-based) |

---

## API Keys Required

| Key | Where to get | Where to set |
|-----|-------------|-------------|
| `GROQ_API_KEY` | https://console.groq.com/keys | `ai-services/.env` |
| `MONGODB_URI` | https://www.mongodb.com/cloud/atlas | `backend/.env` and `ai-services/.env` |

---

## Security

- All protected endpoints require a valid JWT token in the `Authorization: Bearer <token>` header
- Tokens expire in 7 days (configurable via `JWT_EXPIRE`)
- Rate limiting: 100 req/15min globally, 10 req/15min on auth endpoints
- API key is server-side only — never exposed to the frontend

---

## Error Responses

```json
{
  "success": false,
  "error": {
    "message": "Description of the error",
    "details": [
      { "field": "email", "message": "Please provide a valid email address" }
    ]
  }
}
```

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created |
| `400` | Validation failed |
| `401` | Unauthorized |
| `404` | Not found |
| `409` | Conflict (email already exists) |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

---

## Quick Reference

```env
# Backend (.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elevare
JWT_SECRET=<strong secret>
AI_SERVICE_URL=http://localhost:8000

# AI Services (.env)
GROQ_API_KEY=<your key>
MONGODB_URI=mongodb://localhost:27017/elevare
AI_SERVICE_PORT=8000
```

Service URLs:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- AI Service: http://localhost:8000
- MongoDB: mongodb://localhost:27017
