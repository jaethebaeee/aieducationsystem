#!/bin/bash

# AdmitAI Korea - Development Startup Script
# This script starts the development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project root directory
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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

# Function to check if environment is set up
check_setup() {
    print_status "Checking development environment..."
    
    # Check if .env exists
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        print_warning "Environment file (.env) not found."
        print_status "Creating from template..."
        cp "$PROJECT_ROOT/env.example" "$PROJECT_ROOT/.env"
        print_warning "Please edit .env file with your configuration before continuing."
        print_status "Press Enter to continue or Ctrl+C to exit..."
        read
    fi
    
    # Check if dependencies are installed
    if [ ! -d "$PROJECT_ROOT/frontend/node_modules" ] || [ ! -d "$PROJECT_ROOT/backend/node_modules" ]; then
        print_warning "Dependencies not installed. Installing now..."
        "$PROJECT_ROOT/scripts/dev-workflow.sh" install
    fi
}

# Function to start development servers
start_development() {
    print_status "Starting development environment..."
    
    # Use the standardized workflow script
    "$PROJECT_ROOT/scripts/dev-workflow.sh" dev
}

# Function to show help
show_help() {
    echo "AdmitAI Korea - Development Startup"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  --setup        Run full setup (install dependencies, setup database)"
    echo "  --check        Check environment setup"
    echo "  --help         Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0              # Start development servers"
    echo "  $0 --setup      # Run full setup and start servers"
    echo "  $0 --check      # Check environment setup only"
}

# Main script logic
case "${1:-}" in
    "--setup")
        print_status "Running full setup..."
        "$PROJECT_ROOT/scripts/dev-workflow.sh" install
        "$PROJECT_ROOT/scripts/dev-workflow.sh" setup-db
        start_development
        ;;
    "--check")
        check_setup
        ;;
    "--help"|"-h"|"help")
        show_help
        ;;
    "")
        check_setup
        start_development
        ;;
    *)
        print_error "Unknown option: $1"
        echo ""
        show_help
        exit 1
        ;;
esac 