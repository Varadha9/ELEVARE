@echo off
echo ========================================
echo ELEVARE Health Check
echo ========================================
echo.

echo Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo ✓ MongoDB is running
) else (
    echo ✗ MongoDB is not running
)

echo.
echo Checking Backend API...
curl -s http://localhost:5000/health >nul 2>&1
if "%ERRORLEVEL%"=="0" (
    echo ✓ Backend API is responding
) else (
    echo ✗ Backend API is not responding
)

echo.
echo Checking AI Services...
curl -s http://localhost:8000/health >nul 2>&1
if "%ERRORLEVEL%"=="0" (
    echo ✓ AI Services are responding
) else (
    echo ✗ AI Services are not responding
)

echo.
echo Checking Frontend...
netstat -an | find "3000" >nul
if "%ERRORLEVEL%"=="0" (
    echo ✓ Frontend is running on port 3000
) else (
    echo ✗ Frontend is not running
)

echo.
echo ========================================
echo Health check complete!
echo ========================================
pause