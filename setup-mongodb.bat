@echo off
echo ========================================
echo ELEVARE MongoDB Setup
echo ========================================
echo.

echo Checking MongoDB installation...
where mongod >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ MongoDB is already installed
    mongod --version
    goto :start_mongo
)

echo MongoDB not found. Checking installation options...

REM Check if Docker is available
docker --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ Docker found. Using Docker MongoDB...
    goto :docker_mongo
)

echo.
echo ❌ Neither MongoDB nor Docker found.
echo.
echo Please choose an installation option:
echo 1. Install MongoDB Community Server (Recommended)
echo 2. Install Docker Desktop (Alternative)
echo 3. Use online MongoDB Atlas (Cloud)
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" goto :install_mongo
if "%choice%"=="2" goto :install_docker
if "%choice%"=="3" goto :atlas_setup
goto :invalid_choice

:install_mongo
echo.
echo Opening MongoDB download page...
start https://www.mongodb.com/try/download/community
echo.
echo Please:
echo 1. Download MongoDB Community Server
echo 2. Install with default settings
echo 3. Make sure to add MongoDB to PATH
echo 4. Run this script again after installation
echo.
pause
exit /b 0

:install_docker
echo.
echo Opening Docker Desktop download page...
start https://www.docker.com/products/docker-desktop/
echo.
echo Please:
echo 1. Download Docker Desktop
echo 2. Install and restart your computer
echo 3. Run this script again after installation
echo.
pause
exit /b 0

:atlas_setup
echo.
echo Setting up MongoDB Atlas (Cloud)...
start https://www.mongodb.com/cloud/atlas/register
echo.
echo Please:
echo 1. Create a free MongoDB Atlas account
echo 2. Create a new cluster
echo 3. Get your connection string
echo 4. Update backend/.env with your Atlas URI
echo.
echo Example:
echo MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/elevare
echo.
pause
exit /b 0

:docker_mongo
echo Starting MongoDB with Docker...
docker stop elevare-mongo 2>nul
docker rm elevare-mongo 2>nul

if not exist "data\db" mkdir data\db

docker run -d ^
  --name elevare-mongo ^
  -p 27017:27017 ^
  -v "%CD%\data\db:/data/db" ^
  mongo:6

if %ERRORLEVEL% EQU 0 (
    echo ✅ MongoDB Docker container started
    echo Waiting for MongoDB to initialize...
    timeout /t 15 /nobreak >nul
    goto :test_connection
) else (
    echo ❌ Failed to start MongoDB Docker container
    pause
    exit /b 1
)

:start_mongo
echo Starting local MongoDB...
if not exist "data\db" mkdir data\db

tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✅ MongoDB is already running
) else (
    start "MongoDB" cmd /k "mongod --dbpath ./data/db"
    echo Waiting for MongoDB to start...
    timeout /t 10 /nobreak >nul
)

:test_connection
echo.
echo Testing MongoDB connection...
echo db.adminCommand('ismaster') | mongo --quiet >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo ✅ MongoDB connection successful
    echo.
    echo MongoDB is ready for ELEVARE!
    echo You can now run: start-realtime.bat
) else (
    echo ❌ MongoDB connection failed
    echo Please check the MongoDB service
)

echo.
pause
exit /b 0

:invalid_choice
echo Invalid choice. Please run the script again.
pause
exit /b 1