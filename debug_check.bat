@echo off
echo --- System Check ---
node -v
if %errorlevel% neq 0 echo [ERROR] Node.js is NOT installed or not in PATH!
npm -v
if %errorlevel% neq 0 echo [ERROR] NPM is NOT installed or not in PATH!
echo --------------------
pause
