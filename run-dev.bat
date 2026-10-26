@echo off
chcp 65001 >nul
title He thong Dang ky Mon hoc PTIT - Launcher

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%dangky-monhoc-ptit\backend"
set "FRONTEND_DIR=%ROOT_DIR%dangky-monhoc-ptit\frontend"

echo ========================================================
echo   KHOI DONG HE THONG DANG KY MON HOC - PTIT
echo ========================================================
echo.

:: 1. Kiem tra file .env cua Backend
if not exist "%BACKEND_DIR%\.env" (
    if exist "%BACKEND_DIR%\.env.example" (
        echo [INFO] Dang tao file backend\.env tu .env.example...
        copy /Y "%BACKEND_DIR%\.env.example" "%BACKEND_DIR%\.env" >nul
    )
)

:: 2. Kiem tra node_modules cua Backend
if not exist "%BACKEND_DIR%\node_modules" (
    echo [INFO] Chua co node_modules o Backend. Dang cai dat thu vien...
    pushd "%BACKEND_DIR%"
    call npm install
    popd
)

:: 3. Kiem tra node_modules cua Frontend
if not exist "%FRONTEND_DIR%\node_modules" (
    echo [INFO] Chua co node_modules o Frontend. Dang cai dat thu vien...
    pushd "%FRONTEND_DIR%"
    call npm install
    popd
)

:: 4. Khoi chay Backend va Frontend tren 2 cua so rieng biet
echo [1/2] Dang khoi chay Backend API tai http://localhost:5000/api ...
start "PTIT Backend - Port 5000" cmd /k "cd /d "%BACKEND_DIR%" && npm run dev"

echo [2/2] Dang khoi chay Frontend Web tai http://localhost:5173 ...
start "PTIT Frontend - Port 5173" cmd /k "cd /d "%FRONTEND_DIR%" && npm run dev"

:: 5. Doi 2 giay va tu dong mo trinh duyet
timeout /t 2 /nobreak >nul
start "" "http://localhost:5173"

echo.
echo [OK] Da khoi chay thanh cong ca Backend va Frontend!
echo Ban co the dong cua so nay.
timeout /t 3 >nul
exit
