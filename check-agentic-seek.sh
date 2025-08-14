#!/bin/bash

# AdmitAI Korea - AgenticSeek Health Check Script

echo "🔍 Checking AgenticSeek services health..."

# Check Ollama
echo "Checking Ollama..."
if curl -f http://localhost:11434/api/tags >/dev/null 2>&1; then
    echo "✅ Ollama is healthy"
else
    echo "❌ Ollama is not responding"
fi

# Check SearxNG
echo "Checking SearxNG..."
if curl -f http://localhost:8080 >/dev/null 2>&1; then
    echo "✅ SearxNG is healthy"
else
    echo "❌ SearxNG is not responding"
fi

# Check AgenticSeek
echo "Checking AgenticSeek..."
if curl -f http://localhost:8000/health >/dev/null 2>&1; then
    echo "✅ AgenticSeek is healthy"
else
    echo "❌ AgenticSeek is not responding"
fi

echo ""
echo "📊 Service Status Summary:"
docker-compose ps --filter "name=agentic"
