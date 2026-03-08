@echo off
echo ========================================
echo ELEVARE Setup Script
echo ========================================
echo.

echo [1/4] Installing Backend Dependencies...
cd backend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Backend installation failed
    pause
    exit /b 1
)
if not exist .env (
    copy .env.example .env
    echo Created .env file - Please configure it!
)
cd ..

echo [2/4] Installing Frontend Dependencies...
cd frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Frontend installation failed
    pause
    exit /b 1
)
cd ..

echo [3/4] Installing AI Services Dependencies...
cd ai-services
if not exist venv (
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt
python -c "import nltk; nltk.download('punkt', quiet=True); nltk.download('stopwords', quiet=True)"
cd ..

echo [4/4] Creating MongoDB Directory...
if not exist data\db (
    mkdir data\db
)

echo.
echo ========================================
echo Setup Complete!
echo.
echo Next Steps:
echo 1. Configure backend/.env file
echo 2. Run: start-all.bat
echo 3. Open: http://localhost:3000
echo ========================================
pause
