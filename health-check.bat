@echo off
echo ========================================
echo ELEVARE Health Check
echo ========================================
echo.

echo 🔍 Checking system requirements...
echo.

REM Check Node.js
node --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Node.js: 
    node --version
) else (
    echo ❌ Node.js: Not installed
    echo    Download from: https://nodejs.org/
)

REM Check Python
python --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Python: 
    python --version
) else (
    echo ❌ Python: Not installed
    echo    Download from: https://python.org/
)

REM Check MongoDB
where mongod >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ MongoDB: Installed
    mongod --version | findstr "version"
) else (
    echo ❌ MongoDB: Not installed
    echo    Run: setup-mongodb.bat
)

REM Check Docker (optional)
docker --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Docker: 
    docker --version
) else (
    echo ⚠️  Docker: Not installed (optional)
)

echo.
echo 📦 Checking project dependencies...
echo.

REM Check backend dependencies
if exist "backend\node_modules" (
    echo ✅ Backend dependencies: Installed
) else (
    echo ❌ Backend dependencies: Missing
    echo    Run: cd backend && npm install
)

REM Check frontend dependencies
if exist "frontend\node_modules" (
    echo ✅ Frontend dependencies: Installed
) else (
    echo ❌ Frontend dependencies: Missing
    echo    Run: cd frontend && npm install
)

REM Check AI services dependencies
if exist "ai-services\venv" (
    echo ✅ AI services environment: Installed
) else (
    echo ❌ AI services environment: Missing
    echo    Run: cd ai-services && python -m venv venv && venv\Scripts\activate && pip install -r requirements.txt
)

echo.
echo 🌐 Checking running services...
echo.

REM Check MongoDB
netstat -an | find "27017" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ MongoDB: Running on port 27017
) else (
    echo ❌ MongoDB: Not running
)

REM Check Backend
netstat -an | find "5000" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Backend: Running on port 5000
    curl -s http://localhost:5000/health >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo    Health check: OK
    ) else (
        echo    Health check: Failed
    )
) else (
    echo ❌ Backend: Not running
)

REM Check AI Services
netstat -an | find "8000" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ AI Services: Running on port 8000
    curl -s http://localhost:8000/health >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo    Health check: OK
    ) else (
        echo    Health check: Failed
    )
) else (
    echo ❌ AI Services: Not running
)

REM Check Frontend
netstat -an | find "3000" >nul
if %ERRORLEVEL% EQU 0 (
    echo ✅ Frontend: Running on port 3000
    curl -s http://localhost:3000 >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo    Health check: OK
    ) else (
        echo    Health check: Failed
    )
) else (
    echo ❌ Frontend: Not running
)

echo.
echo 📁 Checking project structure...
echo.

if exist "backend\server.js" (
    echo ✅ Backend server file exists
) else (
    echo ❌ Backend server file missing
)

if exist "frontend\package.json" (
    echo ✅ Frontend package file exists
) else (
    echo ❌ Frontend package file missing
)

if exist "ai-services\main.py" (
    echo ✅ AI services main file exists
) else (
    echo ❌ AI services main file missing
)

if exist "data\db" (
    echo ✅ MongoDB data directory exists
) else (
    echo ❌ MongoDB data directory missing
    mkdir data\db 2>nul
    echo    Created data\db directory
)

echo.
echo ========================================
echo Health Check Complete
echo ========================================
echo.

REM Provide recommendations
echo 💡 Recommendations:
echo.

where mongod >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo 1. Install MongoDB: run setup-mongodb.bat
)

if not exist "backend\node_modules" (
    echo 2. Install backend deps: cd backend && npm install
)

if not exist "frontend\node_modules" (
    echo 3. Install frontend deps: cd frontend && npm install
)

if not exist "ai-services\venv" (
    echo 4. Setup AI services: cd ai-services && python -m venv venv
)

netstat -an | find "27017" >nul
if %ERRORLEVEL% NEQ 0 (
    echo 5. Start MongoDB first
)

echo.
echo To start all services: run start-realtime.bat
echo.
pause