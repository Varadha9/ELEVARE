@echo off
echo ========================================
echo ELEVARE Quick Setup
echo ========================================
echo This will install all dependencies and set up ELEVARE
echo.

REM Check if running as administrator for MongoDB installation
net session >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Note: Some operations may require administrator privileges
    echo.
)

echo 📦 Installing project dependencies...
echo.

REM Backend setup
echo Setting up Backend...
if not exist "backend\node_modules" (
    cd backend
    echo Installing Node.js dependencies...
    npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Backend dependency installation failed
        pause
        exit /b 1
    )
    cd ..
    echo ✅ Backend dependencies installed
) else (
    echo ✅ Backend dependencies already installed
)

REM Frontend setup
echo.
echo Setting up Frontend...
if not exist "frontend\node_modules" (
    cd frontend
    echo Installing Node.js dependencies...
    npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Frontend dependency installation failed
        pause
        exit /b 1
    )
    cd ..
    echo ✅ Frontend dependencies installed
) else (
    echo ✅ Frontend dependencies already installed
)

REM AI Services setup
echo.
echo Setting up AI Services...
if not exist "ai-services\venv" (
    cd ai-services
    echo Creating Python virtual environment...
    python -m venv venv
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Failed to create virtual environment
        echo Make sure Python is installed: https://python.org/
        pause
        exit /b 1
    )
    
    echo Activating virtual environment...
    call venv\Scripts\activate
    
    echo Installing Python dependencies...
    pip install -r requirements.txt
    if %ERRORLEVEL% NEQ 0 (
        echo ❌ Python dependency installation failed
        pause
        exit /b 1
    )
    
    echo Downloading NLTK data...
    python -c "import nltk; nltk.download('punkt'); nltk.download('stopwords'); nltk.download('vader_lexicon')"
    
    cd ..
    echo ✅ AI services environment set up
) else (
    echo ✅ AI services environment already exists
)

REM Create data directory
echo.
echo Setting up database directory...
if not exist "data\db" (
    mkdir data\db
    echo ✅ Created MongoDB data directory
) else (
    echo ✅ MongoDB data directory exists
)

REM Check MongoDB installation
echo.
echo Checking MongoDB...
where mongod >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ MongoDB is installed
) else (
    echo ⚠️  MongoDB not found
    echo.
    set /p install_mongo="Would you like to set up MongoDB now? (y/n): "
    if /i "%install_mongo%"=="y" (
        call setup-mongodb.bat
    ) else (
        echo You can set up MongoDB later by running: setup-mongodb.bat
    )
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.

echo 🎉 ELEVARE is now ready to run!
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Run: start-realtime.bat
echo 3. Open: http://localhost:3000
echo.
echo For troubleshooting, run: health-check.bat
echo.

set /p start_now="Would you like to start ELEVARE now? (y/n): "
if /i "%start_now%"=="y" (
    call start-realtime.bat
) else (
    echo Run start-realtime.bat when you're ready to start ELEVARE
)

echo.
pause