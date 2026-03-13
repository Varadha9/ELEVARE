# 🔌 ELEVARE API Reference

## Overview

ELEVARE uses a combination of **external APIs** and **internal REST APIs** to power its AI-driven career discovery platform.

---

## 🌐 External APIs

### 1. **Groq API** (Primary LLM)

**Purpose**: Intelligent conversational AI for career coaching

**Provider**: Groq  
**Model**: Llama 3.3 70B Versatile  
**Endpoint**: `https://api.groq.com/openai/v1/chat/completions`

#### Configuration:
```env
GROQ_API_KEY=your_groq_api_key_here
```

#### Usage:
```python
# ai-services/utils/llm_client.py
client = GroqLLMClient()
response = client.generate_response(
    system_prompt="You are ELEVARE Career Coach...",
    user_message="I enjoy coding",
    conversation_history=[...],
    temperature=0.7,
    max_tokens=500
)
```

#### Request Format:
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

#### Response Format:
```json
{
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "That's great! What kind of coding projects..."
      }
    }
  ]
}
```

#### Pricing:
- **Free Tier**: 30 requests/minute
- **Paid Tier**: Higher limits, pay-per-token
- **Cost**: ~$0.59 per 1M input tokens, ~$0.79 per 1M output tokens

#### Documentation:
- **API Docs**: https://console.groq.com/docs
- **Get API Key**: https://console.groq.com/keys

---

### 2. **MongoDB** (Database Service)

**Purpose**: NoSQL database for storing user data, conversations, profiles

**Provider**: MongoDB Inc.  
**Version**: 6+

#### Configuration:
```env
MONGODB_URI=mongodb://localhost:27017/elevare
# OR for cloud
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elevare
```

#### Collections:
- `users` - User authentication
- `userprofiles` - Behavioral traits, personality, Ikigai
- `conversations` - Chat history
- `recommendations` - Career suggestions
- `careers` - Career database

#### Pricing:
- **Local**: Free (self-hosted)
- **MongoDB Atlas**: Free tier (512MB), Paid tiers available

---

## 🏗️ Internal REST APIs

### Backend API (Node.js/Express) - Port 5000

Base URL: `http://localhost:5000`

---

#### **Authentication Endpoints**

##### 1. Register User
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

**Response:**
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

##### 2. Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

##### 3. Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

#### **Profile Endpoints**

##### 1. Get User Profile
```http
GET /api/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "507f1f77bcf86cd799439011",
    "behavioralTraits": {
      "creativity": 75,
      "analytical": 80,
      "leadership": 60
    },
    "personality": {
      "openness": 70,
      "conscientiousness": 65
    },
    "ikigai": {
      "passion": 75,
      "mission": 60,
      "vocation": 55,
      "profession": 70
    }
  }
}
```

##### 2. Update Profile
```http
PUT /api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "age": 23
}
```

##### 3. Delete Account
```http
DELETE /api/profile
Authorization: Bearer <token>
```

##### 4. Export User Data
```http
GET /api/profile/export
Authorization: Bearer <token>
```

---

#### **Conversation Endpoints**

##### 1. Send Message
```http
POST /api/conversations/message
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "I really enjoy solving complex coding problems"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "That's great! What kind of coding projects...",
    "analysis": {
      "sentiment": "positive",
      "emotions": ["joy"],
      "keywords": ["coding", "problems", "solving"],
      "detectedTraits": {
        "analytical": 5,
        "creativity": 3
      }
    },
    "traitUpdates": {
      "analytical": 82,
      "creativity": 76
    }
  }
}
```

##### 2. Get Conversation History
```http
GET /api/conversations/history?limit=20
Authorization: Bearer <token>
```

##### 3. Get Specific Conversation
```http
GET /api/conversations/:conversationId
Authorization: Bearer <token>
```

---

#### **Recommendation Endpoints**

##### 1. Generate Recommendations
```http
POST /api/recommendations/generate
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "recommendations": [
      {
        "career": "Software Engineer",
        "confidence": 85,
        "reasoning": "Strong analytical and problem-solving skills...",
        "skills": ["Python", "JavaScript", "Problem Solving"],
        "nextSteps": ["Build portfolio projects", "Learn algorithms"]
      }
    ]
  }
}
```

##### 2. Get All Recommendations
```http
GET /api/recommendations
Authorization: Bearer <token>
```

##### 3. Submit Feedback
```http
POST /api/recommendations/:id/feedback
Authorization: Bearer <token>
Content-Type: application/json

{
  "interested": true,
  "rating": 5
}
```

---

### AI Services API (Python/FastAPI) - Port 8000

Base URL: `http://localhost:8000`

---

#### **Core Processing Endpoints**

##### 1. Process Message (Main Endpoint)
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
    "detectedTraits": [
      {"trait": "empathy", "value": 5},
      {"trait": "communication", "value": 3}
    ]
  },
  "traitUpdates": {
    "behavioralTraits": {
      "empathy": 78,
      "communication": 72
    }
  }
}
```

##### 2. Generate Recommendations
```http
POST /recommend
Content-Type: application/json

{
  "userId": "507f1f77bcf86cd799439011"
}
```

##### 3. Process Feedback
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

##### 4. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "services": ["nlp", "behavioral", "recommendation"]
}
```

---

## 📚 Third-Party Libraries (Not APIs)

### NLP & AI Processing

#### 1. **NLTK** (Natural Language Toolkit)
- **Purpose**: Text processing, tokenization, keyword extraction
- **Usage**: `ai-services/services/nlp_processor.py`
- **Cost**: Free (open-source)

#### 2. **TextBlob**
- **Purpose**: Sentiment analysis, emotion detection
- **Usage**: `ai-services/services/nlp_processor.py`
- **Cost**: Free (open-source)

#### 3. **Hugging Face Transformers** (Optional)
- **Purpose**: Advanced NLP models
- **Models**: 
  - `j-hartmann/emotion-english-distilroberta-base`
  - `distilbert-base-uncased-finetuned-sst-2-english`
- **Cost**: Free (open-source)

---

## 🔑 API Keys Required

### Required:
1. **Groq API Key** - For LLM conversations
   - Get from: https://console.groq.com/keys
   - Set in: `ai-services/.env` as `GROQ_API_KEY`

### Optional:
2. **MongoDB Atlas** - For cloud database (if not using local)
   - Get from: https://www.mongodb.com/cloud/atlas
   - Set in: `.env` as `MONGODB_URI`

---

## 📊 API Usage Summary

| API | Type | Cost | Purpose | Required |
|-----|------|------|---------|----------|
| **Groq API** | External | Paid (Free tier) | LLM conversations | ✅ Yes |
| **MongoDB** | Database | Free (local) | Data storage | ✅ Yes |
| **Backend API** | Internal | Free | Business logic | ✅ Yes |
| **AI Services API** | Internal | Free | ML processing | ✅ Yes |
| **NLTK** | Library | Free | NLP processing | ✅ Yes |
| **TextBlob** | Library | Free | Sentiment analysis | ✅ Yes |
| **Hugging Face** | Library | Free | Advanced NLP | ❌ Optional |

---

## 🔒 Security Best Practices

### API Key Management:
```bash
# ✅ DO: Store in .env file
GROQ_API_KEY=your_key_here

# ❌ DON'T: Hardcode in source code
api_key = "gsk_abc123..."  # NEVER DO THIS
```

### Authentication:
- All protected endpoints require JWT token
- Token expires in 7 days (configurable)
- Use `Authorization: Bearer <token>` header

### Rate Limiting:
- Backend API: 100 requests per 15 minutes
- Groq API: 30 requests per minute (free tier)

---

## 🧪 Testing APIs

### Test Backend:
```bash
curl http://localhost:5000/health
```

### Test AI Service:
```bash
curl http://localhost:8000/health
```

### Test LLM Integration:
```bash
cd ai-services
python test_llm_integration.py
```

### Test Full Flow:
```bash
# 1. Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"test123","age":22,"education":"undergraduate"}'

# 2. Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'

# 3. Send Message
curl -X POST http://localhost:5000/api/conversations/message \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"I enjoy coding"}'
```

---

## 📖 Additional Resources

- **Groq API Docs**: https://console.groq.com/docs
- **MongoDB Docs**: https://docs.mongodb.com/
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **Express.js Docs**: https://expressjs.com/
- **NLTK Docs**: https://www.nltk.org/
- **TextBlob Docs**: https://textblob.readthedocs.io/

---

## 💡 Quick Reference

### Environment Variables:
```env
# Backend (.env)
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elevare
JWT_SECRET=your_secret_key
AI_SERVICE_URL=http://localhost:8000

# AI Services (.env)
GROQ_API_KEY=your_groq_api_key
MONGODB_URI=mongodb://localhost:27017/elevare
AI_SERVICE_PORT=8000
```

### Service URLs:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000
- **AI Service**: http://localhost:8000
- **MongoDB**: mongodb://localhost:27017

---

**Built with ❤️ using Groq API (Llama 3.3 70B)**

© 2024 ELEVARE Project
