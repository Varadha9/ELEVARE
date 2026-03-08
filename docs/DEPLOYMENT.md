# ELEVARE Deployment Guide

## Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- Python 3.9+
- MongoDB 6+
- Git

### Step 1: Clone Repository
```bash
git clone <repository-url>
cd ELEVARE
```

### Step 2: Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/elevare
# JWT_SECRET=your_secret_key
# AI_SERVICE_URL=http://localhost:8000

# Start backend
npm run dev
```

Backend will run on `http://localhost:5000`

### Step 3: AI Services Setup
```bash
cd ai-services

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download NLTK data
python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"

# Start AI service
python main.py
```

AI service will run on `http://localhost:8000`

### Step 4: Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm run dev
```

Frontend will run on `http://localhost:3000`

### Step 5: Database Setup
```bash
# Start MongoDB
mongod --dbpath ./data/db

# Optional: Seed career data
cd ai-services
python -c "
from data.career_data import CAREER_DATABASE
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/')
db = client['elevare']
db.careers.delete_many({})
db.careers.insert_many(CAREER_DATABASE)
print('Career database seeded!')
"
```

---

## Production Deployment

### Option 1: AWS Deployment

#### Backend (EC2)
```bash
# Launch EC2 instance (Ubuntu 22.04)
# SSH into instance

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone <repo>
cd ELEVARE/backend
npm install --production

# Install PM2
sudo npm install -g pm2

# Start with PM2
pm2 start server.js --name elevare-backend
pm2 startup
pm2 save

# Configure nginx reverse proxy
sudo apt install nginx
# Edit /etc/nginx/sites-available/default
```

Nginx configuration:
```nginx
server {
    listen 80;
    server_name api.elevare.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### AI Services (EC2 with GPU - Optional)
```bash
# Launch EC2 instance (g4dn.xlarge for GPU)
# Install Python and dependencies

sudo apt update
sudo apt install python3-pip python3-venv

# Clone and setup
cd ELEVARE/ai-services
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Install CUDA for GPU (optional)
# Follow NVIDIA CUDA installation guide

# Start with systemd
sudo nano /etc/systemd/system/elevare-ai.service
```

Systemd service:
```ini
[Unit]
Description=ELEVARE AI Service
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/ELEVARE/ai-services
Environment="PATH=/home/ubuntu/ELEVARE/ai-services/venv/bin"
ExecStart=/home/ubuntu/ELEVARE/ai-services/venv/bin/python main.py
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable elevare-ai
sudo systemctl start elevare-ai
```

#### Database (MongoDB Atlas)
```bash
# Create MongoDB Atlas account
# Create cluster
# Get connection string
# Update backend .env with Atlas URI

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elevare
```

#### Frontend (Vercel)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel --prod

# Configure environment variables in Vercel dashboard
# VITE_API_URL=https://api.elevare.com
```

### Option 2: Docker Deployment

#### Create Dockerfiles

**backend/Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

**ai-services/Dockerfile:**
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
COPY . .
EXPOSE 8000
CMD ["python", "main.py"]
```

**frontend/Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db

  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/elevare
      - JWT_SECRET=${JWT_SECRET}
      - AI_SERVICE_URL=http://ai-service:8000
    depends_on:
      - mongodb

  ai-service:
    build: ./ai-services
    ports:
      - "8000:8000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/elevare
    depends_on:
      - mongodb

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongodb_data:
```

Deploy with Docker:
```bash
docker-compose up -d
```

### Option 3: Kubernetes Deployment

Create Kubernetes manifests in `k8s/` directory:
- `mongodb-deployment.yaml`
- `backend-deployment.yaml`
- `ai-service-deployment.yaml`
- `frontend-deployment.yaml`
- `ingress.yaml`

Deploy:
```bash
kubectl apply -f k8s/
```

---

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/elevare
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
AI_SERVICE_URL=http://localhost:8000
NODE_ENV=production
```

### AI Services (.env)
```
MONGODB_URI=mongodb://localhost:27017/elevare
AI_SERVICE_PORT=8000
MODEL_CACHE_DIR=./models/cache
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

---

## Security Checklist

- [ ] Change JWT_SECRET to strong random string
- [ ] Enable MongoDB authentication
- [ ] Configure CORS for production domains
- [ ] Enable HTTPS with SSL certificates
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Regular security updates
- [ ] Backup database regularly
- [ ] Monitor logs for suspicious activity
- [ ] Use environment variables for secrets

---

## Monitoring & Maintenance

### Logging
```bash
# Backend logs
pm2 logs elevare-backend

# AI service logs
sudo journalctl -u elevare-ai -f

# MongoDB logs
sudo journalctl -u mongod -f
```

### Health Checks
```bash
# Backend health
curl http://localhost:5000/health

# AI service health
curl http://localhost:8000/health
```

### Database Backup
```bash
# Backup MongoDB
mongodump --uri="mongodb://localhost:27017/elevare" --out=/backup/$(date +%Y%m%d)

# Restore MongoDB
mongorestore --uri="mongodb://localhost:27017/elevare" /backup/20240115
```

### Performance Monitoring
- Use PM2 monitoring: `pm2 monit`
- MongoDB Atlas monitoring dashboard
- AWS CloudWatch for EC2 metrics
- Application Performance Monitoring (APM) tools

---

## Scaling Strategies

1. **Horizontal Scaling:**
   - Multiple backend instances behind load balancer
   - Multiple AI service instances
   - MongoDB replica set

2. **Vertical Scaling:**
   - Increase EC2 instance size
   - Add GPU for AI service
   - Increase MongoDB resources

3. **Caching:**
   - Redis for session management
   - CDN for frontend assets
   - Model caching in AI service

4. **Database Optimization:**
   - Proper indexing
   - Query optimization
   - Sharding for large datasets

---

## Troubleshooting

### Backend won't start
```bash
# Check MongoDB connection
mongo --eval "db.adminCommand('ping')"

# Check port availability
netstat -an | grep 5000

# Check logs
npm run dev
```

### AI service errors
```bash
# Check Python dependencies
pip list

# Test imports
python -c "import transformers; print('OK')"

# Check model downloads
ls -la models/cache/
```

### Frontend build fails
```bash
# Clear cache
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+
```

---

## Support & Documentation

- API Documentation: `/docs/API.md`
- Architecture: `/docs/ARCHITECTURE.md`
- GitHub Issues: <repository-url>/issues
- Email: support@elevare.com
