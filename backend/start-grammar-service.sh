#!/bin/bash

# Start Grammar Service for AdmitAI Korea
echo "🚀 Starting LanguageTool Grammar Service..."

# Check if Python 3 is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+"
    exit 1
fi

# Check if required packages are installed
echo "📦 Checking Python dependencies..."
python3 -c "import flask, language_tool_python" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "📦 Installing required packages..."
    pip3 install -r requirements.txt
fi

# Start the grammar service
echo "🔧 Starting grammar service on port 5001..."
python3 services/grammarService.py 5001 