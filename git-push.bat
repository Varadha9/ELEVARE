@echo off
echo Initializing Git repository and pushing to GitHub...
echo.

git init
git add .
git commit -m "Initial commit: Complete ELEVARE AI Career Discovery Platform"
git branch -M main
git remote add origin https://github.com/Varadha9/ELEVARE.git
git push -u origin main

echo.
echo Done! Project pushed to GitHub.
pause
