#!/bin/bash

# AdmitAI Korea - Development Workflow Script
# This script provides standardized development commands and utilities

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

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    local missing_deps=()
    
    if ! command_exists node; then
        missing_deps+=("Node.js")
    fi
    
    if ! command_exists npm; then
        missing_deps+=("npm")
    fi
    
    if ! command_exists docker; then
        missing_deps+=("Docker")
    fi
    
    if ! command_exists docker-compose; then
        missing_deps+=("Docker Compose")
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        print_status "Please install the missing dependencies and try again."
        exit 1
    fi
    
    # Check Node.js version
    local node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$node_version" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node --version)"
        exit 1
    fi
    
    print_success "All prerequisites are satisfied"
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Frontend dependencies
    print_status "Installing frontend dependencies..."
    cd "$PROJECT_ROOT/frontend"
    npm install
    
    # Backend dependencies
    print_status "Installing backend dependencies..."
    cd "$PROJECT_ROOT/backend"
    npm install
    
    print_success "Dependencies installed successfully"
}

# Function to setup database
setup_database() {
    print_status "Setting up database..."
    
    cd "$PROJECT_ROOT/backend"
    
    # Generate Prisma client
    print_status "Generating Prisma client..."
    npm run db:generate
    
    # Run migrations
    print_status "Running database migrations..."
    npm run migrate
    
    # Seed database
    print_status "Seeding database..."
    npm run seed
    
    print_success "Database setup completed"
}

# Function to start development servers
start_dev() {
    print_status "Starting development servers..."
    
    # Start backend
    print_status "Starting backend server..."
    cd "$PROJECT_ROOT/backend"
    npm run dev &
    BACKEND_PID=$!
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start frontend
    print_status "Starting frontend server..."
    cd "$PROJECT_ROOT/frontend"
    npm run dev &
    FRONTEND_PID=$!
    
    print_success "Development servers started"
    print_status "Frontend: http://localhost:3000"
    print_status "Backend: http://localhost:5000"
    print_status "Prisma Studio: http://localhost:5555"
    
    # Wait for user to stop servers
    echo ""
    print_warning "Press Ctrl+C to stop all servers"
    
    # Function to cleanup on exit
    cleanup() {
        print_status "Stopping development servers..."
        kill $BACKEND_PID 2>/dev/null || true
        kill $FRONTEND_PID 2>/dev/null || true
        print_success "Development servers stopped"
        exit 0
    }
    
    trap cleanup SIGINT SIGTERM
    
    # Wait for background processes
    wait
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    # Frontend tests
    print_status "Running frontend tests..."
    cd "$PROJECT_ROOT/frontend"
    npm run test -- --watchAll=false
    
    # Backend tests
    print_status "Running backend tests..."
    cd "$PROJECT_ROOT/backend"
    npm run test
    
    print_success "All tests completed"
}

# Function to run linting
run_lint() {
    print_status "Running linting..."
    
    # Frontend linting
    print_status "Linting frontend code..."
    cd "$PROJECT_ROOT/frontend"
    npm run lint
    
    # Backend linting
    print_status "Linting backend code..."
    cd "$PROJECT_ROOT/backend"
    npm run lint
    
    print_success "Linting completed"
}

# Function to build for production
build_production() {
    print_status "Building for production..."
    
    # Build backend
    print_status "Building backend..."
    cd "$PROJECT_ROOT/backend"
    npm run build
    
    # Build frontend
    print_status "Building frontend..."
    cd "$PROJECT_ROOT/frontend"
    npm run build
    
    print_success "Production build completed"
}

# Function to open Prisma Studio
open_prisma_studio() {
    print_status "Opening Prisma Studio..."
    cd "$PROJECT_ROOT/backend"
    npm run db:studio
}

# Function to reset database
reset_database() {
    print_warning "This will reset the database and lose all data. Are you sure? (y/N)"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        print_status "Resetting database..."
        cd "$PROJECT_ROOT/backend"
        npm run migrate:reset
        npm run seed
        print_success "Database reset completed"
    else
        print_status "Database reset cancelled"
    fi
}

# Function to show logs
show_logs() {
    print_status "Showing application logs..."
    
    if [ -f "$PROJECT_ROOT/backend/logs/combined.log" ]; then
        tail -f "$PROJECT_ROOT/backend/logs/combined.log"
    else
        print_warning "No log files found"
    fi
}

# Function to show help
show_help() {
    echo "AdmitAI Korea - Development Workflow"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  check          Check prerequisites"
    echo "  install        Install dependencies"
    echo "  setup-db       Setup database (migrations + seeding)"
    echo "  dev            Start development servers"
    echo "  test           Run tests"
    echo "  lint           Run linting"
    echo "  build          Build for production"
    echo "  studio         Open Prisma Studio"
    echo "  reset-db       Reset database (WARNING: loses data)"
    echo "  logs           Show application logs"
    echo "  help           Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 check       # Check if all prerequisites are installed"
    echo "  $0 install     # Install all dependencies"
    echo "  $0 dev         # Start development servers"
    echo "  $0 test        # Run all tests"
}

# Main script logic
case "${1:-help}" in
    "check")
        check_prerequisites
        ;;
    "install")
        check_prerequisites
        install_dependencies
        ;;
    "setup-db")
        setup_database
        ;;
    "dev")
        start_dev
        ;;
    "test")
        run_tests
        ;;
    "lint")
        run_lint
        ;;
    "build")
        build_production
        ;;
    "studio")
        open_prisma_studio
        ;;
    "reset-db")
        reset_database
        ;;
    "logs")
        show_logs
        ;;
    "help"|"--help"|"-h")
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_help
        exit 1
        ;;
esac 