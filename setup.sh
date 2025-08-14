#!/bin/bash

# =============================================================================
# AdmitAI Korea Setup Script
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Function to check Node.js version
check_node_version() {
    if command_exists node; then
        NODE_VERSION=$(node -v | cut -d'v' -f2)
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1)
        if [ "$NODE_MAJOR" -ge 18 ]; then
            print_success "Node.js version $NODE_VERSION is compatible"
            return 0
        else
            print_error "Node.js version $NODE_VERSION is too old. Please install Node.js 18 or higher."
            return 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        return 1
    fi
}

# Function to check Docker
check_docker() {
    if command_exists docker; then
        print_success "Docker is installed"
        if command_exists docker-compose; then
            print_success "Docker Compose is installed"
            return 0
        else
            print_warning "Docker Compose is not installed. Installing..."
            return 1
        fi
    else
        print_error "Docker is not installed. Please install Docker and Docker Compose."
        return 1
    fi
}

# Function to create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p logs
    mkdir -p uploads
    mkdir -p frontend/public
    mkdir -p backend/src/{controllers,models,routes,middleware,services,utils,types}
    mkdir -p nginx/{ssl,logs}
    
    print_success "Directories created"
}

# Function to copy environment file
setup_environment() {
    print_status "Setting up environment configuration..."
    
    if [ ! -f .env ]; then
        cp env.example .env
        print_success "Environment file created from template"
        print_warning "Please edit .env file with your configuration"
    else
        print_warning "Environment file already exists"
    fi
}

# Function to install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    # Install root dependencies
    npm install
    
    # Install frontend dependencies
    print_status "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
    
    # Install backend dependencies
    print_status "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
    
    print_success "All dependencies installed"
}

# Function to setup database
setup_database() {
    print_status "Setting up database..."
    
    cd backend
    
    # Generate Prisma client
    print_status "Generating Prisma client..."
    npx prisma generate
    
    # Run database migrations
    print_status "Running database migrations..."
    npx prisma migrate dev --name init
    
    # Seed database (if seed script exists)
    if [ -f "src/scripts/seed.ts" ]; then
        print_status "Seeding database..."
        npm run seed
    fi
    
    cd ..
    
    print_success "Database setup completed"
}

# Function to build frontend
build_frontend() {
    print_status "Building frontend..."
    
    cd frontend
    npm run build
    cd ..
    
    print_success "Frontend built successfully"
}

# Function to start services with Docker
start_docker_services() {
    print_status "Starting Docker services..."
    
    # Start development services
    docker-compose --profile development up -d
    
    print_success "Docker services started"
    print_status "Services available at:"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend API: http://localhost:5000"
    echo "  - Prisma Studio: http://localhost:5555"
    echo "  - Mailhog: http://localhost:8025"
}

# Function to start services without Docker
start_local_services() {
    print_status "Starting local services..."
    
    # Start backend
    print_status "Starting backend server..."
    cd backend
    npm run dev &
    BACKEND_PID=$!
    cd ..
    
    # Start frontend
    print_status "Starting frontend server..."
    cd frontend
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    print_success "Local services started"
    print_status "Services available at:"
    echo "  - Frontend: http://localhost:3000"
    echo "  - Backend API: http://localhost:5000"
    echo ""
    print_warning "Press Ctrl+C to stop all services"
    
    # Wait for user to stop
    trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
    wait
}

# Function to run tests
run_tests() {
    print_status "Running tests..."
    
    # Run backend tests
    cd backend
    npm test
    cd ..
    
    # Run frontend tests
    cd frontend
    npm test -- --watchAll=false
    cd ..
    
    print_success "All tests passed"
}

# Function to show help
show_help() {
    echo "AdmitAI Korea Setup Script"
    echo ""
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  install     Install dependencies and setup the project"
    echo "  docker      Start services using Docker"
    echo "  local       Start services locally"
    echo "  test        Run tests"
    echo "  db          Setup database only"
    echo "  build       Build frontend only"
    echo "  help        Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 install    # Full installation"
    echo "  $0 docker     # Start with Docker"
    echo "  $0 local      # Start locally"
}

# Main script logic
main() {
    case "${1:-install}" in
        "install")
            print_status "Starting AdmitAI Korea installation..."
            
            # Check prerequisites
            check_node_version || exit 1
            check_docker || print_warning "Docker not available, will use local services"
            
            # Setup project
            create_directories
            setup_environment
            install_dependencies
            setup_database
            build_frontend
            
            print_success "Installation completed successfully!"
            print_status "Next steps:"
            echo "  1. Edit .env file with your configuration"
            echo "  2. Run '$0 docker' to start with Docker"
            echo "  3. Run '$0 local' to start locally"
            ;;
        
        "docker")
            check_docker || exit 1
            start_docker_services
            ;;
        
        "local")
            check_node_version || exit 1
            start_local_services
            ;;
        
        "test")
            run_tests
            ;;
        
        "db")
            setup_database
            ;;
        
        "build")
            build_frontend
            ;;
        
        "help"|"-h"|"--help")
            show_help
            ;;
        
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@" 