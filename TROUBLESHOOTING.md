# ELEVARE - Registration & Login Troubleshooting Guide

## Quick Fix Steps

### 1. Start All Services
```bash
# Run this command in the ELEVARE directory
launch-elevare.bat
```

### 2. If Registration/Login Still Fails

#### Check Service Status:
- MongoDB: Should show "MongoDB Connected" in backend window
- Backend: Should show "🚀 ELEVARE Backend running on port 5000"
- AI Services: Should show "🤖 Starting ELEVARE AI Services..."
- Frontend: Should show "Local: http://localhost:3000"

#### Test Backend Directly:
```bash
# Test health
curl http://localhost:5000/health

# Test registration
curl -X POST http://localhost:5000/api/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Test User\",\"email\":\"test@example.com\",\"password\":\"password123\",\"age\":25,\"education\":\"undergraduate\"}"
```

### 3. Common Issues & Solutions

#### Issue: "Network Error" or "Failed to fetch"
**Solution:** 
- Ensure backend is running on port 5000
- Check CORS configuration
- Try refreshing the page

#### Issue: "User already exists"
**Solution:**
- Use a different email address
- Or try logging in with existing credentials

#### Issue: "Invalid credentials"
**Solution:**
- Check email and password spelling
- Ensure password is at least 6 characters
- Try registering a new account

#### Issue: Frontend not loading
**Solution:**
- Check if port 3000 is available
- Restart frontend: `cd frontend && npm run dev`
- Clear browser cache

### 4. Manual Service Start (if batch file fails)

#### Terminal 1 - MongoDB:
```bash
mongod --dbpath ./data/db
```

#### Terminal 2 - Backend:
```bash
cd backend
npm run dev
```

#### Terminal 3 - AI Services:
```bash
cd ai-services
python main.py
```

#### Terminal 4 - Frontend:
```bash
cd frontend
npm run dev
```

### 5. Test Registration Flow

1. Open http://localhost:3000
2. Click "Create Account"
3. Fill in:
   - Name: Your Full Name
   - Email: your.email@example.com
   - Password: minimum 6 characters
   - Age: 18-100
   - Education: Select from dropdown
4. Click "Create Account"
5. Should redirect to dashboard

### 6. Test Login Flow

1. Open http://localhost:3000
2. Click "Sign In" 
3. Enter registered email and password
4. Click "Sign In"
5. Should redirect to dashboard

### 7. Verify Real-Time Features

After successful login:
1. Go to Chat section
2. Send a message like "I love coding and solving problems"
3. AI should respond within 5-10 seconds
4. Check Dashboard to see trait updates
5. Generate recommendations after 5+ conversations

## Success Indicators

✓ All 4 service windows are open and running
✓ Backend shows "MongoDB Connected"
✓ Frontend loads at http://localhost:3000
✓ Registration creates account successfully
✓ Login redirects to dashboard
✓ Chat responds with AI messages
✓ Dashboard shows behavioral traits
✓ Recommendations generate after conversations

## Still Having Issues?

1. Check Windows Firewall settings
2. Ensure MongoDB is installed and accessible
3. Verify Node.js and Python are in PATH
4. Try running as Administrator
5. Check antivirus software blocking connections

## Contact Support

If issues persist, provide:
- Error messages from browser console (F12)
- Error messages from service windows
- Operating system version
- Node.js and Python versions