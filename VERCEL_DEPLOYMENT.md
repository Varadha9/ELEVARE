# 🚀 Vercel Deployment Guide

Complete guide to deploy ELEVARE frontend to Vercel.

---

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Backend deployed (Railway/Render/your own server)
- MongoDB Atlas cluster
- Groq API key

---

## Quick Deploy (5 Minutes)

### 1. Push to GitHub

```bash
cd /home/varad/projects/ELEVARE
git add .
git commit -m "feat: prepare for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import your GitHub repository: `ELEVARE`
4. **Root Directory:** `frontend`
5. **Framework Preset:** Vite
6. **Build Command:** `npm run build`
7. **Output Directory:** `dist`
8. Click "Deploy"

### 3. Configure Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
VITE_API_URL=https://your-backend-api.com/api
```

### 4. Redeploy

After adding environment variables:
- Go to Deployments tab
- Click "..." on latest deployment → "Redeploy"

---

## Backend Deployment Options

### Option 1: Railway (Recommended)

**Deploy Backend:**
```bash
cd backend
npm install -g @railway/cli
railway login
railway init
railway up
```

**Deploy AI Service:**
```bash
cd ai-services
railway init
railway up
```

**Set Environment Variables in Railway dashboard:**

Backend:
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elevare
JWT_SECRET=<generate with: openssl rand -base64 32>
AI_SERVICE_URL=https://your-ai-service.railway.app
CORS_ORIGIN=https://your-frontend.vercel.app
```

AI Service:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elevare
GROQ_API_KEY=your_groq_api_key_here
```

**Get URLs:**
- Backend URL: `https://your-backend.railway.app`
- AI Service URL: `https://your-ai-service.railway.app`

Use the backend URL in Vercel's `VITE_API_URL`.

### Option 2: Render

1. Create account at [render.com](https://render.com)
2. New Web Service → Connect your GitHub repo
3. Select `backend` directory
4. Add environment variables
5. Deploy

---

## MongoDB Atlas Setup

### 1. Create Cluster

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. Choose region closest to your backend
4. Create database user with password
5. Add IP whitelist: `0.0.0.0/0` (allow all) — or specific IPs

### 2. Get Connection String

```
mongodb+srv://<username>:<password>@cluster.mongodb.net/elevare?retryWrites=true&w=majority
```

### 3. Create Indexes (Performance)

Connect via MongoDB Compass or `mongosh`:

```javascript
use elevare;

db.users.createIndex({ email: 1 }, { unique: true });
db.userprofiles.createIndex({ userId: 1 }, { unique: true });
db.conversations.createIndex({ userId: 1, timestamp: -1 });
db.recommendations.createIndex({ userId: 1, createdAt: -1 });
```

---

## Environment Variables Reference

### Frontend (Vercel)

```
VITE_API_URL=https://your-backend.railway.app/api
```

### Backend (Railway/Render)

```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elevare
JWT_SECRET=<32-byte random string>
JWT_EXPIRE=7d
AI_SERVICE_URL=https://your-ai-service.railway.app
CORS_ORIGIN=https://your-frontend.vercel.app
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### AI Service (Railway/Render)

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elevare
GROQ_API_KEY=gsk_your_actual_groq_key
AI_SERVICE_PORT=8000
ENVIRONMENT=production
LOG_LEVEL=INFO
```

---

## Custom Domain (Optional)

### 1. Add Domain in Vercel

1. Go to Vercel project → Settings → Domains
2. Add your domain (e.g., `elevare.com`)
3. Follow DNS configuration instructions

### 2. Update CORS

After adding custom domain, update backend `CORS_ORIGIN`:

```
CORS_ORIGIN=https://elevare.com,https://www.elevare.com,https://your-frontend.vercel.app
```

---

## Troubleshooting

### "Network Error" in browser

**Cause:** `VITE_API_URL` not set or incorrect.

**Fix:**
1. Check Vercel → Settings → Environment Variables
2. Ensure `VITE_API_URL` points to your backend
3. Redeploy after changing environment variables

---

### CORS Error

**Cause:** Backend `CORS_ORIGIN` doesn't include your Vercel URL.

**Fix:**
1. Get your Vercel URL (e.g., `https://elevare-xyz.vercel.app`)
2. Add to backend `CORS_ORIGIN` environment variable
3. Restart backend

---

### 404 on Page Refresh

**Cause:** Missing SPA routing configuration.

**Fix:** Already handled by `vercel.json` in the project.

---

### Build Fails

**Cause:** Node.js version mismatch or missing dependencies.

**Fix:**
1. Vercel → Settings → General → Node.js Version → 18.x
2. Check `package.json` has all dependencies listed
3. Clear build cache and redeploy

---

## Monitoring

### Vercel Analytics (Built-in)

1. Go to project → Analytics tab
2. View page views, unique visitors, performance

### Backend Monitoring

Use Railway/Render built-in logs:
```bash
railway logs --follow
```

### Error Tracking (Optional)

Add Sentry for error tracking:

```bash
npm install @sentry/react
```

```javascript
// src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your_sentry_dsn",
  environment: import.meta.env.MODE
});
```

---

## Performance Optimization

### 1. Enable Vercel Speed Insights

```bash
npm install @vercel/speed-insights
```

```javascript
// src/main.jsx
import { SpeedInsights } from '@vercel/speed-insights/react';

<App />
<SpeedInsights />
```

### 2. Enable Image Optimization

Vercel automatically optimizes images served from your domain.

### 3. Add Caching Headers

Already configured in `vercel.json`.

---

## Cost Estimates

| Service | Free Tier | Paid (if needed) |
|---------|-----------|------------------|
| Vercel | 100 GB bandwidth | $20/month Pro |
| Railway | $5 free credit | ~$10-15/month |
| MongoDB Atlas | 512 MB storage | $9/month M2 |
| Groq API | 30 req/min free | Pay per use |
| **Total** | **Free** | **~$20-30/month** |

For a student project or small user base, the free tiers are sufficient.

---

## Production Checklist

Before going public:

- [ ] Backend deployed with HTTPS
- [ ] MongoDB Atlas cluster configured
- [ ] Environment variables set in Vercel
- [ ] Environment variables set in Railway/Render
- [ ] CORS configured correctly
- [ ] Custom domain added (optional)
- [ ] Database indexes created
- [ ] Health checks passing
- [ ] Error tracking configured (optional)
- [ ] Test user registration flow
- [ ] Test AI chat flow
- [ ] Test recommendations generation

---

## Testing Production Deployment

### 1. Register a Test User

Go to `https://your-frontend.vercel.app/register`

### 2. Test AI Chat

Go to `/reflection` and send a message.

### 3. Check Backend Logs

```bash
railway logs --follow
```

Look for:
- `✅ MongoDB connected`
- `✅ AI Service response received`

### 4. Generate Recommendations

After 3-5 conversations, go to `/careers` and click "Generate Recommendations."

---

## Rollback Procedure

### If Deployment Fails

1. Go to Vercel → Deployments
2. Find the last working deployment
3. Click "..." → "Promote to Production"

### If Backend Fails

1. Go to Railway/Render dashboard
2. Deployments → Select previous version
3. Redeploy

---

## Support

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **MongoDB Atlas:** https://www.mongodb.com/docs/atlas
- **ELEVARE Issues:** https://github.com/Varadha9/ELEVARE/issues

---

## Example Deployment URLs

```
Frontend:     https://elevare.vercel.app
Backend API:  https://elevare-backend.railway.app
AI Service:   https://elevare-ai.railway.app
MongoDB:      mongodb+srv://cluster.mongodb.net/elevare
```

Update these in your environment variables after deployment.

---

**🎉 Your ELEVARE app is now live on Vercel!**

Share your URL and start helping people discover their career paths.
