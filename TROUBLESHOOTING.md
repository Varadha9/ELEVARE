# 🔧 ELEVARE Troubleshooting Guide

## ✅ Quick Fix Checklist

Before anything else, make sure all 4 services are running:

```bash
# Terminal 1: MongoDB
mongod --dbpath=data/db

# Terminal 2: Backend
cd backend
npm start

# Terminal 3: AI Service
cd ai-services
venv\Scripts\activate     # Windows
python main.py

# Terminal 4: Frontend
cd frontend
npm run dev
```

Then verify each service is healthy:

| Service | Health URL |
|---------|-----------|
| Backend | http://localhost:5000/health |
| AI Service | http://localhost:8000/health |
| Frontend | http://localhost:3000 |

---

## 🚨 Common Issues & Solutions

### Issue 1: AI responses are generic / "AI Service unavailable" in logs
**Cause:** AI service (Python) is not running  
**Fix:**
```bash
cd ai-services
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac
pip install -r requirements.txt
python main.py
```

---

### Issue 2: Groq API Error in AI service logs
**Cause:** Missing or invalid `GROQ_API_KEY`  
**Fix:**
1. Get a free key at https://console.groq.com/keys
2. Add it to `ai-services/.env`:
```env
GROQ_API_KEY=gsk_your_actual_key_here
```

---

### Issue 3: "Connection Refused" — backend can't reach AI service
**Cause:** AI service not running or wrong port  
**Fix:**
1. Confirm AI service is up: `curl http://localhost:8000/health`
2. Check `backend/.env`:
```env
AI_SERVICE_URL=http://localhost:8000
```

---

### Issue 4: Chat sends but no AI reply appears
**Cause:** Frontend not receiving response correctly  
**Fix:**
1. Open browser DevTools → Network tab
2. Check the `/api/conversations/message` request for errors
3. Verify your JWT token is valid (check `localStorage.token`)

---

### Issue 5: "401 Unauthorized" on API calls
**Cause:** JWT token expired or invalid  
**Fix:**
1. Log out and log back in
2. Ensure `JWT_SECRET` in `backend/.env` hasn't changed
3. Clear `localStorage` in browser DevTools

---

### Issue 6: Ikigai page is blank / shows "Your Ikigai is forming"
**Cause:** Not enough conversations yet, or AI service not saving data  
**Fix:**
1. Complete at least 5–10 reflections in the AI chat
2. Confirm AI service is running (it writes ikigai data to MongoDB)
3. Check `ai-services/.env` has a valid `MONGODB_URI`

---

### Issue 7: Streak always shows 0
**Cause:** No conversations recorded yet, or MongoDB not connected  
**Fix:**
1. Complete at least one reflection
2. Verify MongoDB is running: `mongosh` → `use elevare` → `db.conversations.find()`

---

### Issue 8: MongoDB connection failed on backend start
**Cause:** MongoDB not running  
**Fix:**
```bash
# Start MongoDB
mongod --dbpath=data/db

# Or use in-memory mode for development (data lost on restart)
# backend/.env
USE_MEMORY_DB=true
```

---

### Issue 9: Frontend build errors / blank page
**Cause:** Missing dependencies  
**Fix:**
```bash
cd frontend
rm -rf node_modules
npm install
npm run dev
```

---

### Issue 10: NLTK data missing error in AI service
**Cause:** NLTK punkt/stopwords not downloaded  
**Fix:**
```bash
cd ai-services
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('averaged_perceptron_tagger')"
```

---

## 🧪 Manual API Testing

**Test backend auth:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

**Test AI service directly:**
```bash
curl -X POST http://localhost:8000/process \
  -H "Content-Type: application/json" \
  -d '{"userId":"test123","message":"I love coding","conversationHistory":[]}'
```

**Test backend health:**
```bash
curl http://localhost:5000/health
```

**Test AI service health:**
```bash
curl http://localhost:8000/health
```

---

## 📊 Expected Service Responses

**Backend `/health`:**
```json
{
  "status": "healthy",
  "database": "mongodb",
  "uptime": 123.45
}
```

**AI Service `/health`:**
```json
{
  "status": "healthy",
  "services": ["nlp", "behavioral", "recommendation"]
}
```

---

## 📝 What to Check in Logs

**Backend logs — good signs:**
- `✅ MongoDB connected successfully`
- `✅ AI Service response received`

**Backend logs — problems:**
- `⚠️ AI Service unavailable, using fallback` → start AI service
- `MongoDB connection failed` → start MongoDB

**AI service logs — good signs:**
- `🤖 Starting ELEVARE AI Services...`

**AI service logs — problems:**
- `LLM Error` → check GROQ_API_KEY
- `Connection refused` → check MONGODB_URI

---

## 🔄 Full Restart

```bash
# Windows — stop all terminals (Ctrl+C), then:
.\launch-elevare.bat
```

---

## 🆘 Still Not Working?

1. Check all `.env` files exist and have correct values:
   - `backend/.env` — `JWT_SECRET`, `MONGODB_URI`, `AI_SERVICE_URL`
   - `ai-services/.env` — `GROQ_API_KEY`, `MONGODB_URI`

2. Verify versions:
```bash
node --version    # Should be 18+
python --version  # Should be 3.9+
```

3. Check firewall allows ports: `3000`, `5000`, `8000`, `27017`

4. Open a [GitHub Issue](https://github.com/Varadha9/ELEVARE/issues) with:
   - Your OS and versions
   - The exact error message
   - Which service is failing

---

**Last Updated:** 2025  
**Version:** 1.4.0
