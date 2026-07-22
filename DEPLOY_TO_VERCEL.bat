@echo off
echo ========================================
echo   SafeDoc - Vercel Deployment Helper
echo ========================================
echo.

echo Choose what to deploy:
echo.
echo 1. Toolset Labs Site (Static HTML)
echo 2. SafeDoc Backend (API)
echo 3. SafeDoc Frontend (Web App)
echo 4. Open Vercel Dashboard (Easy Way)
echo 5. Exit
echo.

set /p choice="Enter your choice (1-5): "

if "%choice%"=="1" (
    echo.
    echo Deploying Toolset Labs Site...
    cd "site toolset"
    vercel --prod
    pause
)

if "%choice%"=="2" (
    echo.
    echo Building and deploying SafeDoc Backend...
    cd backend
    call npm run build
    vercel --prod
    echo.
    echo IMPORTANT: Copy the deployment URL and add it to frontend!
    pause
)

if "%choice%"=="3" (
    echo.
    echo Building and deploying SafeDoc Frontend...
    cd web-app
    call npm run build
    vercel --prod
    pause
)

if "%choice%"=="4" (
    echo.
    echo Opening Vercel Dashboard...
    start https://vercel.com/new
    echo.
    echo Follow the guide in VERCEL_DEPLOYMENT_GUIDE.md
    pause
)

if "%choice%"=="5" (
    exit
)

echo.
echo Done!
pause
