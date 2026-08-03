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

### Server refuses to start — "JWT_SECRET is required"

**Cause:** `JWT_SECRET` is missing or shorter than 32 characters in `backend/.env`.

```bash
# Generate a strong secret
openssl rand -base64 32
# or
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add it to `backend/.env`:
```env
JWT_SECRET=<your generated secret>
```

---

### Server refuses to start — "ADMIN_PASSWORD is required"

**Cause:** `ADMIN_PASSWORD` is missing or still set to the placeholder value in `backend/.env`.

Set a strong password in `backend/.env`:
```env
ADMIN_PASSWORD=<your strong admin password>
```

---

### AI responses are generic / "AI Service unavailable" in logs

**Cause:** Python AI service is not running.

```bash
cd ai-services
python -m venv venv
source venv/bin/activate   # Linux/Mac
# venv\Scripts\activate    # Windows
pip install -r requirements.txt
python main.py
```

---

### Groq API error in AI service logs

**Cause:** Missing or invalid `GROQ_API_KEY`.

1. Get a free key at https://console.groq.com/keys
2. Add it to `ai-services/.env`:
```env
GROQ_API_KEY=<your key>
```

---

### "Connection refused" — backend can't reach AI service

**Cause:** AI service not running or wrong URL in backend config.

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

**Cause:** JWT token expired or `JWT_SECRET` changed.

1. Log out and log back in
2. Confirm `JWT_SECRET` in `backend/.env` hasn't been modified since the token was issued
3. Clear `localStorage` in browser DevTools → Application tab

---

### Registration fails with password validation error

**Cause:** Password doesn't meet requirements.

Password must be at least 8 characters and contain:
- One uppercase letter
- One lowercase letter
- One number

---

### Ikigai page is blank / shows "Your Ikigai is forming"

**Cause:** Not enough conversations or AI service not saving data.

1. Complete at least 5–10 reflections in the AI chat
2. Confirm AI service is running — it writes Ikigai data to MongoDB
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

### AI service fails to connect to MongoDB on startup

**Cause:** MongoDB not running or `MONGODB_URI` missing in `ai-services/.env`.

The AI service validates the MongoDB connection on startup with a 5-second timeout and will raise a `RuntimeError` if it can't connect. Ensure MongoDB is running before starting the AI service.

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
source venv/bin/activate
python -c "
import nltk
nltk.download('punkt')
nltk.download('punkt_tab')
nltk.download('stopwords')
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

### Razorpay webhook signature verification fails

**Cause:** Webhook route must be registered before `express.json()` middleware to receive the raw request body for HMAC verification. This is already fixed in the current codebase — if you see this error, ensure you haven't moved the webhook route registration.

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
  -d '{"name":"Test User","email":"test@example.com","password":"<your_password>","age":22,"education":"undergraduate"}'

# Test AI service directly
curl -X POST http://localhost:8000/process \
  -H "Content-Type: application/json" \
  -d '{"userId":"<user_id>","message":"I love coding","conversationHistory":[]}'
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
| `JWT_SECRET is required` | Set JWT_SECRET in backend/.env |

**AI service logs — what to look for:**

| Message | Meaning |
|---------|---------|
| `✅ GROQ_API_KEY configured` | API key found |
| `⚠️ GROQ_API_KEY not set` | Add key to ai-services/.env |
| `LLM Error` | Check GROQ_API_KEY validity |
| `MongoDB connection failed` | Start MongoDB before AI service |

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

1. Check all `.env` files exist and have correct values:
   - `backend/.env` — `JWT_SECRET`, `MONGODB_URI`, `AI_SERVICE_URL`, `ADMIN_PASSWORD`
   - `ai-services/.env` — `GROQ_API_KEY`, `MONGODB_URI`

2. Try a full restart — stop all terminals (Ctrl+C), then restart each service in order: MongoDB → Backend → AI Service → Frontend.

3. Open a [GitHub Issue](https://github.com/Varadha9/ELEVARE/issues) and include:
   - Your OS and software versions
   - The exact error message
   - Which service is failing
   - Relevant log output
