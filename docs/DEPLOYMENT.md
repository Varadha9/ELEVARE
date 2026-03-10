# ELEVARE - Deployment Guide

## 🚀 Deployment Overview

This guide covers deploying ELEVARE to various production environments, from simple cloud hosting to enterprise-grade infrastructure.

## 📋 Pre-Deployment Checklist

### Security
- [ ] Change all default passwords and secrets
- [ ] Generate secure JWT secrets
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up environment variables
- [ ] Enable database authentication
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable logging and monitoring

### Performance
- [ ] Database indexing configured
- [ ] Caching strategy implemented
- [ ] CDN configured for static assets
- [ ] Load balancing set up (if needed)
- [ ] Auto-scaling configured
- [ ] Health checks implemented

### Monitoring
- [ ] Application logging
- [ ] Error tracking (Sentry, etc.)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Database monitoring
- [ ] Security monitoring

---

## 🌐 Deployment Options

### 1. Simple Cloud Deployment (Recommended for MVP)

**Frontend**: Vercel/Netlify
**Backend**: Railway/Render
**Database**: MongoDB Atlas
**AI Service**: Railway/Render

### 2. AWS Deployment (Production Ready)

**Frontend**: AWS S3 + CloudFront
**Backend**: AWS EC2/ECS
**Database**: MongoDB Atlas/AWS DocumentDB
**AI Service**: AWS EC2 with GPU

### 3. Docker Deployment (Any Cloud Provider)

**All Services**: Docker containers
**Orchestration**: Docker Compose/Kubernetes
**Database**: MongoDB container/managed service

---

## 🔧 Environment Configuration

### Production Environment Variables

**Backend (.env.production):**
```env
# Server Configuration
NODE_ENV=production
PORT=5000
HOST=0.0.0.0

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elevare?retryWrites=true&w=majority

# Security
JWT_SECRET=your_super_secure_jwt_secret_64_characters_long_minimum
JWT_EXPIRE=7d
BCRYPT_ROUNDS=12

# AI Service
AI_SERVICE_URL=https://your-ai-service.com

# CORS
CORS_ORIGIN=https://your-frontend-domain.com

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# Monitoring
SENTRY_DSN=your_sentry_dsn_here
```

**AI Services (.env.production):**
```env
# Service Configuration
PYTHONENV=production
AI_SERVICE_PORT=8000
AI_SERVICE_HOST=0.0.0.0

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elevare

# LLM APIs (Optional)
OPENAI_API_KEY=your_openai_key
HUGGINGFACE_API_KEY=your_hf_key

# Logging
LOG_LEVEL=INFO
LOG_FILE=./logs/ai.log

# Performance
WORKERS=4
MAX_REQUESTS=1000
```

**Frontend (.env.production):**
```env
VITE_API_URL=https://your-backend-api.com
VITE_APP_NAME=ELEVARE
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=production
```

---

## 🐳 Docker Deployment

### Docker Compose Setup

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  # MongoDB Database
  mongodb:
    image: mongo:6
    container_name: elevare-mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
      MONGO_INITDB_DATABASE: elevare
    volumes:
      - mongodb_data:/data/db
      - ./mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro
    ports:
      - "27017:27017"
    networks:
      - elevare-network

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: elevare-backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      MONGODB_URI: mongodb://admin:${MONGO_PASSWORD}@mongodb:27017/elevare?authSource=admin
      JWT_SECRET: ${JWT_SECRET}
      AI_SERVICE_URL: http://ai-service:8000
    ports:
      - "5000:5000"
    depends_on:
      - mongodb
    networks:
      - elevare-network
    volumes:
      - ./backend/logs:/app/logs

  # AI Services
  ai-service:
    build:
      context: ./ai-services
      dockerfile: Dockerfile
    container_name: elevare-ai
    restart: unless-stopped
    environment:
      PYTHONENV: production
      MONGODB_URI: mongodb://admin:${MONGO_PASSWORD}@mongodb:27017/elevare?authSource=admin
    ports:
      - "8000:8000"
    depends_on:
      - mongodb
    networks:
      - elevare-network
    volumes:
      - ./ai-services/logs:/app/logs

  # Frontend (Nginx)
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: elevare-frontend
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    networks:
      - elevare-network
    volumes:
      - ./ssl:/etc/nginx/ssl:ro

  # Nginx Load Balancer (Optional)
  nginx:
    image: nginx:alpine
    container_name: elevare-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
    depends_on:
      - backend
      - frontend
    networks:
      - elevare-network

volumes:
  mongodb_data:

networks:
  elevare-network:
    driver: bridge
```

### Dockerfiles

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start application
CMD ["npm", "start"]
```

**AI Services Dockerfile:**
```dockerfile
FROM python:3.9-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Download NLTK data
RUN python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('vader_lexicon')"

# Copy source code
COPY . .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Start application
CMD ["python", "main.py"]
```

**Frontend Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost || exit 1

CMD ["nginx", "-g", "daemon off;"]
```

### Deployment Commands

```bash
# Create environment file
cp .env.example .env.production

# Edit environment variables
nano .env.production

# Build and start services
docker-compose --env-file .env.production up -d --build

# View logs
docker-compose logs -f

# Scale services (if needed)
docker-compose up -d --scale backend=3 --scale ai-service=2

# Update services
docker-compose pull
docker-compose up -d --build
```

---

## ☁️ AWS Deployment

### Architecture Overview
```
Internet Gateway
    ↓
Application Load Balancer
    ↓
┌─────────────────────────────────────┐
│  Auto Scaling Group                 │
│  ┌─────────────┐  ┌─────────────┐   │
│  │   EC2       │  │   EC2       │   │
│  │  Backend    │  │  AI Service │   │
│  └─────────────┘  └─────────────┘   │
└─────────────────────────────────────┘
    ↓
MongoDB Atlas / DocumentDB
```

### Step 1: VPC and Security Groups

**VPC Configuration:**
```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16

# Create subnets
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.2.0/24 --availability-zone us-east-1b

# Create Internet Gateway
aws ec2 create-internet-gateway
aws ec2 attach-internet-gateway --vpc-id vpc-xxx --internet-gateway-id igw-xxx
```

**Security Groups:**
```bash
# Backend Security Group
aws ec2 create-security-group \
  --group-name elevare-backend-sg \
  --description "ELEVARE Backend Security Group" \
  --vpc-id vpc-xxx

# Allow HTTP/HTTPS and SSH
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxx \
  --protocol tcp \
  --port 5000 \
  --source-group sg-alb-xxx

# AI Service Security Group
aws ec2 create-security-group \
  --group-name elevare-ai-sg \
  --description "ELEVARE AI Service Security Group" \
  --vpc-id vpc-xxx

aws ec2 authorize-security-group-ingress \
  --group-id sg-xxx \
  --protocol tcp \
  --port 8000 \
  --source-group sg-backend-xxx
```

### Step 2: EC2 Instances

**User Data Script (backend-userdata.sh):**
```bash
#!/bin/bash
yum update -y
yum install -y docker git

# Start Docker
systemctl start docker
systemctl enable docker
usermod -a -G docker ec2-user

# Install Docker Compose
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
chmod +x /usr/local/bin/docker-compose

# Clone repository
cd /home/ec2-user
git clone https://github.com/Varadha9/ELEVARE.git
cd ELEVARE

# Set up environment
cp .env.example .env.production
# Configure environment variables here

# Start services
docker-compose --env-file .env.production up -d backend

# Set up log rotation
echo '/home/ec2-user/ELEVARE/backend/logs/*.log {
    daily
    rotate 7
    compress
    delaycompress
    missingok
    notifempty
    create 644 ec2-user ec2-user
}' > /etc/logrotate.d/elevare
```

**Launch EC2 Instance:**
```bash
aws ec2 run-instances \
  --image-id ami-0abcdef1234567890 \
  --count 1 \
  --instance-type t3.medium \
  --key-name your-key-pair \
  --security-group-ids sg-xxx \
  --subnet-id subnet-xxx \
  --user-data file://backend-userdata.sh \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=ELEVARE-Backend}]'
```

### Step 3: Application Load Balancer

```bash
# Create ALB
aws elbv2 create-load-balancer \
  --name elevare-alb \
  --subnets subnet-xxx subnet-yyy \
  --security-groups sg-alb-xxx

# Create target groups
aws elbv2 create-target-group \
  --name elevare-backend-tg \
  --protocol HTTP \
  --port 5000 \
  --vpc-id vpc-xxx \
  --health-check-path /health

# Register targets
aws elbv2 register-targets \
  --target-group-arn arn:aws:elasticloadbalancing:... \
  --targets Id=i-xxx,Port=5000

# Create listeners
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:... \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:...
```

### Step 4: Auto Scaling

**Launch Template:**
```bash
aws ec2 create-launch-template \
  --launch-template-name elevare-backend-template \
  --launch-template-data '{
    "ImageId": "ami-0abcdef1234567890",
    "InstanceType": "t3.medium",
    "KeyName": "your-key-pair",
    "SecurityGroupIds": ["sg-xxx"],
    "UserData": "'$(base64 -w 0 backend-userdata.sh)'"
  }'
```

**Auto Scaling Group:**
```bash
aws autoscaling create-auto-scaling-group \
  --auto-scaling-group-name elevare-backend-asg \
  --launch-template LaunchTemplateName=elevare-backend-template,Version=1 \
  --min-size 1 \
  --max-size 5 \
  --desired-capacity 2 \
  --target-group-arns arn:aws:elasticloadbalancing:... \
  --vpc-zone-identifier "subnet-xxx,subnet-yyy"
```

### Step 5: CloudFront (Frontend)

**S3 Bucket for Frontend:**
```bash
# Create S3 bucket
aws s3 mb s3://elevare-frontend-bucket

# Build and upload frontend
cd frontend
npm run build
aws s3 sync dist/ s3://elevare-frontend-bucket --delete

# Configure bucket for static website hosting
aws s3 website s3://elevare-frontend-bucket \
  --index-document index.html \
  --error-document index.html
```

**CloudFront Distribution:**
```json
{
  "CallerReference": "elevare-frontend-2024",
  "Comment": "ELEVARE Frontend Distribution",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-elevare-frontend",
        "DomainName": "elevare-frontend-bucket.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ]
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-elevare-frontend",
    "ViewerProtocolPolicy": "redirect-to-https",
    "Compress": true
  }
}
```

---

## 🔒 SSL/HTTPS Configuration

### Let's Encrypt (Free SSL)

```bash
# Install Certbot
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Nginx Configuration with SSL

**nginx.conf:**
```nginx
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server backend:5000;
    }

    upstream ai-service {
        server ai-service:8000;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS Configuration
    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
        ssl_prefer_server_ciphers off;

        # Security Headers
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";

        # Frontend
        location / {
            root /usr/share/nginx/html;
            try_files $uri $uri/ /index.html;
        }

        # Backend API
        location /api/ {
            proxy_pass http://backend/api/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # AI Service
        location /ai/ {
            proxy_pass http://ai-service/;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }
    }
}
```

---

## 📊 Monitoring and Logging

### Application Monitoring

**Sentry Integration (Error Tracking):**
```javascript
// backend/server.js
const Sentry = require('@sentry/node');

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.errorHandler());
```

**Prometheus Metrics:**
```javascript
// backend/middleware/metrics.js
const prometheus = require('prom-client');

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code']
});

module.exports = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  
  next();
};
```

### Log Management

**Winston Logger Configuration:**
```javascript
// backend/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

module.exports = logger;
```

### Health Checks

**Backend Health Check:**
```javascript
// backend/routes/health.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/health', async (req, res) => {
  const health = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version
  };

  try {
    // Check database connection
    if (mongoose.connection.readyState === 1) {
      health.database = 'Connected';
    } else {
      health.database = 'Disconnected';
      health.status = 'ERROR';
    }

    // Check AI service
    const aiResponse = await fetch(`${process.env.AI_SERVICE_URL}/health`);
    health.aiService = aiResponse.ok ? 'Connected' : 'Disconnected';

    res.status(health.status === 'OK' ? 200 : 503).json(health);
  } catch (error) {
    health.status = 'ERROR';
    health.error = error.message;
    res.status(503).json(health);
  }
});

module.exports = router;
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

**.github/workflows/deploy.yml:**
```yaml
name: Deploy ELEVARE

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:6
        ports:
          - 27017:27017
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: |
          backend/package-lock.json
          frontend/package-lock.json
    
    - name: Setup Python
      uses: actions/setup-python@v4
      with:
        python-version: '3.9'
        cache: 'pip'
        cache-dependency-path: ai-services/requirements.txt
    
    - name: Install Backend Dependencies
      run: |
        cd backend
        npm ci
    
    - name: Install Frontend Dependencies
      run: |
        cd frontend
        npm ci
    
    - name: Install AI Service Dependencies
      run: |
        cd ai-services
        pip install -r requirements.txt
    
    - name: Run Backend Tests
      run: |
        cd backend
        npm test
      env:
        MONGODB_URI: mongodb://localhost:27017/elevare_test
        JWT_SECRET: test_secret
    
    - name: Run Frontend Tests
      run: |
        cd frontend
        npm test
    
    - name: Run AI Service Tests
      run: |
        cd ai-services
        python -m pytest

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Deploy to Production
      run: |
        # Add your deployment commands here
        echo "Deploying to production..."
        
    - name: Notify Deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 🔧 Database Migration

### MongoDB Migration Script

**scripts/migrate.js:**
```javascript
const mongoose = require('mongoose');

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Add indexes
    await mongoose.connection.db.collection('users').createIndex({ email: 1 }, { unique: true });
    await mongoose.connection.db.collection('conversations').createIndex({ userId: 1, timestamp: -1 });
    await mongoose.connection.db.collection('userprofiles').createIndex({ userId: 1 }, { unique: true });
    
    // Data migrations
    await mongoose.connection.db.collection('users').updateMany(
      { version: { $exists: false } },
      { $set: { version: 1, updatedAt: new Date() } }
    );
    
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

migrate();
```

---

## 📈 Performance Optimization

### Caching Strategy

**Redis Configuration:**
```javascript
// backend/config/redis.js
const redis = require('redis');

const client = redis.createClient({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD
});

// Cache middleware
const cache = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await client.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      res.sendResponse = res.json;
      res.json = (body) => {
        client.setex(key, duration, JSON.stringify(body));
        res.sendResponse(body);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
};

module.exports = { client, cache };
```

### Database Optimization

**Connection Pooling:**
```javascript
// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

---

## 🚨 Disaster Recovery

### Backup Strategy

**MongoDB Backup Script:**
```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups/mongodb"
DB_NAME="elevare"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
mongodump --uri="$MONGODB_URI" --db=$DB_NAME --out=$BACKUP_DIR/$DATE

# Compress backup
tar -czf $BACKUP_DIR/elevare_backup_$DATE.tar.gz -C $BACKUP_DIR $DATE

# Remove uncompressed backup
rm -rf $BACKUP_DIR/$DATE

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/elevare_backup_$DATE.tar.gz s3://elevare-backups/

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: elevare_backup_$DATE.tar.gz"
```

**Automated Backup Cron:**
```bash
# Add to crontab
0 2 * * * /path/to/backup.sh >> /var/log/backup.log 2>&1
```

### Recovery Procedure

```bash
# Restore from backup
mongorestore --uri="$MONGODB_URI" --db=elevare --drop /path/to/backup/elevare

# Verify restoration
mongo $MONGODB_URI --eval "db.users.count()"
```

---

## 📞 Support and Maintenance

### Monitoring Checklist

**Daily:**
- [ ] Check application logs for errors
- [ ] Verify all services are running
- [ ] Monitor response times
- [ ] Check database performance

**Weekly:**
- [ ] Review security logs
- [ ] Update dependencies
- [ ] Check backup integrity
- [ ] Performance analysis

**Monthly:**
- [ ] Security audit
- [ ] Capacity planning
- [ ] Cost optimization
- [ ] Documentation updates

### Emergency Contacts

```yaml
# emergency-contacts.yml
contacts:
  primary_admin:
    name: "System Administrator"
    email: "admin@elevare.com"
    phone: "+1-555-0123"
  
  database_admin:
    name: "Database Administrator"
    email: "dba@elevare.com"
    phone: "+1-555-0124"
  
  security_team:
    name: "Security Team"
    email: "security@elevare.com"
    phone: "+1-555-0125"

escalation_matrix:
  - level: 1
    response_time: "15 minutes"
    contacts: ["primary_admin"]
  
  - level: 2
    response_time: "30 minutes"
    contacts: ["primary_admin", "database_admin"]
  
  - level: 3
    response_time: "1 hour"
    contacts: ["all"]
```

---

**🎉 Deployment Complete!**

Your ELEVARE application is now ready for production use. Remember to:

1. Monitor application performance regularly
2. Keep dependencies updated
3. Maintain regular backups
4. Review security configurations periodically
5. Scale resources based on usage patterns

For support and questions, refer to the [troubleshooting guide](../TROUBLESHOOTING.md) or create an issue on GitHub.