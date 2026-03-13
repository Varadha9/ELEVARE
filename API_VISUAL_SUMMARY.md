# 🎯 ELEVARE APIs - Visual Summary

## 📊 API Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ELEVARE Platform                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  🌐 External APIs                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. Groq API (Llama 3.3 70B)                                │
│     └─ Intelligent AI conversations                         │
│     └─ Cost: Free tier (30 req/min)                         │
│     └─ https://api.groq.com                                 │
│                                                              │
│  2. MongoDB                                                  │
│     └─ Database storage                                     │
│     └─ Cost: Free (local)                                   │
│     └─ mongodb://localhost:27017                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  🏗️ Internal APIs                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  3. Backend API (Node.js/Express) - Port 5000              │
│     ├─ POST /api/auth/register                             │
│     ├─ POST /api/auth/login                                │
│     ├─ POST /api/conversations/message                     │
│     ├─ POST /api/recommendations/generate                  │
│     └─ GET  /api/profile                                   │
│                                                              │
│  4. AI Services API (Python/FastAPI) - Port 8000           │
│     ├─ POST /process (NLP + LLM)                           │
│     ├─ POST /recommend                                     │
│     ├─ POST /feedback                                      │
│     └─ GET  /health                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  📚 Libraries (Not APIs)                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  • NLTK - Text processing                                   │
│  • TextBlob - Sentiment analysis                            │
│  • Hugging Face - Advanced NLP (optional)                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

```
User Message: "I enjoy coding"
        │
        ▼
┌───────────────────┐
│  Frontend (React) │
│  Port 3000        │
└─────────┬─────────┘
          │ HTTP POST
          ▼
┌───────────────────────────┐
│  Backend API (Node.js)    │
│  Port 5000                │
│  /api/conversations/msg   │
└─────────┬─────────────────┘
          │ HTTP POST
          ▼
┌───────────────────────────────────────┐
│  AI Services (Python)                 │
│  Port 8000                            │
│  /process                             │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 1. NLP Analysis (NLTK)          │ │
│  │    - Keywords: [coding]         │ │
│  │    - Sentiment: positive        │ │
│  │    - Traits: analytical +5      │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 2. LLM Generation (Groq API)    │ │
│  │    - Model: Llama 3.3 70B       │ │
│  │    - Context: User profile      │ │
│  │    - Response: "That's great!   │ │
│  │      What kind of coding..."    │ │
│  └─────────────────────────────────┘ │
│                                       │
│  ┌─────────────────────────────────┐ │
│  │ 3. Trait Update                 │ │
│  │    - analytical: 75 → 80        │ │
│  │    - creativity: 70 → 73        │ │
│  └─────────────────────────────────┘ │
└─────────┬─────────────────────────────┘
          │ Response
          ▼
┌───────────────────────────┐
│  Backend API              │
│  - Save to MongoDB        │
│  - Return response        │
└─────────┬─────────────────┘
          │ JSON Response
          ▼
┌───────────────────┐
│  Frontend         │
│  - Display AI msg │
│  - Update traits  │
└───────────────────┘
```

---

## 💰 Cost Breakdown

| Service | Development | Production (1000 users) |
|---------|-------------|-------------------------|
| **Groq API** | $0 (free tier) | ~$20-30/month |
| **MongoDB** | $0 (local) | $0-25/month (Atlas) |
| **Backend API** | $0 (local) | $10-20/month (hosting) |
| **AI Services** | $0 (local) | $10-20/month (hosting) |
| **Total** | **$0** | **$40-95/month** |

---

## 🔑 API Keys Required

```
✅ Required:
   └─ GROQ_API_KEY (Get from: https://console.groq.com/keys)

❌ Optional:
   └─ MONGODB_URI (Only if using MongoDB Atlas cloud)
```

---

## 📈 API Usage Statistics

### Groq API (LLM):
- **Requests per conversation**: 1
- **Average tokens per request**: 300-500
- **Response time**: 2-4 seconds
- **Free tier limit**: 30 requests/minute

### Backend API:
- **Requests per user session**: 10-20
- **Response time**: <500ms
- **Rate limit**: 100 requests/15 minutes

### AI Services API:
- **Requests per message**: 1
- **Response time**: 3-5 seconds (including LLM)
- **No rate limit** (internal)

---

## 🎯 Quick Reference

### 1. Groq API (External)
```python
# Location: ai-services/utils/llm_client.py
POST https://api.groq.com/openai/v1/chat/completions
Headers: Authorization: Bearer <GROQ_API_KEY>
Body: {
  "model": "llama-3.3-70b-versatile",
  "messages": [...],
  "temperature": 0.7
}
```

### 2. Backend API (Internal)
```javascript
// Location: backend/routes/
POST http://localhost:5000/api/conversations/message
Headers: Authorization: Bearer <JWT_TOKEN>
Body: {
  "message": "I enjoy coding"
}
```

### 3. AI Services API (Internal)
```python
# Location: ai-services/main.py
POST http://localhost:8000/process
Body: {
  "userId": "...",
  "message": "I enjoy coding",
  "conversationHistory": [...]
}
```

---

## 🧪 Testing Commands

```bash
# Test LLM Integration
cd ai-services
python test_llm_integration.py

# Test Backend
curl http://localhost:5000/health

# Test AI Service
curl http://localhost:8000/health

# Test Full Flow
curl -X POST http://localhost:5000/api/conversations/message \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"I enjoy coding"}'
```

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| `APIS_USED.md` | Complete API summary |
| `docs/API_REFERENCE.md` | Detailed API documentation |
| `docs/LLM_INTEGRATION.md` | Groq API setup guide |
| `README.md` | Project overview |

---

## 🎉 Summary

**ELEVARE uses 2 external APIs:**
1. ✅ **Groq API** - For AI conversations (Llama 3.3 70B)
2. ✅ **MongoDB** - For data storage

**Plus 2 internal APIs:**
3. ✅ **Backend API** - Node.js/Express (Port 5000)
4. ✅ **AI Services API** - Python/FastAPI (Port 8000)

**Total cost**: $0 for development, ~$40-95/month for production

---

**Built with ❤️ using Groq API (Llama 3.3 70B)**

© 2024 ELEVARE Project
