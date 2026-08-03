# Deployment Guide

---

## Pre-Deployment Checklist

### Security
- [ ] Generate strong `JWT_SECRET` (`openssl rand -base64 32`)
- [ ] Set strong `ADMIN_PASSWORD` (server refuses to start without it)
- [ ] Rotate any credentials previously committed to git history
- [ ] Configure `CORS_ORIGIN` to your exact frontend domain
- [ ] Enable MongoDB authentication
- [ ] Configure HTTPS/TLS on all public endpoints
- [ ] Review rate limiting settings

### Performance
- [ ] Create MongoDB indexes (see [INSTALLATION.md](./INSTALLATION.md))
- [ ] Enable gzip compression on backend
- [ ] Configure CDN for frontend static assets

### Monitoring
- [ ] Application logging enabled
- [ ] Error tracking configured (Sentry recommended)
- [ ] Uptime monitoring configured
- [ ] Health check endpoints verified

---

## Deployment Options

| Option | Frontend | Backend | AI Service | Database |
|--------|----------|---------|-----------|---------|
| Simple cloud | Vercel | Railway / Render | Railway / Fly.io | MongoDB Atlas |
| AWS | S3 + CloudFront | EC2 / ECS | EC2 | MongoDB Atlas |
| Docker | Nginx container | Docker | Docker | MongoDB container |

---

## Environment Variables

### Backend (`backend/.env`)

```env
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/elevare?retryWrites=true&w=majority

JWT_SECRET=<64-char random secret>
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12

AI_SERVICE_URL=https://your-ai-service.com
CORS_ORIGIN=https://your-frontend-domain.com

RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

LOG_LEVEL=info
```

### AI Services (`ai-services/.env`)

```env
PYTHONENV=production
AI_SERVICE_PORT=8000
AI_SERVICE_HOST=0.0.0.0

MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/elevare

GROQ_API_KEY=<your Groq API key>

LOG_LEVEL=INFO
```

### Frontend (Vercel / build arg)

```env
VITE_API_URL=https://your-backend-api.com
```

---

## Docker Deployment

### docker-compose.yml

The project ships with a `docker-compose.yml`. Key points:

- `VITE_API_URL` is passed as a **build arg** to the frontend container so Vite bakes the correct API URL into the bundle at build time.
- Backend and AI service receive secrets via environment variables — never baked into images.
- All `.env` files are excluded from Docker images via `.dockerignore`.

```bash
# Copy and fill in the template
cp .env.template .env

# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Health checks
curl http://localhost:5000/health
curl http://localhost:8000/health
```

### Scaling

```bash
# Scale backend and AI service independently
docker-compose up -d --scale backend=3 --scale ai-service=2
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

Set environment variables in the Railway dashboard:
```
MONGODB_URI=<atlas uri>
JWT_SECRET=<strong secret>
AI_SERVICE_URL=https://your-ai-service.railway.app
CORS_ORIGIN=https://your-frontend.vercel.app
NODE_ENV=production
```

### AI Service

```bash
cd ai-services
railway init
railway up
```

Environment variables:
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

The project includes a `vercel.json` with:
- `"framework": "vite"` (modern config, no deprecated builders)
- SPA rewrites so all routes resolve to `index.html`
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)

---

## MongoDB Atlas Setup

1. Create a free M0 cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user with a strong password
3. Add your server IP to the IP whitelist (or `0.0.0.0/0` for Railway/Render)
4. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster.mongodb.net/elevare?retryWrites=true&w=majority
   ```
5. Create indexes after first deploy:
   ```javascript
   use elevare
   db.users.createIndex({ email: 1 }, { unique: true })
   db.userprofiles.createIndex({ userId: 1 }, { unique: true })
   db.conversations.createIndex({ userId: 1, timestamp: -1 })
   db.recommendations.createIndex({ userId: 1, createdAt: -1 })
   ```

---

## HTTPS / Nginx

For self-hosted deployments, use Nginx as a reverse proxy with Let's Encrypt:

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

Example `nginx.conf` snippet:

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;

    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;

    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://backend:5000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## CI/CD (GitHub Actions)

The project includes `.github/workflows/ci-cd.yml`. It runs on every push to `main`:

1. Spins up MongoDB service container
2. Installs backend, frontend, and AI service dependencies
3. Runs backend tests (`npm test`)
4. Runs AI service tests (`pytest`)
5. Deploys to production on success (configure your deploy step)

Required GitHub secrets:
```
MONGODB_URI
JWT_SECRET
GROQ_API_KEY
```

---

## Database Backups

```bash
# Dump
mongodump --uri="$MONGODB_URI" --db=elevare --out=/backups/$(date +%Y%m%d)

# Restore
mongorestore --uri="$MONGODB_URI" --db=elevare --drop /backups/<date>/elevare
```

MongoDB Atlas provides automatic continuous backups on paid tiers. Enable them in the Atlas dashboard.

---

## Monitoring

**Health endpoints:**
- Backend: `GET /health` — returns `healthy` (200) or `degraded` (503)
- AI Service: `GET /health` — returns service status and component list

**Application logs:**
- Backend logs to `backend/logs/` in production (`NODE_ENV=production`)
- AI service logs to `ai-services/logs/`

**Recommended tools:**
- Error tracking: [Sentry](https://sentry.io)
- Uptime monitoring: [UptimeRobot](https://uptimerobot.com) (free)
- Log aggregation: [Logtail](https://logtail.com) / [Papertrail](https://papertrailapp.com)

---

## Rollback

**Railway / Render:** Go to the Deployments tab → select a previous deployment → Redeploy.

**Vercel:**
```bash
vercel rollback
```

**Docker:**
```bash
# Roll back to a previous image tag
docker-compose down
docker-compose up -d --build  # with previous image tag pinned
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
