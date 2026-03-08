@echo off
echo ========================================
echo Starting ELEVARE Platform
echo ========================================
echo.

echo Starting MongoDB...
start "MongoDB" cmd /k "mongod --dbpath ./data/db"
timeout /t 3 /nobreak >nul

echo Starting Backend API...
start "Backend" cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak >nul

echo Starting AI Services...
start "AI Services" cmd /k "cd ai-services && venv\Scripts\activate && python main.py"
timeout /t 3 /nobreak >nul

echo Starting Frontend...
start "Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo All Services Started!
echo.
echo MongoDB:     http://localhost:27017
echo Backend:     http://localhost:5000
echo AI Service:  http://localhost:8000
echo Frontend:    http://localhost:3000
echo.
echo Press any key to stop all services...
echo ========================================
pause >nul

echo Stopping all services...
taskkill /FI "WindowTitle eq MongoDB*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq Backend*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq AI Services*" /T /F >nul 2>&1
taskkill /FI "WindowTitle eq Frontend*" /T /F >nul 2>&1

echo All services stopped.
pause
