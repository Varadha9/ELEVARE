# ELEVARE Troubleshooting Guide

## 🚨 Common Issues and Solutions

### Issue: Services Not Starting

**Problem**: MongoDB, Backend, or AI Services not responding
**Error**: `ECONNREFUSED` or services not accessible

**Solutions**:

1. **Check MongoDB Installation**:
   ```bash
   # Run MongoDB setup
   setup-mongodb.bat
   
   # Or install manually from:
   # https://www.mongodb.com/try/download/community
   ```

2. **Check Dependencies**:
   ```bash
   # Run complete setup
   setup.bat
   
   # Or install individually:
   cd backend && npm install
   cd frontend && npm install
   cd ai-services && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt
   ```

3. **Check Ports**:
   ```bash
   # Check if ports are in use
   netstat -an | findstr "3000 5000 8000 27017"
   
   # Kill processes if needed
   taskkill /F /IM node.exe
   taskkill /F /IM python.exe
   taskkill /F /IM mongod.exe
   ```

### Issue: Frontend Shows Proxy Errors

**Problem**: `http proxy error: /api/auth/login`
**Cause**: Backend not running or not accessible

**Solutions**:

1. **Start Backend First**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Check Backend Health**:
   ```bash
   curl http://localhost:5000/health
   ```

3. **Verify Environment Variables**:
   ```bash
   # Check backend/.env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/elevare
   AI_SERVICE_URL=http://localhost:8000
   ```

### Issue: AI Services Not Responding

**Problem**: AI service on port 8000 not accessible
**Error**: Connection refused on port 8000

**Solutions**:

1. **Check Python Environment**:
   ```bash
   cd ai-services
   venv\Scripts\activate
   python main.py
   ```

2. **Install Missing Dependencies**:
   ```bash
   cd ai-services
   venv\Scripts\activate
   pip install -r requirements.txt
   python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords')"
   ```

3. **Check Python Version**:
   ```bash
   python --version
   # Should be 3.9 or higher
   ```

### Issue: MongoDB Connection Failed

**Problem**: Cannot connect to MongoDB
**Error**: `MongoNetworkError` or connection timeout

**Solutions**:

1. **Start MongoDB Service**:
   ```bash
   # Local installation
   mongod --dbpath ./data/db
   
   # Or Windows service
   net start MongoDB
   ```

2. **Use Docker MongoDB**:
   ```bash
   docker run -d --name elevare-mongo -p 27017:27017 mongo:6
   ```

3. **Check MongoDB Status**:
   ```bash
   # Test connection
   mongo --eval "db.adminCommand('ismaster')"
   ```

### Issue: Port Already in Use

**Problem**: Port 3000, 5000, 8000, or 27017 already in use
**Error**: `EADDRINUSE` or port binding failed

**Solutions**:

1. **Find and Kill Process**:
   ```bash
   # Find process using port
   netstat -ano | findstr :5000
   
   # Kill process by PID
   taskkill /F /PID <PID>
   ```

2. **Use Different Ports**:
   ```bash
   # Update .env files with different ports
   # backend/.env
   PORT=5001
   
   # Update frontend proxy configuration
   ```

### Issue: Dependencies Installation Failed

**Problem**: npm install or pip install fails
**Error**: Permission denied or network errors

**Solutions**:

1. **Clear Package Caches**:
   ```bash
   # Node.js
   npm cache clean --force
   
   # Python
   pip cache purge
   ```

2. **Run as Administrator**:
   ```bash
   # Right-click Command Prompt -> Run as Administrator
   ```

3. **Check Network/Firewall**:
   ```bash
   # Temporarily disable antivirus/firewall
   # Check corporate proxy settings
   ```

### Issue: Virtual Environment Problems

**Problem**: Python virtual environment not working
**Error**: `venv\Scripts\activate` not found

**Solutions**:

1. **Recreate Virtual Environment**:
   ```bash
   cd ai-services
   rmdir /s venv
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Check Python Installation**:
   ```bash
   python --version
   pip --version
   ```

## 🔧 Quick Fixes

### Reset Everything
```bash
# Stop all services
taskkill /F /IM node.exe
taskkill /F /IM python.exe
taskkill /F /IM mongod.exe

# Clean and reinstall
rmdir /s backend\node_modules
rmdir /s frontend\node_modules
rmdir /s ai-services\venv

# Run setup again
setup.bat
```

### Check System Health
```bash
# Run comprehensive health check
health-check.bat
```

### Manual Service Start
```bash
# Terminal 1: MongoDB
mongod --dbpath ./data/db

# Terminal 2: Backend
cd backend && npm run dev

# Terminal 3: AI Services
cd ai-services && venv\Scripts\activate && python main.py

# Terminal 4: Frontend
cd frontend && npm run dev
```

## 📞 Getting Help

### Log Files
- Backend logs: `backend/logs/`
- AI service logs: Check terminal output
- MongoDB logs: Check MongoDB installation directory

### Debug Mode
```bash
# Backend debug
cd backend
DEBUG=* npm run dev

# AI services debug
cd ai-services
venv\Scripts\activate
python main.py --log-level DEBUG
```

### Community Support
- GitHub Issues: [Create Issue](https://github.com/Varadha9/ELEVARE/issues)
- Documentation: Check `docs/` folder
- Health Check: Run `health-check.bat`

## 🚀 Performance Tips

1. **Close Unused Applications**: Free up system resources
2. **Restart Services**: If performance degrades
3. **Clear Browser Cache**: For frontend issues
4. **Update Dependencies**: Keep packages current
5. **Check System Resources**: Ensure adequate RAM/CPU

---

**Still having issues?** Run `health-check.bat` and create a GitHub issue with the output.