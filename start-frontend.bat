@echo off
title TnP Frontend (Port 5173)
cd /d "%~dp0frontend"
echo ==============================================
echo  Starting Training and Placement Frontend
echo ==============================================
echo Launching frontend Vite server on http://localhost:5173...
call npm run dev
pause
