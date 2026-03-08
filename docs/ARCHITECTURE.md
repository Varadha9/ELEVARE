# ELEVARE System Architecture

## Overview
ELEVARE is a microservices-based AI platform for career discovery using longitudinal behavioral analysis.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              React Frontend (Port 3000)                   │  │
│  │  - Chat Interface                                         │  │
│  │  - Dashboard & Analytics                                  │  │
│  │  - User Authentication                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                           │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Node.js/Express API (Port 5000)                   │  │
│  │  - Authentication (JWT)                                   │  │
│  │  - Request Validation                                     │  │
│  │  - Rate Limiting                                          │  │
│  │  - Business Logic                                         │  │
│  │  - API Gateway                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓ HTTP
┌─────────────────────────────────────────────────────────────────┐
│                      AI PROCESSING LAYER                         │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         Python FastAPI Service (Port 8000)                │  │
│  │                                                           │  │
│  │  ┌────────────────┐  ┌──────────────────┐               │  │
│  │  │ NLP Processor  │  │ Behavioral       │               │  │
│  │  │ - Transformers │  │ Analyzer         │               │  │
│  │  │ - NLTK         │  │ - Trait Updates  │               │  │
│  │  │ - Emotion Det. │  │ - Personality    │               │  │
│  │  └────────────────┘  └──────────────────┘               │  │
│  │                                                           │  │
│  │  ┌────────────────┐  ┌──────────────────┐               │  │
│  │  │ Conversational │  │ Recommendation   │               │  │
│  │  │ Agent          │  │ Engine           │               │  │
│  │  │ - Questions    │  │ - ML Scoring     │               │  │
│  │  │ - Context      │  │ - Ikigai Map     │               │  │
│  │  └────────────────┘  └──────────────────┘               │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                               │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              MongoDB (Port 27017)                         │  │
│  │                                                           │  │
│  │  Collections:                                            │  │
│  │  - users                                                 │  │
│  │  - userprofiles (traits, personality, ikigai)           │  │
│  │  - conversations (messages, analysis)                   │  │
│  │  - recommendations                                       │  │
│  │  - careers (dataset)                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### 1. Frontend (React + Vite)
**Technology:** React 18, Vite, TailwindCSS, Recharts

**Components:**
- `Chat.jsx` - Real-time conversational interface
- `Dashboard.jsx` - Analytics and visualizations
- `Login/Register.jsx` - Authentication pages
- `AuthContext.jsx` - Global state management

**Features:**
- JWT-based authentication
- Real-time chat interface
- Interactive data visualizations
- Responsive design

### 2. Backend API (Node.js + Express)
**Technology:** Express, Mongoose, JWT, Bcrypt

**Structure:**
```
backend/
├── models/          # MongoDB schemas
├── controllers/     # Business logic
├── routes/          # API endpoints
├── middleware/      # Auth, validation
└── config/          # Database config
```

**Key Features:**
- RESTful API design
- JWT authentication
- Input validation
- Rate limiting (100 req/15min)
- Error handling

### 3. AI Services (Python + FastAPI)
**Technology:** FastAPI, Transformers, Scikit-learn, NLTK

**Services:**

**NLP Processor:**
- Text preprocessing
- Emotion detection (DistilRoBERTa)
- Sentiment analysis
- Keyword extraction
- Trait extraction

**Behavioral Analyzer:**
- Trait evolution tracking
- Personality modeling (Big Five)
- Ikigai framework mapping
- Longitudinal analysis

**Conversational Agent:**
- Context-aware responses
- Reflective question generation
- Conversation flow management
- Empathetic communication

**Recommendation Engine:**
- Hybrid scoring algorithm
- Trait-career matching
- Personality fit calculation
- Ikigai alignment
- Confidence scoring

### 4. Database (MongoDB)
**Collections Schema:**

**users:**
```javascript
{
  name, email, password (hashed),
  age, education, currentStatus,
  conversationStreak, lastActive
}
```

**userprofiles:**
```javascript
{
  userId,
  personality: { openness, conscientiousness, extraversion, agreeableness, neuroticism },
  behavioralTraits: { creativity, analyticalThinking, communication, ... },
  ikigai: { loves[], goodAt[], worldNeeds[], paidFor[] },
  interests[], traitHistory[]
}
```

**conversations:**
```javascript
{
  userId, sessionDate,
  messages: [{ role, content, timestamp, analysis }]
}
```

**recommendations:**
```javascript
{
  userId, generatedAt,
  recommendations: [{ careerTitle, confidenceScore, explanation, careerDetails, userFeedback }]
}
```

**careers:**
```javascript
{
  title, category, description,
  requiredTraits, personalityFit,
  skills[], education[], salary, growth,
  ikigaiMapping
}
```

## Data Flow

### Conversation Flow
```
1. User sends message → Frontend
2. Frontend → Backend API (POST /conversations/message)
3. Backend → AI Service (POST /process)
4. AI Service:
   - NLP processing (emotion, sentiment, keywords)
   - Trait extraction
   - Behavioral analysis
   - Profile update
   - Response generation
5. AI Service → Backend (response + analysis)
6. Backend saves to MongoDB
7. Backend → Frontend (AI response)
8. Frontend displays message
```

### Recommendation Flow
```
1. User requests recommendations → Frontend
2. Frontend → Backend (POST /recommendations/generate)
3. Backend → AI Service (POST /recommend)
4. AI Service:
   - Fetch user profile
   - Fetch career database
   - Calculate trait match
   - Calculate personality fit
   - Calculate Ikigai alignment
   - Generate explanations
   - Rank careers
5. AI Service → Backend (recommendations)
6. Backend saves to MongoDB
7. Backend → Frontend (recommendations)
8. Frontend displays in dashboard
```

## AI Pipeline Details

### NLP Processing Pipeline
```
Input Text
    ↓
Preprocessing (lowercase, clean)
    ↓
Tokenization (NLTK)
    ↓
Emotion Detection (Transformer)
    ↓
Sentiment Analysis (TextBlob)
    ↓
Keyword Extraction (stopword removal)
    ↓
Trait Extraction (keyword matching)
    ↓
Output: {emotions, sentiment, keywords, traits}
```

### Behavioral Update Algorithm
```python
# Exponential Moving Average
learning_rate = 0.15
new_value = current_value + (detected_signal * learning_rate)
new_value = clamp(new_value, 0, 100)
```

### Recommendation Scoring
```python
confidence = (
    trait_match_score * 0.4 +
    personality_fit_score * 0.3 +
    ikigai_alignment_score * 0.3
)
```

## Security Features

1. **Authentication:**
   - JWT tokens (7-day expiry)
   - Bcrypt password hashing (12 rounds)
   - Token validation on protected routes

2. **Input Validation:**
   - Express-validator for request validation
   - Pydantic models in FastAPI
   - SQL injection prevention (NoSQL)

3. **Rate Limiting:**
   - 100 requests per 15 minutes
   - IP-based throttling

4. **CORS:**
   - Configured for frontend origin
   - Credentials support

## Scalability Considerations

1. **Horizontal Scaling:**
   - Stateless API design
   - JWT for distributed auth
   - MongoDB replica sets

2. **Microservices:**
   - Independent AI service
   - Can scale separately
   - Language-specific optimization

3. **Caching:**
   - Career database caching
   - Model caching in AI service

4. **Database Indexing:**
   - userId indexes
   - Compound indexes for queries

## Deployment Architecture

```
Production Environment:
- Frontend: Vercel/Netlify
- Backend: AWS EC2/Heroku
- AI Service: AWS EC2 (GPU optional)
- Database: MongoDB Atlas
- Load Balancer: AWS ALB
```

## Monitoring & Logging

- API request logging
- Error tracking
- Performance metrics
- User analytics
- Model performance tracking

## Future Enhancements

1. Real-time WebSocket chat
2. Advanced ML models (BERT, GPT)
3. Multi-language support
4. Mobile applications
5. Career path visualization
6. Mentor matching
7. Job market integration
8. A/B testing framework
