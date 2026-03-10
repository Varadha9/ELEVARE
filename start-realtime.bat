@echo off
echo ========================================
echo Starting ELEVARE Platform - Real-Time Mode
echo ========================================
echo.

REM Check if MongoDB is running
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo MongoDB is already running...
) else (
    echo Starting MongoDB...
    start "MongoDB" cmd /k "mongod --dbpath ./data/db"
    timeout /t 5 /nobreak >nul
)

REM Check if Backend is running
netstat -an | find "5000" >nul
if "%ERRORLEVEL%"=="0" (
    echo Backend is already running on port 5000...
) else (
    echo Starting Backend API...
    start "Backend" cmd /k "cd backend && npm run dev"
    timeout /t 3 /nobreak >nul
)

REM Check if AI Services is running
netstat -an | find "8000" >nul
if "%ERRORLEVEL%"=="0" (
    echo AI Services is already running on port 8000...
) else (
    echo Starting AI Services...
    start "AI Services" cmd /k "cd ai-services && python main.py"
    timeout /t 5 /nobreak >nul
)

REM Check if Frontend is running
netstat -an | find "3000" >nul
if "%ERRORLEVEL%"=="0" (
    echo Frontend is already running on port 3000...
) else (
    echo Starting Frontend...
    start "Frontend" cmd /k "cd frontend && npm run dev"
    timeout /t 3 /nobreak >nul
)

echo.
echo ========================================
echo ELEVARE Platform is now running!
echo.
echo Services:
echo - MongoDB:     http://localhost:27017
echo - Backend:     http://localhost:5000
echo - AI Service:  http://localhost:8000  
echo - Frontend:    http://localhost:3000
echo.
echo Real-time features enabled:
echo - Live chat with AI agent
echo - Real-time behavioral analysis
echo - Dynamic trait updates
echo - Instant recommendations
echo.
echo Press Ctrl+C to stop or close this window
echo ========================================

REM Keep the script running to monitor services
:loop
timeout /t 30 /nobreak >nul
echo [%time%] Services running... (Monitoring every 30s)
goto loop