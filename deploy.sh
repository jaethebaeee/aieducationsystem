#!/bin/bash

# 🚀 AdmitAI Korea - Quick Deployment Script
# Deploy our unique competitive advantage: University Weather Intelligence

echo "🚀 Deploying AdmitAI Korea - University Weather Intelligence Platform"
echo "================================================================"

# Check if we're in the right directory
if [ ! -f "backend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "🔧 Setting up database..."
npx prisma generate
npx prisma db push

echo "🚀 Starting backend server..."
npm start &
BACKEND_PID=$!

echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "🚀 Starting frontend server..."
npm start &
FRONTEND_PID=$!

echo "🐍 Starting grammar service..."
cd ../backend/services
python3 grammarService.py 5001 &
GRAMMAR_PID=$!

echo ""
echo "🎉 AdmitAI Korea is now running!"
echo "================================================================"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
echo "📝 Grammar Service: http://localhost:5001"
echo ""
echo "🎯 Unique Features Deployed:"
echo "✅ University Weather Intelligence"
echo "✅ Korean Cultural Bridge"
echo "✅ Complete Application Journey"
echo "✅ Korean Student Success Data"
echo ""
echo "💰 Revenue Model:"
echo "🆓 Free Tier: Basic research, 1 essay/month"
echo "💎 Premium: $29/month - Unlimited analysis"
echo "🏫 Institution: $99/month - Multiple students"
echo ""
echo "📊 Target Market:"
echo "🇰🇷 Korean Students: 150,000+ annually"
echo "🏫 Korean Hagwons: 1,000+ institutions"
echo "👨‍👩‍👧‍👦 Korean Parents: 150,000+ decision makers"
echo ""
echo "🚀 Ready to capture the market opportunity!"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
trap "echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID $GRAMMAR_PID; exit" INT
wait 