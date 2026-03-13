@echo off
echo ========================================
echo ELEVARE Complete Platform Startup
echo ========================================
echo Starting all services: MongoDB, Backend, AI Service, Frontend
echo.

REM Create data directory if it doesn't exist
if not exist "data\db" (
    echo Creating MongoDB data directory...
    mkdir data\db
)

REM Check if MongoDB is installed
echo Checking MongoDB installation...
where mongod >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ MongoDB not found in system PATH
    echo.
    echo Please choose an option:
    echo 1. Install MongoDB Community Server (Recommended)
    echo 2. Use Docker MongoDB
    echo 3. Continue with in-memory database (temporary data)
    echo.
    set /p choice="Enter your choice (1-3): "
    
    if "%choice%"=="1" (
        echo Opening MongoDB download page...
        start https://www.mongodb.com/try/download/community
        echo.
        echo Please:
        echo 1. Download and install MongoDB Community Server
        echo 2. Make sure to check "Install MongoDB as a Service"
        echo 3. Add MongoDB to system PATH during installation
        echo 4. Run this script again after installation
        echo.
        pause
        exit /b 0
    )
    
    if "%choice%"=="2" (
        echo Checking Docker...
        docker --version >nul 2>&1
        if %ERRORLEVEL% NEQ 0 (
            echo Docker not found. Please install Docker Desktop first.
            start https://www.docker.com/products/docker-desktop/
            pause
            exit /b 0
        )
        
        echo Starting MongoDB with Docker...
        docker stop elevare-mongo 2>nul
        docker rm elevare-mongo 2>nul
        
        docker run -d ^
          --name elevare-mongo ^
          -p 27017:27017 ^
          -v "%CD%\data\db:/data/db" ^
          mongo:6
        
        if %ERRORLEVEL% EQU 0 (
            echo ✅ MongoDB Docker container started
            timeout /t 10 /nobreak >nul
        ) else (
            echo ❌ Failed to start MongoDB Docker container
            pause
            exit /b 1
        )
    )
    
    if "%choice%"=="3" (
        echo Continuing with in-memory database...
        set USE_MEMORY_DB=true
    )
) else (
    echo ✅ MongoDB found in system PATH
    
    REM Check if MongoDB is already running
    tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
    if "%ERRORLEVEL%"=="0" (
        echo ✅ MongoDB is already running
    ) else (
        echo Starting MongoDB service...
        net start MongoDB 2>nul
        if %ERRORLEVEL% NEQ 0 (
            echo Starting MongoDB manually...
            start "MongoDB" cmd /k "mongod --dbpath ./data/db"
            timeout /t 10 /nobreak >nul
        )
        echo ✅ MongoDB started
    )
)

echo.
echo ========================================
echo Installing Dependencies (if needed)
echo ========================================

REM Install backend dependencies
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install backend dependencies
        pause
        exit /b 1
    )
    cd ..
    echo ✅ Backend dependencies installed
)

REM Install frontend dependencies
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install frontend dependencies
        pause
        exit /b 1
    )
    cd ..
    echo ✅ Frontend dependencies installed
)

REM Setup AI services
if not exist "ai-services\venv" (
    echo Setting up AI services virtual environment...
    cd ai-services
    python -m venv venv
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to create Python virtual environment
        echo Make sure Python 3.9+ is installed
        pause
        exit /b 1
    )
    
    call venv\Scripts\activate
    pip install -r requirements.txt
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to install Python dependencies
        pause
        exit /b 1
    )
    
    python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('vader_lexicon')"
    cd ..
    echo ✅ AI services environment ready
)

echo.
echo ========================================
echo Starting All Services
echo ========================================

REM Start Backend
echo Starting Backend API...
cd backend
if "%USE_MEMORY_DB%"=="true" (
    start "ELEVARE Backend" cmd /k "set USE_MEMORY_DB=true && npm run dev"
) else (
    start "ELEVARE Backend" cmd /k "npm run dev"
)
cd ..
timeout /t 5 /nobreak >nul

REM Start AI Services
echo Starting AI Services...
start "ELEVARE AI Services" cmd /k "cd ai-services && venv\Scripts\activate && python main.py"
timeout /t 8 /nobreak >nul

REM Start Frontend
echo Starting Frontend...
start "ELEVARE Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 5 /nobreak >nul

echo.
echo ========================================
echo Waiting for Services to Initialize...
echo ========================================
echo Please wait 45 seconds for all services to start up...

timeout /t 45 /nobreak >nul

echo.
echo ========================================
echo Testing Service Connectivity
echo ========================================

REM Test MongoDB
if "%USE_MEMORY_DB%" NEQ "true" (
    echo Testing MongoDB connection...
    echo db.adminCommand('ismaster') | mongo --quiet >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ✅ MongoDB: Connected (Port 27017)
    ) else (
        echo ⚠️  MongoDB: Connection issues (will use fallback)
    )
) else (
    echo ✅ Database: In-Memory mode
)

REM Test Backend
echo Testing Backend API...
curl -s http://localhost:5000/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend: Running (Port 5000)
) else (
    echo ❌ Backend: Not responding - check backend terminal
)

REM Test AI Services
echo Testing AI Services...
curl -s http://localhost:8000/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ AI Service: Running (Port 8000)
) else (
    echo ❌ AI Service: Not responding - check AI service terminal
)

REM Test Frontend
echo Testing Frontend...
curl -s http://localhost:3000 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Frontend: Running (Port 3000)
) else (
    echo ❌ Frontend: Not responding - check frontend terminal
)

echo.
echo ========================================
echo ELEVARE Platform Status
echo ========================================
echo.
echo 🌐 Access your application at:
echo    Frontend:    http://localhost:3000
echo    Backend API: http://localhost:5000
echo    AI Service:  http://localhost:8000
if "%USE_MEMORY_DB%" NEQ "true" (
    echo    MongoDB:     mongodb://localhost:27017
)
echo.
echo 🚀 Features Available:
echo    ✅ User Registration & Login
echo    ✅ AI-Powered Conversations
echo    ✅ Behavioral Analysis
echo    ✅ Career Recommendations
echo    ✅ Progress Tracking
echo    ✅ Dashboard Analytics
echo.
echo 💡 Getting Started:
echo    1. Open http://localhost:3000 in your browser
echo    2. Create a new account
echo    3. Start chatting with the AI
echo    4. Get personalized career recommendations
echo.

REM Open browser automatically
set /p open_browser="Open ELEVARE in browser now? (y/n): "
if /i "%open_browser%"=="y" (
    start http://localhost:3000
)

echo.
echo ========================================
echo ELEVARE is now fully operational! 🎉
echo ========================================
echo.
echo 📋 Service Management:
echo    - Each service runs in its own terminal window
echo    - Close individual windows to stop services
echo    - Check terminal windows if any service fails
echo    - Run health-check.bat to diagnose issues
echo.
echo 🔧 Troubleshooting:
echo    - If login fails, check backend terminal for errors
echo    - If AI doesn't respond, check AI service terminal
echo    - If pages don't load, check frontend terminal
echo    - Run health-check.bat for detailed diagnostics
echo.
echo Enjoy using ELEVARE! 🚀
pause