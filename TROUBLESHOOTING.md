# 🔧 ELEVARE Chat Troubleshooting Guide

## Problem: AI Career Assistant Not Responding

### ✅ Quick Fix Checklist

1. **Check All Services Are Running**
   ```bash
   # Terminal 1: MongoDB
   mongod --dbpath=data/db
   
   # Terminal 2: Backend
   cd backend
   npm start
   
   # Terminal 3: AI Service (IMPORTANT!)
   cd ai-services
   python main.py
   
   # Terminal 4: Frontend
   cd frontend
   npm run dev
   ```

2. **Verify Service Health**
   - Backend: http://localhost:5000/health
   - AI Service: http://localhost:8000/health
   - Frontend: http://localhost:3000

3. **Test AI Service Connection**
   ```bash
   node test-ai-service.js
   ```

---

## 🔍 Root Cause Analysis

### Issue Found:
The backend was **NOT calling the AI service** - it was using a simple built-in response generator instead of the sophisticated Groq LLM-powered AI service.

### What Was Fixed:
1. ✅ Backend now calls `http://localhost:8000/process` endpoint
2. ✅ Passes conversation history to AI service
3. ✅ Uses Groq API (Llama 3.3 70B) for intelligent responses
4. ✅ Falls back to simple responses if AI service is unavailable
5. ✅ Properly handles trait updates from AI analysis

---

## 🚨 Common Issues & Solutions

### Issue 1: "AI Service Unavailable" Warning
**Symptoms:** Chat works but responses are generic
**Cause:** AI service (Python) is not running
**Solution:**
```bash
cd ai-services
python -m venv venv
venv\Scripts\activate  # Windows
# source venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
python main.py
```

### Issue 2: "Groq API Error"
**Symptoms:** AI service logs show API errors
**Cause:** Invalid or missing GROQ_API_KEY
**Solution:**
1. Check `ai-services/.env` file
2. Verify GROQ_API_KEY is set correctly
3. Get new key from: https://console.groq.com/keys
```env
GROQ_API_KEY=gsk_your_actual_key_here
```

### Issue 3: "Connection Refused" Error
**Symptoms:** Backend can't reach AI service
**Cause:** AI service not running or wrong port
**Solution:**
1. Verify AI service is running: `curl http://localhost:8000/health`
2. Check `backend/.env` has correct URL:
```env
AI_SERVICE_URL=http://localhost:8000
```

### Issue 4: Chat Sends But No Response
**Symptoms:** Message sent but no AI reply appears
**Cause:** Frontend not handling response correctly
**Solution:**
1. Open browser console (F12)
2. Check for errors in Network tab
3. Verify token is valid (check localStorage)

### Issue 5: "401 Unauthorized" Error
**Symptoms:** Can't send messages after login
**Cause:** JWT token expired or invalid
**Solution:**
1. Logout and login again
2. Check `backend/.env` JWT_SECRET matches
3. Clear browser localStorage

---

## 🧪 Testing Steps

### 1. Test Backend Alone
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### 2. Test AI Service Alone
```bash
curl -X POST http://localhost:8000/process \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test123",
    "message": "I love coding",
    "conversationHistory": []
  }'
```

### 3. Test Full Integration
```bash
# Run the test script
node test-ai-service.js
```

---

## 📊 Service Status Check

### Backend Status
```bash
curl http://localhost:5000/health
```
Expected response:
```json
{
  "status": "healthy",
  "database": "mongodb",
  "uptime": 123.45
}
```

### AI Service Status
```bash
curl http://localhost:8000/health
```
Expected response:
```json
{
  "status": "healthy",
  "services": ["nlp", "behavioral", "recommendation"]
}
```

---

## 🔄 Restart All Services

### Windows
```bash
# Stop all (Ctrl+C in each terminal)
# Then run:
.\launch-elevare.bat
```

### Mac/Linux
```bash
# Stop all (Ctrl+C in each terminal)
# Then run:
./launch-elevare.sh
```

---

## 📝 Logs to Check

### Backend Logs
Look for:
- ✅ "AI Service response received" - Good!
- ⚠️ "AI Service unavailable, using fallback" - AI service not running

### AI Service Logs
Look for:
- ✅ "Starting ELEVARE AI Services..." - Good!
- ❌ "LLM Error" - Groq API issue

### Browser Console
Look for:
- ❌ "Network Error" - Backend not reachable
- ❌ "401 Unauthorized" - Token issue

---

## 🎯 Expected Behavior

### When Working Correctly:
1. User types message in chat
2. Frontend sends to backend `/api/conversations/message`
3. Backend calls AI service `/process`
4. AI service uses Groq LLM to generate intelligent response
5. Backend saves conversation and updates traits
6. Frontend displays AI response

### Response Time:
- With AI service: 2-5 seconds (LLM processing)
- Fallback mode: <500ms (simple responses)

---

## 🆘 Still Not Working?

1. **Check all environment variables:**
   - `backend/.env` - JWT_SECRET, MONGODB_URI, AI_SERVICE_URL
   - `ai-services/.env` - GROQ_API_KEY, MONGODB_URI

2. **Verify MongoDB is running:**
   ```bash
   mongosh
   show dbs
   use elevare
   db.users.find()
   ```

3. **Check firewall/antivirus:**
   - Allow ports 3000, 5000, 8000, 27017

4. **Try in-memory mode (testing only):**
   ```env
   # backend/.env
   USE_MEMORY_DB=true
   ```

5. **Check Node.js and Python versions:**
   ```bash
   node --version  # Should be 18+
   python --version  # Should be 3.9+
   ```

---

## 📞 Get Help

- GitHub Issues: https://github.com/Varadha9/ELEVARE/issues
- Documentation: See `docs/` folder
- Email: support@elevare.com

---

## ✨ Success Indicators

You'll know it's working when:
- ✅ Chat responds with thoughtful, contextual questions
- ✅ Responses are unique and personalized
- ✅ Backend logs show "AI Service response received"
- ✅ Traits update after each conversation
- ✅ Response time is 2-5 seconds (LLM processing)

---

**Last Updated:** 2024
**Version:** 1.2.0
