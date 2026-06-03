# 🚀 Production Deployment Guide

## Prerequisites

- MongoDB Atlas account (free tier available)
- Groq API key from https://console.groq.com/keys
- Domain name (optional but recommended)
- Hosting platforms:
  - **Frontend**: Vercel, Netlify, or AWS S3 + CloudFront
  - **Backend**: Railway, Render, AWS EC2, or Heroku
  - **AI Service**: Fly.io, Railway, or AWS Lambda

---

## Quick Deploy with Docker

### 1. Setup Environment Variables

```bash
# Copy template
cp .env.template .env

# Edit with your values
nano .env
```

Required variables:
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Generate with: `openssl rand -base64 32`
- `GROQ_API_KEY` - From Groq console
- `CORS_ORIGIN` - Your frontend URL

### 2. Deploy with Docker Compose

```bash
# Build and start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Check health
curl http://localhost:5000/health
curl http://localhost:8000/health
```

---

## MongoDB Atlas Setup

### 1. Create Cluster

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free M0 cluster
3. Choose region closest to your users
4. Create database user with password
5. Add IP whitelist (0.0.0.0/0 for development)

### 2. Get Connection String

```
mongodb+srv://<username>:<password>@cluster.mongodb.net/elevare?retryWrites=true&w=majority
```

### 3. Configure Indexes (Performance Optimization)

Connect to your cluster and run:

```javascript
use elevare;

// Users collection
db.users.createIndex({ email: 1 }, { unique: true });

// UserProfiles collection
db.userprofiles.createIndex({ userId: 1 }, { unique: true });

// Conversations collection
db.conversations.createIndex({ userId: 1, timestamp: -1 });

// Recommendations collection
db.recommendations.createIndex({ userId: 1, createdAt: -1 });
```

---

## Railway Deployment (Recommended)

### Backend

1. Install Railway CLI:
```bash
npm install -g @railway/cli
railway login
```

2. Deploy backend:
```bash
cd backend
railway init
railway up
```

3. Add environment variables in Railway dashboard:
```
MONGODB_URI=your_atlas_uri
JWT_SECRET=your_secret
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
MONGODB_URI=your_atlas_uri
GROQ_API_KEY=your_groq_key
```

---

## Vercel Deployment (Frontend)

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Deploy

```bash
cd frontend
vercel
```

### 3. Configure Environment

In Vercel dashboard:
```
VITE_API_URL=https://your-backend.railway.app
```

### 4. Custom Domain (Optional)

1. Go to Vercel project settings
2. Add custom domain
3. Update DNS records as instructed

---

## Security Checklist

### ✅ Before Going Live

- [ ] Change default JWT_SECRET
- [ ] Enable MongoDB Atlas IP whitelist
- [ ] Configure CORS to specific domains
- [ ] Enable HTTPS/TLS on all services
- [ ] Set up environment-specific configs
- [ ] Enable MongoDB backup (Atlas)
- [ ] Configure rate limiting
- [ ] Review and update security headers
- [ ] Test authentication flows
- [ ] Verify error messages don't leak sensitive data

### ✅ Monitoring Setup

- [ ] Set up error tracking (Sentry)
- [ ] Configure uptime monitoring (UptimeRobot)
- [ ] Enable application logs
- [ ] Set up alerts for critical errors
- [ ] Monitor API rate limits

---

## Performance Optimization

### Backend

```javascript
// Add to server.js
import compression from 'compression';
app.use(compression());
```

### Database

- Enable MongoDB connection pooling
- Add appropriate indexes
- Use projections to limit returned fields
- Implement caching for frequently accessed data

### Frontend

- Enable gzip/brotli compression
- Use CDN for static assets
- Implement lazy loading
- Optimize images

---

## Monitoring & Logs

### Application Logs

Logs are stored in `/logs` directory:
- `info.log` - General application logs
- `error.log` - Error logs

### Health Check Endpoints

- Backend: `GET /health`
- AI Service: `GET /health`

Response example:
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

## Scaling Considerations

### Horizontal Scaling

1. **Load Balancer**: Use Nginx or AWS ALB
2. **Multiple Instances**: Deploy multiple backend/AI service instances
3. **Session Management**: Use MongoDB for session storage

### Vertical Scaling

- Start with 1GB RAM minimum
- Scale up based on traffic:
  - 100 users/day: 1GB
  - 1000 users/day: 2GB
  - 10000 users/day: 4GB+

---

## Backup Strategy

### Database Backups

MongoDB Atlas automatic backups:
- Enable continuous backup
- Set retention period (7-30 days)
- Test restore procedure

### Application Code

- Use Git version control
- Tag releases
- Maintain staging environment

---

## Troubleshooting

### Common Issues

**Database Connection Failed**
```bash
# Check connection string format
# Verify IP whitelist in Atlas
# Test connection:
mongosh "mongodb+srv://..."
```

**CORS Errors**
```bash
# Update CORS_ORIGIN in backend .env
# Restart backend service
```

**AI Service Timeout**
```bash
# Check Groq API key validity
# Verify AI_SERVICE_URL is correct
# Check AI service logs
```

### Debug Mode

```bash
# Backend
LOG_LEVEL=debug npm start

# AI Service
LOG_LEVEL=DEBUG python main.py
```

---

## Rollback Procedure

### Railway/Render

1. Go to deployments tab
2. Select previous deployment
3. Click "Redeploy"

### Vercel

```bash
vercel rollback
```

---

## Support

- Documentation: `docs/`
- Issues: GitHub Issues
- Email: support@elevare.com

---

## Post-Deployment Checklist

- [ ] All services responding to health checks
- [ ] User registration working
- [ ] User login working
- [ ] Chat functionality working
- [ ] Recommendations generating
- [ ] MongoDB backups configured
- [ ] Monitoring/alerts active
- [ ] SSL certificates valid
- [ ] Custom domain configured (if applicable)
- [ ] Performance metrics baseline established
