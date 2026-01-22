#!/bin/bash

# Setup script for macOS
# This script installs dependencies and starts both frontend and backend servers

set -e

echo "🚀 Setting up 3D Word Cloud project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python 3 is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "🐍 Creating Python virtual environment..."
cd backend
python3 -m venv venv
source venv/bin/activate

echo "📦 Installing backend dependencies..."
pip install --upgrade pip
pip install -r requirements.txt
cd ..

echo "✅ Setup complete!"
echo ""
echo "🚀 Starting servers..."
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start backend in background
cd backend
source venv/bin/activate
uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!
cd ..

# Start frontend
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Wait for user interrupt
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT TERM

wait
