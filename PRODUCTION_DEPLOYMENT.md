# Production Deployment Guide

---

## Prerequisites

- MongoDB Atlas account — https://www.mongodb.com/cloud/atlas (free M0 tier available)
- Groq API key — https://console.groq.com/keys
- Hosting platforms:
  - **Frontend:** Vercel or Netlify
  - **Backend:** Railway or Render
  - **AI Service:** Railway or Fly.io

---

## Environment Setup

```bash
cp .env.template .env
```

Required values in `.env`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/elevare?retryWrites=true&w=majority
JWT_SECRET=<generate: openssl rand -base64 32>
GROQ_API_KEY=<from https://console.groq.com/keys>
CORS_ORIGIN=https://your-frontend.vercel.app
```

> The backend will refuse to start if `JWT_SECRET` is missing or shorter than 32 characters.

---

## Docker Deployment

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Health checks
curl http://localhost:5000/health
curl http://localhost:8000/health
```

The `docker-compose.yml` passes `VITE_API_URL` as a build argument to the frontend container so Vite bakes the correct API URL into the bundle at build time.

---

## MongoDB Atlas Setup

1. Create a free M0 cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user with a strong password
3. Add your server IP to the IP whitelist (or `0.0.0.0/0` for Railway/Render)
4. Copy the connection string and set it as `MONGODB_URI`

Create indexes after first deploy:

```javascript
use elevare

db.users.createIndex({ email: 1 }, { unique: true })
db.userprofiles.createIndex({ userId: 1 }, { unique: true })
db.conversations.createIndex({ userId: 1, timestamp: -1 })
db.recommendations.createIndex({ userId: 1, createdAt: -1 })
```

---

## Railway Deployment (Recommended)

### Backend

```bash
npm install -g @railway/cli
railway login

cd backend
railway init
railway up
```

Set in Railway dashboard:
```
MONGODB_URI=<atlas uri>
JWT_SECRET=<strong secret>
AI_SERVICE_URL=https://your-ai-service.railway.app
CORS_ORIGIN=https://your-frontend.vercel.app
NODE_ENV=production
ADMIN_PASSWORD=<strong admin password>
```

### AI Service

```bash
cd ai-services
railway init
railway up
```

Set in Railway dashboard:
```
MONGODB_URI=<atlas uri>
GROQ_API_KEY=<your key>
```

---

## Vercel Deployment (Frontend)

```bash
npm install -g vercel
cd frontend
vercel
```

In the Vercel dashboard, add:
```
VITE_API_URL=https://your-backend.railway.app
```

The project's `vercel.json` uses the modern `"framework": "vite"` config with SPA rewrites and security headers — no deprecated builders.

---

## Security Checklist

### Before Going Live

- [ ] `JWT_SECRET` is a strong random value (min 32 chars)
- [ ] `ADMIN_PASSWORD` is set and strong
- [ ] `CORS_ORIGIN` is restricted to your production frontend domain
- [ ] MongoDB Atlas IP whitelist is configured
- [ ] HTTPS/TLS enabled on all public endpoints
- [ ] All credentials rotated if previously committed to git history
- [ ] Rate limiting configured
- [ ] Error messages don't leak sensitive data

### Monitoring Setup

- [ ] Error tracking configured (Sentry)
- [ ] Uptime monitoring configured (UptimeRobot)
- [ ] Application logs enabled
- [ ] Alerts set for critical errors
- [ ] API rate limits monitored

---

## Performance Optimization

**Backend:**
```javascript
// Add to server.js
import compression from 'compression';
app.use(compression());
```

**Database:**
- Enable MongoDB connection pooling (already configured in `config/db.js`)
- Use projections to limit returned fields
- Implement Redis caching for frequently accessed profile data

**Frontend:**
- Vite production build includes automatic code splitting and tree shaking
- Enable gzip/brotli on your CDN or Nginx

---

## Health Check Endpoints

- Backend: `GET /health` — returns `healthy` (200) or `degraded` (503)
- AI Service: `GET /health` — returns service status and component list

```json
{
  "status": "healthy",
  "uptime": 12345,
  "services": {
    "database": { "status": "healthy" },
    "aiService": { "status": "healthy" }
  }
}
```

---

## Scaling

The backend is stateless (JWT auth) — multiple instances can run behind a load balancer without session sharing.

The AI service is the most resource-intensive component (~2–4s per LLM call). Scale it independently.

| Daily Users | Recommended RAM |
|-------------|----------------|
| < 100 | 1 GB |
| 100–1000 | 2 GB |
| 1000–10000 | 4 GB+ |

---

## Database Backups

```bash
# Dump
mongodump --uri="$MONGODB_URI" --db=elevare --out=/backups/$(date +%Y%m%d)

# Restore
mongorestore --uri="$MONGODB_URI" --db=elevare --drop /backups/<date>/elevare
```

MongoDB Atlas provides automatic continuous backups on paid tiers.

---

## Rollback

**Railway / Render:** Deployments tab → select previous deployment → Redeploy.

**Vercel:**
```bash
vercel rollback
```

---

## Post-Deployment Checklist

- [ ] All health checks return `healthy`
- [ ] User registration and login working
- [ ] Chat sends and receives AI responses
- [ ] Recommendations generate after conversations
- [ ] MongoDB backups configured
- [ ] SSL certificate valid
- [ ] Monitoring and alerts active
- [ ] CORS restricted to production frontend domain

---

## Support

- Documentation: `docs/`
- Issues: https://github.com/Varadha9/ELEVARE/issues
