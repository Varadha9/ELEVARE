@echo off
echo ========================================
echo Starting ELEVARE Platform - Real-Time Mode
echo ========================================
echo.

REM Create data directory if it doesn't exist
if not exist "data\db" (
    echo Creating MongoDB data directory...
    mkdir data\db
)

REM Check if MongoDB is installed and start it
echo Checking MongoDB installation...
where mongod >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: MongoDB not found in PATH
    echo Please install MongoDB Community Server from:
    echo https://www.mongodb.com/try/download/community
    echo.
    echo Alternative: Using Docker MongoDB...
    docker --version >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo Starting MongoDB with Docker...
        docker run -d --name elevare-mongo -p 27017:27017 -v "%CD%\data\db:/data/db" mongo:6
        timeout /t 10 /nobreak >nul
    ) else (
        echo Docker not found either. Please install MongoDB or Docker.
        pause
        exit /b 1
    )
) else (
    REM Check if MongoDB is running
    tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
    if "%ERRORLEVEL%"=="0" (
        echo MongoDB is already running...
    ) else (
        echo Starting MongoDB...
        start "MongoDB" cmd /k "mongod --dbpath ./data/db"
        timeout /t 10 /nobreak >nul
    )
)

REM Install backend dependencies if needed
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    npm install
    cd ..
)

REM Install AI services dependencies if needed
if not exist "ai-services\venv" (
    echo Setting up AI services virtual environment...
    cd ai-services
    python -m venv venv
    call venv\Scripts\activate
    pip install -r requirements.txt
    python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('vader_lexicon')"
    cd ..
)

REM Install frontend dependencies if needed
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
)

REM Check if Backend is running
netstat -an | find "5000" >nul
if "%ERRORLEVEL%"=="0" (
    echo Backend is already running on port 5000...
) else (
    echo Starting Backend API...
    start "Backend" cmd /k "cd backend && npm run dev"
    timeout /t 5 /nobreak >nul
)

REM Check if AI Services is running
netstat -an | find "8000" >nul
if "%ERRORLEVEL%"=="0" (
    echo AI Services is already running on port 8000...
) else (
    echo Starting AI Services...
    start "AI Services" cmd /k "cd ai-services && venv\Scripts\activate && python main.py"
    timeout /t 8 /nobreak >nul
)

REM Check if Frontend is running
netstat -an | find "3000" >nul
if "%ERRORLEVEL%"=="0" (
    echo Frontend is already running on port 3000...
) else (
    echo Starting Frontend...
    start "Frontend" cmd /k "cd frontend && npm run dev"
    timeout /t 5 /nobreak >nul
)

echo.
echo ========================================
echo ELEVARE Platform is now starting!
echo.
echo Please wait 30 seconds for all services to initialize...
timeout /t 30 /nobreak >nul

echo.
echo Services should be available at:
echo - MongoDB:     mongodb://localhost:27017
echo - Backend:     http://localhost:5000
echo - AI Service:  http://localhost:8000  
echo - Frontend:    http://localhost:3000
echo.
echo Testing service connectivity...

REM Test services
curl -s http://localhost:5000/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend: Running
) else (
    echo ❌ Backend: Not responding - check backend terminal
)

curl -s http://localhost:8000/health >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ AI Service: Running
) else (
    echo ❌ AI Service: Not responding - check AI service terminal
)

curl -s http://localhost:3000 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Frontend: Running
) else (
    echo ❌ Frontend: Not responding - check frontend terminal
)

echo.
echo Real-time features enabled:
echo - Live chat with AI agent
echo - Real-time behavioral analysis
echo - Dynamic trait updates
echo - Instant recommendations
echo.
echo If any service failed to start, check the individual terminal windows
echo Press any key to open the application in browser...
pause >nul

start http://localhost:3000

echo.
echo ========================================
echo ELEVARE is now running!
echo Close individual service windows to stop
echo ========================================