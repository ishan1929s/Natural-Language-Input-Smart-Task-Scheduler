#!/bin/bash

# TaskMaster - Start Both Frontend and Backend
# This script starts both the frontend and backend servers

echo "🚀 Starting TaskMaster Application..."
echo "=================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo "⚠️  Port $1 is already in use"
        return 1
    else
        return 0
    fi
}

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
if ! mongosh --eval "db.adminCommand('ping')" >/dev/null 2>&1; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   Windows: net start MongoDB"
    echo "   macOS: brew services start mongodb-community"
    echo "   Linux: sudo systemctl start mongod"
    echo ""
    echo "Continuing anyway..."
fi

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Backend .env file not found. Creating from sample..."
    if [ -f "backend/.env.sample" ]; then
        cp backend/.env.sample backend/.env
        echo "✅ Created backend/.env from sample"
        echo "📝 Please edit backend/.env with your configuration"
    else
        echo "❌ No .env.sample file found. Please create backend/.env manually"
        exit 1
    fi
fi

# Start backend in background
echo "🔧 Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend started successfully
if ! check_port 3000; then
    echo "❌ Backend failed to start on port 3000"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Backend started successfully on port 3000"

# Start frontend
echo "🎨 Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait a moment for frontend to start
sleep 3

# Check if frontend started successfully
if ! check_port 5173; then
    echo "❌ Frontend failed to start on port 5173"
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 1
fi

echo "✅ Frontend started successfully on port 5173"

echo ""
echo "🎉 TaskMaster is now running!"
echo "=================================="
echo "🌐 Frontend: http://localhost:5173"
echo "🔧 Backend API: http://localhost:3000"
echo "📚 API Docs: http://localhost:3000/api-docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait
