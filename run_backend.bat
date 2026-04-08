@echo off
cd backend
echo 📦 Step 1: Installing Required Libraries...
call npm install --no-package-lock
echo.
echo 📡 Step 2: Starting the server...
call npm start
echo.
if %errorlevel% neq 0 (
    echo ❌ ERROR: Backend failed to start. 
    echo Check if you have Node.js installed and no other apps are using port 5001.
)
pause
