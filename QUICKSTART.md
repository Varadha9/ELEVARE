# 🚀 ELEVARE - Quick Start Guide

## ⚡ 3-Step Setup

### Step 1: Install Prerequisites
- ✅ Node.js 18+ → [Download](https://nodejs.org/)
- ✅ Python 3.9+ → [Download](https://www.python.org/)
- ✅ MongoDB 6+ → [Download](https://www.mongodb.com/try/download/community)

### Step 2: Run Setup
```bash
.\setup.bat
```
This installs all dependencies (takes 5-10 minutes)

### Step 3: Start Application
```bash
.\start-all.bat
```
This starts all services

### Step 4: Access Application
Open browser: **http://localhost:3000**

---

## 🎯 First Time Usage

1. **Register** - Create account with email/password
2. **Login** - Access your dashboard
3. **Chat** - Answer AI questions about your interests
4. **Dashboard** - View your behavioral traits
5. **Recommendations** - Get career suggestions (after 10+ chats)

---

## 🔧 Manual Start (If Automated Fails)

**Terminal 1 - MongoDB:**
```bash
mongod --dbpath ./data/db
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - AI Service:**
```bash
cd ai-services
venv\Scripts\activate
python main.py
```

**Terminal 4 - Frontend:**
```bash
cd frontend
npm run dev
```

---

## ✅ Verify Installation

### Check Services
- Frontend: http://localhost:3000 (should show login page)
- Backend: http://localhost:5000/health (should return `{"status":"ok"}`)
- AI Service: http://localhost:8000/health (should return health status)

### Test Flow
1. Register new account
2. Login
3. Send a message in chat
4. Check dashboard for analytics

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### MongoDB Not Starting
- Check if MongoDB is installed
- Verify `data/db` directory exists
- Try: `mongod --dbpath D:\ELEVARE\data\db`

### Python Packages Fail
```bash
cd ai-services
rmdir /s venv
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn pymongo python-dotenv nltk textblob
```

### Frontend Blank Page
- Check browser console (F12)
- Verify backend is running
- Check `backend/.env` configuration

---

## 📊 Service Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 3000 | http://localhost:3000 |
| Backend | 5000 | http://localhost:5000 |
| AI Service | 8000 | http://localhost:8000 |
| MongoDB | 27017 | mongodb://localhost:27017 |

---

## 🎓 Usage Tips

- **Daily Use:** Chat for 5-10 minutes daily
- **Honest Answers:** Be genuine in responses
- **Consistency:** Use regularly for better recommendations
- **Feedback:** Rate recommendations to improve accuracy

---

## 📚 Next Steps

- Read `README.md` for complete documentation
- Check `docs/API.md` for API reference
- See `docs/ARCHITECTURE.md` for system design
- Review `PROJECT_STRUCTURE.md` for file organization

---

**Need Help?** Check the main README.md or create an issue on GitHub.
