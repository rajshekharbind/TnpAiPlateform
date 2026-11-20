@echo off
title TnP Platform Launcher
cd /d "%~dp0"
echo ==============================================================
echo   Training and Placement Platform - Multi-Process Launcher
echo ==============================================================
echo.
echo Starting Backend (Port 3001) in a dedicated terminal...
start "TnP Backend" "%~dp0start-backend.bat"
timeout /t 3 /nobreak > nul
echo Starting Frontend (Port 5173) in a dedicated terminal...
start "TnP Frontend" "%~dp0start-frontend.bat"
echo.
echo Both services are launching:
echo   - Backend:  http://localhost:3001
echo   - Frontend: http://localhost:5173
echo.
pause
