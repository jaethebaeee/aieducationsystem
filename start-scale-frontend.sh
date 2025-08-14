#!/bin/bash

# Start Scale AI-style AdmitAI Frontend
echo "🚀 Starting Scale AI-style AdmitAI Frontend..."

# Navigate to frontend directory
cd frontend

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Start the development server
echo "✨ Starting development server on http://localhost:3000"
echo "🎨 Scale AI design is now live!"
npm start