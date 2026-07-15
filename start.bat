@echo off
REM TaskMaster - Start Both Frontend and Backend
REM This script starts both the frontend and backend servers

echo 🚀 Starting TaskMaster Application...
echo ==================================

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Check if backend dependencies are installed
if not exist "backend\node_modules" (
    echo 📦 Installing backend dependencies...
    cd backend
    npm install
    cd ..
)

REM Check if frontend dependencies are installed
if not exist "frontend\node_modules" (
    echo 📦 Installing frontend dependencies...
    cd frontend
    npm install
    cd ..
)

REM Check if .env file exists
if not exist "backend\.env" (
    echo ⚠️  Backend .env file not found. Creating from sample...
    if exist "backend\.env.sample" (
        copy "backend\.env.sample" "backend\.env" >nul
        echo ✅ Created backend\.env from sample
        echo 📝 Please edit backend\.env with your configuration
    ) else (
        echo ❌ No .env.sample file found. Please create backend\.env manually
        pause
        exit /b 1
    )
)

REM Start backend in background
echo 🔧 Starting backend server...
cd backend
start "Backend Server" cmd /k "npm run dev"
cd ..

REM Wait a moment for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo 🎨 Starting frontend server...
cd frontend
start "Frontend Server" cmd /k "npm run dev"
cd ..

REM Wait a moment for frontend to start
timeout /t 3 /nobreak >nul

echo.
echo 🎉 TaskMaster is now running!
echo ==================================
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend API: http://localhost:3000
echo 📚 API Docs: http://localhost:3000/api-docs
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
pause
