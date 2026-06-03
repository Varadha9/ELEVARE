# Production Deployment Checklist

Complete checklist before deploying ELEVARE to production.

---

## ✅ Pre-Deployment

### Code Quality

- [x] No `.env` files committed to Git
- [x] All hardcoded localhost URLs use environment variables
- [x] Production logger enabled (`backend/utils/logger.js`)
- [x] All API errors handled gracefully with fallbacks
- [x] Input validation on all routes
- [x] MongoDB sanitization enabled
- [x] Rate limiting configured
- [x] CORS whitelist configured
- [x] Security headers (Helmet) enabled
- [x] JWT secret is cryptographically strong (32+ bytes)
- [x] Passwords hashed with bcrypt (12 rounds)

### Testing

- [ ] Run backend tests: `cd backend && npm test`
- [ ] Run AI service tests: `cd ai-services && pytest`
- [ ] Test registration flow locally
- [ ] Test login flow locally
- [ ] Test AI conversation locally
- [ ] Test recommendations generation locally
- [ ] Test all error states (invalid inputs, network failures)
- [ ] Test mobile responsive design
- [ ] Test dark mode (if applicable)

### Documentation

- [x] README.md complete
- [x] API documentation complete (docs/API.md)
- [x] Architecture documented (docs/ARCHITECTURE.md)
- [x] Deployment guide created
- [x] Troubleshooting guide available
- [x] CHANGELOG.md updated
- [x] Environment variables documented

---

## 🗄️ Database Setup

### MongoDB Atlas

- [ ] Create MongoDB Atlas account
- [ ] Create M0 (free) cluster
- [ ] Choose region close to backend deployment
- [ ] Create database user with strong password
- [ ] Whitelist IP: `0.0.0.0/0` (or specific IPs)
- [ ] Get connection string
- [ ] Test connection with mongosh or Compass

### Database Indexes

Connect and run:

```javascript
use elevare;

db.users.createIndex({ email: 1 }, { unique: true });
db.userprofiles.createIndex({ userId: 1 }, { unique: true });
db.conversations.createIndex({ userId: 1, timestamp: -1 });
db.recommendations.createIndex({ userId: 1, createdAt: -1 });
```

---

## 🔑 API Keys

### Groq API

- [ ] Create account at https://console.groq.com
- [ ] Generate API key
- [ ] Verify key works:
  ```bash
  curl https://api.groq.com/openai/v1/chat/completions \
    -H "Authorization: Bearer YOUR_KEY" \
    -H "Content-Type: application/json" \
    -d '{"model":"llama-3.3-70b-versatile","messages":[{"role":"user","content":"test"}],"max_tokens":5}'
  ```

### JWT Secret

- [ ] Generate secure secret:
  ```bash
  openssl rand -base64 32
  ```
- [ ] Save securely (password manager recommended)

---

## 🚀 Backend Deployment (Railway)

### Deploy Backend

```bash
cd backend
npm install -g @railway/cli
railway login
railway init
railway up
```

### Environment Variables in Railway

Go to Railway dashboard → Variables:

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elevare
JWT_SECRET=<your_generated_secret>
JWT_EXPIRE=7d
AI_SERVICE_URL=https://your-ai-service.railway.app
CORS_ORIGIN=https://your-frontend.vercel.app
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### Verify Deployment

- [ ] Backend URL accessible: `https://your-backend.railway.app`
- [ ] Health check passes: `curl https://your-backend.railway.app/health`
- [ ] Logs show: `✅ MongoDB connected successfully`

---

## 🤖 AI Service Deployment (Railway)

### Deploy AI Service

```bash
cd ai-services
railway init
railway up
```

### Environment Variables in Railway

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elevare
GROQ_API_KEY=gsk_your_actual_key
AI_SERVICE_PORT=8000
ENVIRONMENT=production
LOG_LEVEL=INFO
```

### Verify Deployment

- [ ] AI service URL accessible: `https://your-ai-service.railway.app`
- [ ] Health check passes: `curl https://your-ai-service.railway.app/health`
- [ ] Logs show: `✅ GROQ_API_KEY configured`

---

## 🎨 Frontend Deployment (Vercel)

### Push to GitHub

```bash
git add .
git commit -m "feat: production deployment ready"
git push origin main
```

### Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import GitHub repo: `ELEVARE`
4. **Root Directory:** `frontend`
5. **Framework:** Vite
6. **Build Command:** `npm run build`
7. **Output Directory:** `dist`
8. Click "Deploy"

### Environment Variables in Vercel

Settings → Environment Variables:

```
VITE_API_URL=https://your-backend.railway.app/api
```

### After Adding Variables

- [ ] Redeploy: Deployments → Latest → "..." → "Redeploy"
- [ ] Wait for build to complete

### Verify Deployment

- [ ] Frontend accessible: `https://your-frontend.vercel.app`
- [ ] Registration page loads
- [ ] No console errors in browser DevTools
- [ ] API calls work (check Network tab)

---

## 🔗 Update CORS

After deploying frontend, update backend `CORS_ORIGIN`:

In Railway backend variables:

```
CORS_ORIGIN=https://your-frontend.vercel.app
```

Then redeploy backend.

---

## 🧪 Production Testing

### 1. Create Test User

- [ ] Go to `https://your-frontend.vercel.app/register`
- [ ] Register with valid email and password
- [ ] Verify registration success
- [ ] Check you're redirected to dashboard

### 2. Test AI Chat

- [ ] Navigate to `/reflection`
- [ ] Send a test message: "I love solving complex problems"
- [ ] Wait for AI response (may take 3-5 seconds)
- [ ] Verify response is intelligent, not generic fallback

### 3. Check Profile Updates

- [ ] Navigate to `/personality`
- [ ] Verify Big Five radar chart displays
- [ ] Check traits are updating

### 4. Generate Recommendations

- [ ] Complete 3-5 conversations
- [ ] Navigate to `/careers`
- [ ] Click "Generate Recommendations"
- [ ] Verify recommendations appear with confidence scores

### 5. Check Logs

**Backend:**
```bash
railway logs --follow
```

Look for:
- `✅ MongoDB connected successfully`
- `✅ AI Service response received`
- No error stack traces

**AI Service:**
```bash
railway logs --follow
```

Look for:
- `✅ GROQ_API_KEY configured`
- `✅ ELEVARE AI Services ready`

---

## 🔒 Security Verification

- [ ] HTTPS enabled on all services
- [ ] JWT tokens expire (default 7 days)
- [ ] Passwords meet requirements (8 chars, uppercase, lowercase, number)
- [ ] Rate limiting active (test by making 11+ requests quickly)
- [ ] CORS only allows your frontend domain
- [ ] MongoDB connection uses SSL/TLS (Atlas default)
- [ ] Environment variables not exposed in frontend bundle
- [ ] No `.env` files in Git history

---

## 📊 Monitoring Setup (Optional)

### Error Tracking (Sentry)

```bash
cd frontend
npm install @sentry/react
```

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your_sentry_dsn",
  environment: "production"
});
```

### Uptime Monitoring

- [ ] Sign up for [UptimeRobot](https://uptimerobot.com) (free)
- [ ] Add monitor for backend: `https://your-backend.railway.app/health`
- [ ] Add monitor for frontend: `https://your-frontend.vercel.app`

---

## 🎯 Performance Optimization

### Frontend

- [x] Vite build with code splitting
- [x] Vendor chunks separated
- [x] Sourcemaps disabled for production
- [ ] Vercel Analytics enabled (optional)
- [ ] Vercel Speed Insights enabled (optional)

### Backend

- [x] MongoDB indexes created
- [x] Connection pooling configured
- [ ] Add Redis cache for recommendations (optional)

### Database

- [ ] MongoDB connection pool size: 10
- [ ] Query projections limit returned fields
- [ ] All frequently queried fields indexed

---

## 📝 Post-Deployment

### Announce Launch

- [ ] Update README.md with live URLs
- [ ] Create GitHub release tag (v2.0.0)
- [ ] Share on social media (LinkedIn, Twitter)
- [ ] Post in relevant communities (Reddit, Dev.to)

### Monitor for 24 Hours

- [ ] Check error rates
- [ ] Monitor API response times
- [ ] Watch for CORS errors
- [ ] Verify LLM responses are working
- [ ] Check database for conversation growth

### Gather Feedback

- [ ] Ask 3-5 users to test
- [ ] Note any bugs or confusion
- [ ] Collect feature requests
- [ ] Monitor GitHub issues

---

## 🆘 Rollback Plan

### If Frontend Fails

1. Vercel → Deployments
2. Find last working deployment
3. Click "..." → "Promote to Production"

### If Backend Fails

1. Railway dashboard → Deployments
2. Select previous version
3. Click "Redeploy"

### If Database Issues

1. Check MongoDB Atlas connection
2. Verify credentials
3. Check IP whitelist
4. Review connection string format

---

## 📞 Support Contacts

- **Railway Support:** https://railway.app/help
- **Vercel Support:** https://vercel.com/support
- **MongoDB Support:** https://www.mongodb.com/support
- **Groq Support:** https://console.groq.com/docs

---

## ✅ Final Checklist

- [ ] All services deployed and accessible
- [ ] Environment variables set correctly
- [ ] CORS configured properly
- [ ] Database indexes created
- [ ] Test user can register
- [ ] Test user can chat with AI
- [ ] Test user can get recommendations
- [ ] All health checks passing
- [ ] No errors in production logs
- [ ] README updated with live URLs
- [ ] GitHub release created

---

**🎉 Congratulations! ELEVARE is now live in production!**

Share your live URL:
```
https://your-frontend.vercel.app
```

Monitor for the first 24 hours and be ready to respond to user feedback.
