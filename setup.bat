@echo off
echo ========================================
echo ELEVARE - AI Career Discovery Platform
echo Complete Setup Script
echo ========================================
echo.

echo [1/6] Checking Prerequisites...
echo.

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python is not installed!
    echo Please install Python 3.9+ from https://python.org/
    pause
    exit /b 1
)

where mongo >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: MongoDB CLI not found in PATH
    echo Make sure MongoDB is installed and running
)

echo ✓ Prerequisites check complete
echo.

echo [2/6] Setting up Backend...
cd backend
if not exist .env (
    copy .env.example .env
    echo ✓ Created .env file - Please configure it!
)
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Backend npm install failed
    pause
    exit /b 1
)
echo ✓ Backend setup complete
cd ..
echo.

echo [3/6] Setting up Frontend...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Frontend npm install failed
    pause
    exit /b 1
)
echo ✓ Frontend setup complete
cd ..
echo.

echo [4/6] Setting up AI Services...
cd ai-services
if not exist venv (
    python -m venv venv
    echo ✓ Created Python virtual environment
)
call venv\Scripts\activate.bat
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python dependencies installation failed
    pause
    exit /b 1
)
python -c "import nltk; nltk.download('punkt', quiet=True); nltk.download('stopwords', quiet=True)"
echo ✓ AI Services setup complete
cd ..
echo.

echo [5/6] Creating MongoDB data directory...
if not exist data\db (
    mkdir data\db
    echo ✓ Created MongoDB data directory
)
echo.

echo [6/6] Setup Summary
echo ========================================
echo ✓ Backend dependencies installed
echo ✓ Frontend dependencies installed
echo ✓ AI Services configured
echo ✓ MongoDB directory created
echo.
echo NEXT STEPS:
echo 1. Configure backend/.env file with your settings
echo 2. Start MongoDB: mongod --dbpath ./data/db
echo 3. Start Backend: cd backend && npm run dev
echo 4. Start AI Service: cd ai-services && venv\Scripts\activate && python main.py
echo 5. Start Frontend: cd frontend && npm run dev
echo.
echo Or use the start-all.bat script to run everything!
echo ========================================
pause
