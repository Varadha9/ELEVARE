# 🔌 ELEVARE APIs - Complete Summary

## Quick Answer: Which APIs Does ELEVARE Use?

### 🌐 External APIs (Paid/Cloud Services)

1. **Groq API** - Primary LLM for AI conversations
   - Model: Llama 3.3 70B Versatile
   - Cost: Free tier (30 req/min), Paid tier available
   - Purpose: Intelligent career coaching conversations

2. **MongoDB** - Database service
   - Cost: Free (local) or MongoDB Atlas (cloud)
   - Purpose: Store user data, conversations, profiles

---

## 📊 Complete API Breakdown

### 1️⃣ **Groq API** (LLM - Large Language Model)

**What it does**: Powers the AI Career Coach with intelligent, context-aware conversations

**Provider**: Groq Inc.  
**Model**: Llama 3.3 70B Versatile  
**Endpoint**: `https://api.groq.com/openai/v1/chat/completions`

**Configuration**:
```env
GROQ_API_KEY=your_groq_api_key_here
```

**Usage in Code**:
```python
# ai-services/utils/llm_client.py
client = GroqLLMClient()
response = client.generate_response(
    system_prompt="You are ELEVARE Career Coach...",
    user_message="I enjoy coding",
    temperature=0.7
)
```

**Pricing**:
- Free Tier: 30 requests/minute
- Input: ~$0.59 per 1M tokens
- Output: ~$0.79 per 1M tokens

**Get API Key**: https://console.groq.com/keys

---

### 2️⃣ **MongoDB** (Database)

**What it does**: Stores all user data, conversations, profiles, recommendations

**Provider**: MongoDB Inc.  
**Version**: 6+

**Configuration**:
```env
MONGODB_URI=mongodb://localhost:27017/elevare
```

**Collections**:
- `users` - Authentication data
- `userprofiles` - Behavioral traits, personality
- `conversations` - Chat history
- `recommendations` - Career suggestions
- `careers` - Career database (50+ careers)

**Pricing**:
- Local: Free (self-hosted)
- MongoDB Atlas: Free tier (512MB)

---

### 3️⃣ **Internal Backend API** (Node.js/Express)

**What it does**: Handles authentication, business logic, data management

**Port**: 5000  
**Base URL**: `http://localhost:5000`

**Key Endpoints**:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/conversations/message` - Send message to AI
- `POST /api/recommendations/generate` - Get career recommendations
- `GET /api/profile` - Get user profile

**Technology**: Node.js, Express.js, JWT, Bcrypt

---

### 4️⃣ **Internal AI Services API** (Python/FastAPI)

**What it does**: NLP processing, behavioral analysis, LLM integration

**Port**: 8000  
**Base URL**: `http://localhost:8000`

**Key Endpoints**:
- `POST /process` - Process message with NLP + LLM
- `POST /recommend` - Generate career recommendations
- `POST /feedback` - Process user feedback
- `GET /health` - Health check

**Technology**: Python, FastAPI, NLTK, TextBlob, Groq API

---

## 📚 Third-Party Libraries (Not APIs, but important)

### NLP & AI Libraries:

1. **NLTK** (Natural Language Toolkit)
   - Purpose: Text processing, tokenization, keyword extraction
   - Cost: Free (open-source)

2. **TextBlob**
   - Purpose: Sentiment analysis, emotion detection
   - Cost: Free (open-source)

3. **Hugging Face Transformers** (Optional)
   - Purpose: Advanced NLP models
   - Cost: Free (open-source)

---

## 💰 Cost Summary

| Service | Type | Cost | Required |
|---------|------|------|----------|
| **Groq API** | External | Free tier / Paid | ✅ Yes |
| **MongoDB** | Database | Free (local) | ✅ Yes |
| **Backend API** | Internal | Free (self-hosted) | ✅ Yes |
| **AI Services** | Internal | Free (self-hosted) | ✅ Yes |
| **NLTK** | Library | Free | ✅ Yes |
| **TextBlob** | Library | Free | ✅ Yes |

**Total Monthly Cost**: 
- Development: **$0** (using free tiers)
- Production: **~$10-50** (depending on usage)

---

## 🔑 API Keys Needed

### Required:
1. **Groq API Key**
   - Get from: https://console.groq.com/keys
   - Set in: `ai-services/.env`
   - Variable: `GROQ_API_KEY`

### Optional:
2. **MongoDB Atlas** (if using cloud database)
   - Get from: https://www.mongodb.com/cloud/atlas
   - Set in: `.env`
   - Variable: `MONGODB_URI`

---

## 🚀 How APIs Work Together

```
User sends message
    ↓
Frontend (React) → Backend API (Node.js)
    ↓
Backend → AI Services API (Python)
    ↓
AI Services:
  1. NLP Analysis (NLTK + TextBlob)
  2. LLM Generation (Groq API)
  3. Trait Analysis
    ↓
Response → Backend → Frontend
    ↓
Save to MongoDB
```

---

## 📖 Documentation Links

### External APIs:
- **Groq API**: https://console.groq.com/docs
- **MongoDB**: https://docs.mongodb.com/

### Internal Documentation:
- **API Reference**: `docs/API_REFERENCE.md`
- **LLM Integration**: `docs/LLM_INTEGRATION.md`
- **Architecture**: `docs/ARCHITECTURE.md`

---

## 🧪 Testing APIs

### Test LLM Integration:
```bash
cd ai-services
python test_llm_integration.py
```

### Test Backend:
```bash
curl http://localhost:5000/health
```

### Test AI Service:
```bash
curl http://localhost:8000/health
```

---

## 🎯 Key Takeaways

1. **Primary API**: Groq API (Llama 3.3 70B) for AI conversations
2. **Database**: MongoDB for data storage
3. **Internal APIs**: Node.js backend + Python AI services
4. **NLP Libraries**: NLTK, TextBlob (free, open-source)
5. **Cost**: Free for development, ~$10-50/month for production

---

## 📝 Quick Setup

1. **Get Groq API Key**: https://console.groq.com/keys
2. **Add to .env**:
   ```env
   GROQ_API_KEY=your_key_here
   ```
3. **Install MongoDB**: https://www.mongodb.com/try/download/community
4. **Run Setup**:
   ```bash
   .\setup.bat
   .\launch-elevare.bat
   ```

---

**That's it! ELEVARE uses Groq API for AI + MongoDB for storage + internal APIs for business logic.**

© 2024 ELEVARE Project
