#!/bin/bash

# AdmitAI Korea - AgenticSeek Setup Script
# This script sets up AgenticSeek integration with local LLM capabilities

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check system requirements
check_system_requirements() {
    print_status "Checking system requirements..."
    
    # Check available memory
    local total_mem=$(free -g | awk '/^Mem:/{print $2}')
    if [ "$total_mem" -lt 16 ]; then
        print_warning "System has less than 16GB RAM. AgenticSeek may not perform optimally."
    fi
    
    # Check available disk space
    local available_space=$(df -BG . | awk 'NR==2 {print $4}' | sed 's/G//')
    if [ "$available_space" -lt 50 ]; then
        print_warning "Less than 50GB available disk space. Consider freeing up space."
    fi
    
    # Check if Docker is available
    if ! command -v docker >/dev/null 2>&1; then
        print_error "Docker is required but not installed."
        exit 1
    fi
    
    # Check if Docker Compose is available
    if ! command -v docker-compose >/dev/null 2>&1; then
        print_error "Docker Compose is required but not installed."
        exit 1
    fi
    
    print_success "System requirements check completed"
}

# Function to clone AgenticSeek repository
clone_agentic_seek() {
    print_status "Cloning AgenticSeek repository..."
    
    if [ -d "$PROJECT_ROOT/agentic-seek" ]; then
        print_warning "AgenticSeek directory already exists. Updating..."
        cd "$PROJECT_ROOT/agentic-seek"
        git pull origin main
    else
        cd "$PROJECT_ROOT"
        git clone https://github.com/Fosowl/agenticSeek.git agentic-seek
    fi
    
    print_success "AgenticSeek repository cloned/updated"
}

# Function to setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    # Create .env file if it doesn't exist
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        cp "$PROJECT_ROOT/env.example" "$PROJECT_ROOT/.env"
        print_success "Environment file created from template"
    fi
    
    # Update .env with AgenticSeek configuration
    if ! grep -q "AGENTIC_SEEK_MODE" "$PROJECT_ROOT/.env"; then
        cat >> "$PROJECT_ROOT/.env" << 'EOF'

# =============================================================================
# AgenticSeek Configuration
# =============================================================================
AGENTIC_SEEK_MODE=local
AGENTIC_SEEK_URL=http://localhost:8000
AGENTIC_SEEK_MODEL=deepseek-coder:33b-instruct
AGENTIC_SEEK_MAX_TOKENS=4000
AGENTIC_SEEK_TEMPERATURE=0.7
AGENTIC_SEEK_VOICE=true
AGENTIC_SEEK_WEB_BROWSING=true
ENABLE_AGENTIC_SEEK=true
AGENTIC_SEEK_FALLBACK=true

# Local LLM Configuration (Ollama)
OLLAMA_HOST=http://localhost:11434
OLLAMA_MODEL=deepseek-coder:33b-instruct

# SearxNG Configuration (for web browsing)
SEARXNG_BASE_URL=http://localhost:8080
SEARXNG_INSTANCES=https://searx.be,https://searx.tiekoetter.com
EOF
        print_success "AgenticSeek configuration added to .env"
    fi
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p "$PROJECT_ROOT/models"
    mkdir -p "$PROJECT_ROOT/searxng"
    mkdir -p "$PROJECT_ROOT/logs"
    mkdir -p "$PROJECT_ROOT/backups"
    
    print_success "Directories created"
}

# Function to download Korean language models
download_korean_models() {
    print_status "Setting up Korean language models..."
    
    cd "$PROJECT_ROOT"
    
    # Create model download script
    cat > download_models.sh << 'EOF'
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
EOF
    
    chmod +x download_models.sh
    
    print_success "Model download script created"
    print_warning "Run './download_models.sh' after starting Ollama to download models"
}

# Function to create SearxNG configuration
setup_searxng() {
    print_status "Setting up SearxNG configuration..."
    
    cat > "$PROJECT_ROOT/searxng/settings.yml" << 'EOF'
general:
  debug: false
  instance_name: "AdmitAI Korea SearxNG"
  
search:
  safe_search: 0
  autocomplete: 'google'
  default_lang: 'ko'
  
server:
  port: 8080
  bind_address: "0.0.0.0"
  secret_key: "your-secret-key-change-this"
  base_url: false
  image_proxy: false
  http_protocol_version: "1.0"
  method: "POST"
  
ui:
  static_path: ""
  templates_path: ""
  default_theme: simple
  default_locale: "ko"
  
redis:
  url: false
  
outgoing:
  request_timeout: 3.0
  max_request_timeout: 15.0
  pool_connections: 100
  pool_maxsize: 100
  enable_http2: true
  verify: true
  max_redirects: 5
  retries: 1
  proxies:
    http: false
    https: false
  using_tor_proxy: false
  extra_proxy_timeout: true
  
engines:
  - name: google
    engine: google
    shortcut: g
    timeout: 3.0
    disabled: false
    
  - name: duckduckgo
    engine: duckduckgo
    shortcut: ddg
    timeout: 3.0
    disabled: false
    
  - name: bing
    engine: bing
    shortcut: b
    timeout: 3.0
    disabled: false
EOF
    
    print_success "SearxNG configuration created"
}

# Function to create AgenticSeek configuration
setup_agentic_seek_config() {
    print_status "Setting up AgenticSeek configuration..."
    
    cat > "$PROJECT_ROOT/agentic-seek/config.ini" << 'EOF'
[provider]
# Local LLM provider
provider = ollama
provider_server_address = http://ollama:11434
model = deepseek-coder:33b-instruct

[voice]
# Voice capabilities
enabled = true
voice_provider = local
voice_model = whisper

[web_browsing]
# Web browsing capabilities
enabled = true
searxng_base_url = http://searxng:8080
max_search_results = 5

[features]
# Feature flags
voice_enabled = true
web_browsing_enabled = true
file_upload_enabled = true
code_execution_enabled = false

[performance]
# Performance settings
max_tokens = 4000
temperature = 0.7
timeout = 120
EOF
    
    print_success "AgenticSeek configuration created"
}

# Function to create startup script
create_startup_script() {
    print_status "Creating startup script..."
    
    cat > "$PROJECT_ROOT/start-agentic-seek.sh" << 'EOF'
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
EOF
    
    chmod +x "$PROJECT_ROOT/start-agentic-seek.sh"
    
    print_success "Startup script created"
}

# Function to create health check script
create_health_check_script() {
    print_status "Creating health check script..."
    
    cat > "$PROJECT_ROOT/check-agentic-seek.sh" << 'EOF'
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
EOF
    
    chmod +x "$PROJECT_ROOT/check-agentic-seek.sh"
    
    print_success "Health check script created"
}

# Function to show next steps
show_next_steps() {
    echo ""
    print_success "AgenticSeek setup completed!"
    echo ""
    print_status "Next steps:"
    echo "1. Start AgenticSeek services:"
    echo "   ./start-agentic-seek.sh"
    echo ""
    echo "2. Download language models:"
    echo "   ./download_models.sh"
    echo ""
    echo "3. Start the main application:"
    echo "   ./start-dev.sh"
    echo ""
    echo "4. Check service health:"
    echo "   ./check-agentic-seek.sh"
    echo ""
    print_warning "Important notes:"
    echo "- Ensure you have sufficient RAM (16GB+ recommended)"
    echo "- The first startup may take several minutes"
    echo "- Models will be downloaded on first use"
    echo ""
    print_status "For more information, see:"
    echo "- AgenticSeek documentation: https://github.com/Fosowl/agenticSeek"
    echo "- Ollama documentation: https://ollama.ai/docs"
}

# Main setup function
main() {
    echo "AdmitAI Korea - AgenticSeek Setup"
    echo "================================="
    echo ""
    
    check_system_requirements
    clone_agentic_seek
    setup_environment
    create_directories
    download_korean_models
    setup_searxng
    setup_agentic_seek_config
    create_startup_script
    create_health_check_script
    show_next_steps
}

# Run main function
main "$@" 