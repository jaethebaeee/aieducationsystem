#!/bin/bash

# AdmitAI Korea - AgenticSeek Startup Script

set -e

echo "🚀 Starting AgenticSeek services..."

# Start Ollama
echo "Starting Ollama..."
docker-compose up -d ollama

# Wait for Ollama to be ready
echo "Waiting for Ollama to be ready..."
sleep 30

# Start SearxNG
echo "Starting SearxNG..."
docker-compose up -d searxng

# Wait for SearxNG to be ready
echo "Waiting for SearxNG to be ready..."
sleep 10

# Start AgenticSeek
echo "Starting AgenticSeek..."
docker-compose up -d agentic-seek

# Wait for AgenticSeek to be ready
echo "Waiting for AgenticSeek to be ready..."
sleep 20

# Check health
echo "Checking service health..."
curl -f http://localhost:8000/health && echo "✅ AgenticSeek is healthy"
curl -f http://localhost:8080 && echo "✅ SearxNG is healthy"
curl -f http://localhost:11434/api/tags && echo "✅ Ollama is healthy"

echo "🎉 AgenticSeek services started successfully!"
echo ""
echo "Service URLs:"
echo "  AgenticSeek: http://localhost:8000"
echo "  SearxNG: http://localhost:8080"
echo "  Ollama: http://localhost:11434"
echo ""
echo "Next steps:"
echo "  1. Run './download_models.sh' to download language models"
echo "  2. Start the main application with './start-dev.sh'"
