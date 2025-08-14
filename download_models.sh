#!/bin/bash

echo "Downloading Korean language models for AgenticSeek..."

# Download Korean-optimized models
ollama pull deepseek-coder:33b-instruct
ollama pull qwen2.5:32b-instruct
ollama pull llama3.1:8b-instruct

# Download Korean-specific models if available
# ollama pull korean-llama:7b
# ollama pull korean-gpt:6b

echo "Model download completed!"
