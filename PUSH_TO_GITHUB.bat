@echo off
echo.
echo ========================================
echo   SafeDoc - Push to GitHub
echo ========================================
echo.
echo Before running this script:
echo 1. Create a repository at https://github.com/new
echo 2. Name it: safedoc
echo 3. Do NOT add README, .gitignore, or license
echo.
echo ========================================
echo.
pause
echo.

:INPUT
set /p USERNAME="Enter your GitHub username: "
if "%USERNAME%"=="" (
    echo ERROR: Username cannot be empty!
    goto INPUT
)

echo.
echo Setting up remote: https://github.com/%USERNAME%/safedoc.git
echo.

REM Remove origin if it exists
git remote remove origin 2>nul

REM Add new origin
git remote add origin https://github.com/%USERNAME%/safedoc.git

REM Verify remote
echo.
echo Remote configured:
git remote -v
echo.

REM Set main branch
git branch -M main

echo.
echo ========================================
echo   Ready to push!
echo ========================================
echo.
echo You will be prompted for:
echo 1. Username: %USERNAME%
echo 2. Password: Use Personal Access Token (NOT your GitHub password)
echo.
echo Create a token at: https://github.com/settings/tokens
echo Select scope: repo (full control)
echo.
pause

REM Push to GitHub
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   SUCCESS! Code pushed to GitHub!
    echo ========================================
    echo.
    echo View your repository:
    echo https://github.com/%USERNAME%/safedoc
    echo.
    start https://github.com/%USERNAME%/safedoc
) else (
    echo.
    echo ========================================
    echo   PUSH FAILED!
    echo ========================================
    echo.
    echo Common issues:
    echo - Wrong username or token
    echo - Repository doesn't exist
    echo - Network connection issue
    echo.
    echo See PUSH_TO_GITHUB.md for detailed help
    echo.
)

pause
