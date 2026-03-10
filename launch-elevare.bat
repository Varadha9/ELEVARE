@echo off
echo ========================================
echo ELEVARE - Complete Real-Time Setup
echo ========================================
echo.

REM Kill any existing processes
echo Cleaning up existing processes...
taskkill /F /IM mongod.exe >nul 2>&1
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1

echo.
echo Starting services in order...
echo.

REM Start MongoDB
echo [1/4] Starting MongoDB...
start "ELEVARE-MongoDB" cmd /k "echo MongoDB Server && mongod --dbpath ./data/db"
ping -n 5 127.0.0.1 >nul

REM Start Backend
echo [2/4] Starting Backend API...
start "ELEVARE-Backend" cmd /k "echo Backend API Server && cd backend && npm run dev"
ping -n 8 127.0.0.1 >nul

REM Start AI Services
echo [3/4] Starting AI Services...
start "ELEVARE-AI" cmd /k "echo AI Services Server && cd ai-services && python main.py"
ping -n 8 127.0.0.1 >nul

REM Start Frontend
echo [4/4] Starting Frontend...
start "ELEVARE-Frontend" cmd /k "echo Frontend Development Server && cd frontend && npm run dev"
ping -n 10 127.0.0.1 >nul

echo.
echo ========================================
echo Verifying Services...
echo ========================================

REM Check MongoDB
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✓ MongoDB: Running
) else (
    echo ✗ MongoDB: Failed to start
)

REM Check Backend
curl -s http://localhost:5000/health >nul 2>&1
if "%ERRORLEVEL%"=="0" (
    echo ✓ Backend API: Running on port 5000
) else (
    echo ✗ Backend API: Not responding
)

REM Check AI Services
curl -s http://localhost:8000/health >nul 2>&1
if "%ERRORLEVEL%"=="0" (
    echo ✓ AI Services: Running on port 8000
) else (
    echo ✗ AI Services: Not responding
)

REM Check Frontend
netstat -an | find "3000" >nul 2>&1
if "%ERRORLEVEL%"=="0" (
    echo ✓ Frontend: Running on port 3000
) else (
    echo ✗ Frontend: Not running
)

echo.
echo ========================================
echo ELEVARE Platform Status
echo ========================================
echo.
echo 🌐 Frontend:    http://localhost:3000
echo 🔧 Backend:     http://localhost:5000
echo 🤖 AI Service:  http://localhost:8000
echo 💾 MongoDB:     mongodb://localhost:27017
echo.
echo Real-time features:
echo ✓ Live chat with AI agent
echo ✓ Real-time behavioral analysis  
echo ✓ Dynamic trait updates
echo ✓ Instant career recommendations
echo.
echo To test registration/login:
echo 1. Open http://localhost:3000
echo 2. Click "Create Account"
echo 3. Fill in your details
echo 4. Start chatting with the AI!
echo.
echo Press any key to open the application...
pause >nul

start http://localhost:3000

echo.
echo Application opened in browser!
echo Keep this window open to monitor services.
echo Press Ctrl+C to stop all services.
echo.

:monitor
ping -n 30 127.0.0.1 >nul
echo [%time%] Services monitoring... (Check every 30s)
goto monitor