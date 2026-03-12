@echo off
echo ========================================
echo ELEVARE Quick Start (No MongoDB Required)
echo ========================================
echo.

echo Setting up ELEVARE with in-memory database...
echo This will work without MongoDB installation!
echo.

REM Update backend to use in-memory database for development
echo Configuring backend for development mode...
cd backend

REM Create a development environment file
echo PORT=5000 > .env.dev
echo MONGODB_URI=memory://localhost/elevare >> .env.dev
echo JWT_SECRET=dev_jwt_secret_for_testing_only >> .env.dev
echo JWT_EXPIRE=7d >> .env.dev
echo AI_SERVICE_URL=http://localhost:8000 >> .env.dev
echo NODE_ENV=development >> .env.dev
echo USE_MEMORY_DB=true >> .env.dev

echo ✅ Backend configured for development mode
cd ..

REM Start Backend with in-memory database
echo.
echo Starting Backend API (in-memory database)...
start "Backend" cmd /k "cd backend && set NODE_ENV=development && npm run dev"
timeout /t 5 /nobreak >nul

REM Start AI Services
echo Starting AI Services...
start "AI Services" cmd /k "cd ai-services && (if exist venv\Scripts\activate.bat (venv\Scripts\activate) else echo Virtual environment not found) && python main.py"
timeout /t 5 /nobreak >nul

REM Start Frontend
echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo ELEVARE is starting up!
echo ========================================
echo.
echo Please wait 30 seconds for all services to initialize...
echo.
echo Services will be available at:
echo - Backend:     http://localhost:5000 (in-memory database)
echo - AI Service:  http://localhost:8000
echo - Frontend:    http://localhost:3000
echo.
echo Note: This uses in-memory database for development.
echo Data will be lost when you restart the backend.
echo For production, install MongoDB using: setup-mongodb.bat
echo.

timeout /t 30 /nobreak >nul

echo Testing services...
curl -s http://localhost:5000/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend: Running
) else (
    echo ⚠️  Backend: Starting up... (check backend terminal)
)

curl -s http://localhost:8000/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ AI Service: Running
) else (
    echo ⚠️  AI Service: Starting up... (check AI service terminal)
)

curl -s http://localhost:3000 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Frontend: Running
) else (
    echo ⚠️  Frontend: Starting up... (check frontend terminal)
)

echo.
echo 🚀 Opening ELEVARE in your browser...
timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo ========================================
echo ELEVARE is now running!
echo ========================================
echo.
echo 💡 Tips:
echo - Data is stored in memory (temporary)
echo - Close service windows to stop ELEVARE
echo - For persistent data, install MongoDB
echo - Check individual terminals if services fail
echo.
echo Enjoy using ELEVARE! 🎉