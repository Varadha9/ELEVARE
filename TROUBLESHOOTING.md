# Troubleshooting Guide

---

## Quick Checklist

Before diving deeper, confirm all four services are running:

```bash
# Terminal 1 — MongoDB
mongod --dbpath=data/db

# Terminal 2 — Backend
cd backend && npm start

# Terminal 3 — AI Service
cd ai-services && source venv/bin/activate && python main.py

# Terminal 4 — Frontend
cd frontend && npm run dev
```

Verify with health checks:

```bash
curl http://localhost:5000/health
curl http://localhost:8000/health
```

---

## Common Issues

### AI responses are generic / "AI Service unavailable" in logs

**Cause:** Python AI service is not running.

```bash
cd ai-services
python -m venv venv
source venv/bin/activate   # Linux/Mac
# venv\Scripts\activate    # Windows
pip install -r requirements.txt
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
python main.py
```

---

### Groq API error in AI service logs

**Cause:** Missing or invalid `GROQ_API_KEY`.

1. Get a free key at https://console.groq.com/keys
2. Add it to `ai-services/.env`:
```env
GROQ_API_KEY=gsk_your_actual_key_here
```

---

### "Connection refused" — backend can't reach AI service

**Cause:** AI service not running or wrong URL.

```bash
# Confirm it's up
curl http://localhost:8000/health

# Confirm backend .env has:
AI_SERVICE_URL=http://localhost:8000
```

---

### Chat sends but no AI reply appears

**Cause:** Frontend not receiving response.

1. Open browser DevTools → Network tab
2. Check the `/api/conversations/message` request
3. Look for error in response body
4. Verify `localStorage.token` is present and not expired

---

### "401 Unauthorized" on API calls

**Cause:** JWT token expired or JWT_SECRET changed.

1. Log out and log back in
2. Confirm `JWT_SECRET` in `backend/.env` hasn't been modified
3. Clear `localStorage` in browser DevTools → Application tab

---

### Registration fails with password validation error

**Cause:** Password requirements changed in v2.0.0.

Password must now be at least 8 characters and contain:
- One uppercase letter
- One lowercase letter
- One number

Example valid password: `MyPass123`

---

### Ikigai page is blank / shows "Your Ikigai is forming"

**Cause:** Not enough conversations or AI service not saving data.

1. Complete at least 5–10 reflections in the AI chat
2. Confirm AI service is running — it writes ikigai data to MongoDB
3. Check `ai-services/.env` has a valid `MONGODB_URI`

---

### Streak always shows 0

**Cause:** No conversations recorded yet, or MongoDB not connected.

1. Complete at least one AI reflection
2. Verify MongoDB is running: `mongosh` → `use elevare` → `db.conversations.find()`

---

### MongoDB connection failed on backend start

**Cause:** MongoDB not running or wrong URI.

```bash
# Start MongoDB
mongod --dbpath=data/db

# Or use in-memory mode (data lost on restart — development only)
# Add to backend/.env:
USE_MEMORY_DB=true
```

---

### Frontend blank page or build errors

**Cause:** Missing or corrupted dependencies.

```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

---

### NLTK data missing error in AI service

```bash
cd ai-services
python -c "
import nltk
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger')
nltk.download('vader_lexicon')
"
```

---

### CORS error in browser console

**Cause:** `CORS_ORIGIN` in `backend/.env` doesn't match your frontend URL.

```env
CORS_ORIGIN=http://localhost:3000
# For multiple origins:
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
```

---

## Manual API Testing

```bash
# Test backend health
curl http://localhost:5000/health

# Test AI service health
curl http://localhost:8000/health

# Register a test user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test1234","age":22,"education":"undergraduate"}'

# Test AI service directly
curl -X POST http://localhost:8000/process \
  -H "Content-Type: application/json" \
  -d '{"userId":"test123","message":"I love coding","conversationHistory":[]}'
```

---

## Reading Logs

**Backend logs — what to look for:**

| Message | Meaning |
|---------|---------|
| `✅ MongoDB connected successfully` | Database connected |
| `✅ AI Service response received` | LLM working |
| `⚠️ AI Service unavailable, using fallback` | Start the AI service |
| `MongoDB connection failed` | Start MongoDB |

**AI service logs — what to look for:**

| Message | Meaning |
|---------|---------|
| `✅ GROQ_API_KEY configured` | API key found |
| `⚠️ GROQ_API_KEY not set` | Add key to .env |
| `LLM Error` | Check GROQ_API_KEY validity |

---

## Check Versions

```bash
node --version    # Should be 18+
python --version  # Should be 3.9+
mongod --version  # Should be 6+
```

---

## Port Conflicts

```bash
# Find what's using a port (Linux/Mac)
lsof -i :5000
lsof -i :8000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

---

## Still Not Working?

1. Check all `.env` files exist and have correct values
   - `backend/.env` — `JWT_SECRET`, `MONGODB_URI`, `AI_SERVICE_URL`
   - `ai-services/.env` — `GROQ_API_KEY`, `MONGODB_URI`

2. Try a full restart:
```bash
# Stop all terminals (Ctrl+C), then restart each service
```

3. Open a [GitHub Issue](https://github.com/Varadha9/ELEVARE/issues) and include:
   - Your OS and software versions
   - The exact error message
   - Which service is failing
   - Relevant log output
