@echo off
title TnP Backend (Port 3001)
cd /d "%~dp0backend"
echo ==============================================
echo  Starting Training and Placement Backend
echo ==============================================
echo [1/2] Checking port 3001...
call npm run kill:port
echo [2/2] Launching server on http://localhost:3001...
call npm start
pause
