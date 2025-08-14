#!/bin/bash

# AdmitAI Korea - Development Environment Setup
# This script sets up a complete development environment

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Node.js if not present
install_nodejs() {
    if ! command_exists node; then
        print_status "Node.js not found. Installing Node.js 18..."
        
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command_exists brew; then
                brew install node@18
                brew link node@18 --force
            else
                print_error "Homebrew not found. Please install Homebrew first: https://brew.sh/"
                exit 1
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
            sudo apt-get install -y nodejs
        else
            print_error "Unsupported operating system. Please install Node.js 18 manually."
            exit 1
        fi
    else
        local node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
        if [ "$node_version" -lt 18 ]; then
            print_warning "Node.js version 18+ is required. Current version: $(node --version)"
            print_status "Please upgrade Node.js to version 18 or higher."
            exit 1
        fi
    fi
    
    print_success "Node.js $(node --version) is installed"
}

# Function to install Docker if not present
install_docker() {
    if ! command_exists docker; then
        print_status "Docker not found. Installing Docker..."
        
        if [[ "$OSTYPE" == "darwin"* ]]; then
            # macOS
            if command_exists brew; then
                brew install --cask docker
            else
                print_error "Homebrew not found. Please install Docker Desktop manually: https://www.docker.com/products/docker-desktop/"
                exit 1
            fi
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            # Linux
            curl -fsSL https://get.docker.com -o get-docker.sh
            sudo sh get-docker.sh
            sudo usermod -aG docker $USER
            rm get-docker.sh
        else
            print_error "Unsupported operating system. Please install Docker manually."
            exit 1
        fi
    fi
    
    print_success "Docker $(docker --version) is installed"
}

# Function to setup environment variables
setup_env() {
    print_status "Setting up environment variables..."
    
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        cp "$PROJECT_ROOT/env.example" "$PROJECT_ROOT/.env"
        print_success "Environment file created from template"
        
        print_warning "Please edit .env file with your configuration:"
        print_status "  - Database connection string"
        print_status "  - JWT secret"
        print_status "  - OpenAI API key"
        print_status "  - Other required variables"
    else
        print_status "Environment file already exists"
    fi
}

# Function to setup Git hooks
setup_git_hooks() {
    print_status "Setting up Git hooks..."
    
    # Create .git/hooks directory if it doesn't exist
    mkdir -p "$PROJECT_ROOT/.git/hooks"
    
    # Pre-commit hook
    cat > "$PROJECT_ROOT/.git/hooks/pre-commit" << 'EOF'
#!/bin/bash
# Pre-commit hook to run linting and tests

echo "Running pre-commit checks..."

# Run linting
npm run lint
if [ $? -ne 0 ]; then
    echo "Linting failed. Please fix the issues before committing."
    exit 1
fi

# Run tests
npm run test
if [ $? -ne 0 ]; then
    echo "Tests failed. Please fix the issues before committing."
    exit 1
fi

echo "Pre-commit checks passed!"
EOF
    
    chmod +x "$PROJECT_ROOT/.git/hooks/pre-commit"
    print_success "Git hooks configured"
}

# Function to setup VS Code settings
setup_vscode() {
    print_status "Setting up VS Code configuration..."
    
    mkdir -p "$PROJECT_ROOT/.vscode"
    
    # VS Code settings
    cat > "$PROJECT_ROOT/.vscode/settings.json" << 'EOF'
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.suggest.autoImports": true,
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"],
    ["cx\\(([^)]*)\\)", "(?:'|\"|`)([^']*)(?:'|\"|`)"]
  ]
}
EOF
    
    # VS Code extensions recommendations
    cat > "$PROJECT_ROOT/.vscode/extensions.json" << 'EOF'
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense",
    "ms-vscode.vscode-json",
    "prisma.prisma"
  ]
}
EOF
    
    print_success "VS Code configuration created"
}

# Function to setup database
setup_database() {
    print_status "Setting up database..."
    
    cd "$PROJECT_ROOT/backend"
    
    # Generate Prisma client
    npm run db:generate
    
    # Run migrations
    npm run migrate
    
    # Seed database
    npm run seed
    
    print_success "Database setup completed"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing project dependencies..."
    
    # Install root dependencies
    cd "$PROJECT_ROOT"
    npm install
    
    # Install frontend dependencies
    cd "$PROJECT_ROOT/frontend"
    npm install
    
    # Install backend dependencies
    cd "$PROJECT_ROOT/backend"
    npm install
    
    print_success "All dependencies installed"
}

# Function to verify setup
verify_setup() {
    print_status "Verifying setup..."
    
    # Check if all required files exist
    local required_files=(
        ".env"
        "frontend/package.json"
        "backend/package.json"
        "frontend/src/App.tsx"
        "backend/src/index.ts"
    )
    
    for file in "${required_files[@]}"; do
        if [ ! -f "$PROJECT_ROOT/$file" ]; then
            print_error "Required file missing: $file"
            exit 1
        fi
    done
    
    # Check if servers can start
    print_status "Testing if servers can start..."
    
    # Test backend
    cd "$PROJECT_ROOT/backend"
    timeout 10s npm run dev > /dev/null 2>&1 &
    BACKEND_PID=$!
    sleep 5
    if kill -0 $BACKEND_PID 2>/dev/null; then
        kill $BACKEND_PID
        print_success "Backend server test passed"
    else
        print_error "Backend server test failed"
        exit 1
    fi
    
    print_success "Setup verification completed"
}

# Main setup function
main() {
    echo "AdmitAI Korea - Development Environment Setup"
    echo "============================================="
    echo ""
    
    # Check prerequisites
    install_nodejs
    install_docker
    
    # Setup project
    setup_env
    setup_git_hooks
    setup_vscode
    
    # Install dependencies
    install_dependencies
    
    # Setup database
    setup_database
    
    # Verify setup
    verify_setup
    
    echo ""
    print_success "Development environment setup completed!"
    echo ""
    print_status "Next steps:"
    print_status "1. Edit .env file with your configuration"
    print_status "2. Run 'npm run dev' to start development servers"
    print_status "3. Open http://localhost:3000 in your browser"
    echo ""
    print_status "Available commands:"
    print_status "  npm run dev          # Start development servers"
    print_status "  npm run test         # Run tests"
    print_status "  npm run lint         # Run linting"
    print_status "  npm run build        # Build for production"
    print_status "  npm run studio       # Open Prisma Studio"
    echo ""
}

# Run main function
main "$@" 