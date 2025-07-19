@echo off
setlocal enabledelayedexpansion

REM HeyPlay Test Script for Windows
REM This script tests all components of the HeyPlay application

echo 🧪 HeyPlay Application Test Suite
echo ==================================
echo.

set TESTS_PASSED=0
set TESTS_FAILED=0

REM Function to print test results
:print_result
if %1 EQU 0 (
    echo ✅ %~2
    set /a TESTS_PASSED+=1
) else (
    echo ❌ %~2
    set /a TESTS_FAILED+=1
)
goto :eof

REM Function to test if a service is running
:test_service
curl -s --connect-timeout 10 "%~1" >nul 2>&1
if !errorlevel! EQU 0 (
    call :print_result 0 "%~2 is running"
) else (
    call :print_result 1 "%~2 is not accessible"
)
goto :eof

REM Test Prerequisites
echo 📋 Testing Prerequisites...
echo ----------------------------

REM Check Node.js
node --version >nul 2>&1
if !errorlevel! EQU 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    call :print_result 0 "Node.js installed (!NODE_VERSION!)"
) else (
    call :print_result 1 "Node.js is not installed"
)

REM Check npm
npm --version >nul 2>&1
if !errorlevel! EQU 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    call :print_result 0 "npm installed (!NPM_VERSION!)"
) else (
    call :print_result 1 "npm is not installed"
)

REM Check MongoDB
mongod --version >nul 2>&1
if !errorlevel! EQU 0 (
    call :print_result 0 "MongoDB installed"
) else (
    call :print_result 1 "MongoDB is not installed (local)"
)

REM Check Expo CLI
expo --version >nul 2>&1
if !errorlevel! EQU 0 (
    for /f "tokens=*" %%i in ('expo --version') do set EXPO_VERSION=%%i
    call :print_result 0 "Expo CLI installed (!EXPO_VERSION!)"
) else (
    call :print_result 1 "Expo CLI is not installed"
)

echo.

REM Test Backend Dependencies
echo 🔧 Testing Backend Dependencies...
echo -----------------------------------

if exist "backend\package.json" (
    call :print_result 0 "Backend package.json found"
    
    if exist "backend\node_modules" (
        call :print_result 0 "Backend dependencies installed"
    ) else (
        call :print_result 1 "Backend dependencies not installed"
        echo    Run: cd backend ^&^& npm install
    )
) else (
    call :print_result 1 "Backend package.json not found"
)

echo.

REM Test Web Dependencies
echo 🌐 Testing Web Dependencies...
echo ------------------------------

if exist "web\package.json" (
    call :print_result 0 "Web package.json found"
    
    if exist "web\node_modules" (
        call :print_result 0 "Web dependencies installed"
    ) else (
        call :print_result 1 "Web dependencies not installed"
        echo    Run: cd web ^&^& npm install
    )
) else (
    call :print_result 1 "Web package.json not found"
)

echo.

REM Test Mobile Dependencies
echo 📱 Testing Mobile Dependencies...
echo --------------------------------

if exist "mobile\package.json" (
    call :print_result 0 "Mobile package.json found"
    
    if exist "mobile\node_modules" (
        call :print_result 0 "Mobile dependencies installed"
    ) else (
        call :print_result 1 "Mobile dependencies not installed"
        echo    Run: cd mobile ^&^& npm install
    )
) else (
    call :print_result 1 "Mobile package.json not found"
)

echo.

REM Test Configuration Files
echo ⚙️  Testing Configuration Files...
echo ----------------------------------

if exist "backend\.env" (
    call :print_result 0 "Backend .env file exists"
) else (
    call :print_result 1 "Backend .env file missing"
    echo    Create: backend\.env (see backend\.env.example)
)

if exist "web\.env.local" (
    call :print_result 0 "Web .env.local file exists"
) else (
    call :print_result 1 "Web .env.local file missing"
    echo    Create: web\.env.local with NEXT_PUBLIC_API_URL
)

if exist "mobile\config\constants.ts" (
    call :print_result 0 "Mobile config file exists"
) else (
    call :print_result 1 "Mobile config file missing"
    echo    Check: mobile\config\constants.ts
)

echo.

REM Test Running Services
echo 🚀 Testing Running Services...
echo ------------------------------

call :test_service "http://localhost:5000/api/health" "Backend API"
call :test_service "http://localhost:3000" "Web Application"

echo.

REM Test File Structure
echo 📁 Testing File Structure...
echo ----------------------------

REM Critical backend files
set backend_files=backend\index.js backend\package.json backend\src\models\Users.js backend\src\routes\auth.js backend\src\routes\rooms.js backend\src\routes\media.js

for %%f in (%backend_files%) do (
    if exist "%%f" (
        call :print_result 0 "Found: %%f"
    ) else (
        call :print_result 1 "Missing: %%f"
    )
)

REM Critical web files
set web_files=web\package.json web\next.config.ts web\src\app\page.tsx web\src\app\layout.tsx web\src\app\auth\page.tsx

for %%f in (%web_files%) do (
    if exist "%%f" (
        call :print_result 0 "Found: %%f"
    ) else (
        call :print_result 1 "Missing: %%f"
    )
)

REM Critical mobile files
set mobile_files=mobile\App.tsx mobile\package.json mobile\app.json mobile\src\screens\HomeScreen.tsx mobile\src\screens\AuthScreen.tsx mobile\src\context\AuthContext.tsx

for %%f in (%mobile_files%) do (
    if exist "%%f" (
        call :print_result 0 "Found: %%f"
    ) else (
        call :print_result 1 "Missing: %%f"
    )
)

echo.

REM Test Build Processes
echo 🔨 Testing Build Processes...
echo -----------------------------

REM Test backend syntax
if exist "backend\package.json" if exist "backend\node_modules" (
    pushd backend
    node -c index.js >nul 2>&1
    if !errorlevel! EQU 0 (
        call :print_result 0 "Backend syntax check passed"
    ) else (
        call :print_result 1 "Backend syntax errors found"
    )
    popd
)

REM Test web build (quick check)
if exist "web\package.json" if exist "web\node_modules" (
    pushd web
    npm run build >nul 2>&1
    if !errorlevel! EQU 0 (
        call :print_result 0 "Web build successful"
        REM Clean up build
        if exist ".next" rmdir /s /q ".next" >nul 2>&1
    ) else (
        call :print_result 1 "Web build failed"
    )
    popd
)

echo.

REM Summary
echo 📊 Test Summary
echo ===============
echo Tests Passed: %TESTS_PASSED%
echo Tests Failed: %TESTS_FAILED%
echo.

if %TESTS_FAILED% EQU 0 (
    echo 🎉 All tests passed! Your HeyPlay application is ready to run.
    echo.
    echo To start the application:
    echo 1. Start Backend: cd backend ^&^& npm run dev
    echo 2. Start Web: cd web ^&^& npm run dev
    echo 3. Start Mobile: cd mobile ^&^& npm start
) else (
    echo ⚠️  Some tests failed. Please address the issues above before running the application.
    echo.
    echo Common solutions:
    echo 1. Run setup script: setup.bat
    echo 2. Install dependencies manually in each directory
    echo 3. Create missing configuration files
)

echo.
echo For detailed setup instructions, see README.md
echo For deployment help, see DEPLOYMENT.md

pause
