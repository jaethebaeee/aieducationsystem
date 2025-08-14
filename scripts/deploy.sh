#!/bin/bash

# AdmitAI Korea - Production Deployment Script
# This script handles production deployment with proper checks and rollback

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEPLOYMENT_NAME="admitai-korea-$(date +%Y%m%d-%H%M%S)"
BACKUP_DIR="$PROJECT_ROOT/backups"
LOG_FILE="$PROJECT_ROOT/logs/deployment-$(date +%Y%m%d-%H%M%S).log"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

# Function to check prerequisites
check_prerequisites() {
    print_status "Checking deployment prerequisites..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    # Check if Docker Compose is available
    if ! command -v docker-compose > /dev/null 2>&1; then
        print_error "Docker Compose is not installed. Please install Docker Compose and try again."
        exit 1
    fi
    
    # Check if environment file exists
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        print_error "Environment file (.env) not found. Please create it from env.example."
        exit 1
    fi
    
    # Check required environment variables
    local required_vars=(
        "DATABASE_URL"
        "JWT_SECRET"
        "OPENAI_API_KEY"
        "POSTGRES_PASSWORD"
        "REDIS_PASSWORD"
    )
    
    for var in "${required_vars[@]}"; do
        if [ -z "${!var}" ]; then
            print_error "Required environment variable $var is not set."
            exit 1
        fi
    done
    
    print_success "Prerequisites check passed"
}

# Function to create backup
create_backup() {
    print_status "Creating backup of current deployment..."
    
    mkdir -p "$BACKUP_DIR"
    
    # Backup database
    if docker ps | grep -q "admitai-postgres"; then
        docker exec admitai-postgres pg_dump -U admitai_user admitai_korea > "$BACKUP_DIR/db-backup-$(date +%Y%m%d-%H%M%S).sql"
        print_success "Database backup created"
    fi
    
    # Backup uploads
    if [ -d "$PROJECT_ROOT/uploads" ]; then
        tar -czf "$BACKUP_DIR/uploads-backup-$(date +%Y%m%d-%H%M%S).tar.gz" -C "$PROJECT_ROOT" uploads/
        print_success "Uploads backup created"
    fi
    
    # Backup logs
    if [ -d "$PROJECT_ROOT/backend/logs" ]; then
        tar -czf "$BACKUP_DIR/logs-backup-$(date +%Y%m%d-%H%M%S).tar.gz" -C "$PROJECT_ROOT/backend" logs/
        print_success "Logs backup created"
    fi
}

# Function to run tests
run_tests() {
    print_status "Running pre-deployment tests..."
    
    # Build and test backend
    cd "$PROJECT_ROOT/backend"
    npm run build
    npm run test
    
    # Build and test frontend
    cd "$PROJECT_ROOT/frontend"
    npm run build
    npm run test
    
    print_success "All tests passed"
}

# Function to build images
build_images() {
    print_status "Building Docker images..."
    
    cd "$PROJECT_ROOT"
    
    # Build backend image
    print_status "Building backend image..."
    docker build -t admitai-backend:latest ./backend
    
    # Build frontend image
    print_status "Building frontend image..."
    docker build -t admitai-frontend:latest ./frontend
    
    print_success "Docker images built successfully"
}

# Function to deploy
deploy() {
    print_status "Starting deployment..."
    
    cd "$PROJECT_ROOT"
    
    # Stop existing containers
    print_status "Stopping existing containers..."
    docker-compose -f docker-compose.prod.yml down --remove-orphans
    
    # Start new deployment
    print_status "Starting new deployment..."
    docker-compose -f docker-compose.prod.yml up -d
    
    # Wait for services to be healthy
    print_status "Waiting for services to be healthy..."
    sleep 30
    
    # Check service health
    check_service_health
    
    print_success "Deployment completed successfully"
}

# Function to check service health
check_service_health() {
    print_status "Checking service health..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        print_status "Health check attempt $attempt/$max_attempts"
        
        # Check backend health
        if curl -f http://localhost:5000/health > /dev/null 2>&1; then
            print_success "Backend is healthy"
        else
            print_warning "Backend health check failed"
        fi
        
        # Check frontend health
        if curl -f http://localhost:3000 > /dev/null 2>&1; then
            print_success "Frontend is healthy"
        else
            print_warning "Frontend health check failed"
        fi
        
        # Check nginx health
        if curl -f http://localhost/health > /dev/null 2>&1; then
            print_success "Nginx is healthy"
            break
        else
            print_warning "Nginx health check failed"
        fi
        
        if [ $attempt -eq $max_attempts ]; then
            print_error "Health checks failed after $max_attempts attempts"
            rollback
            exit 1
        fi
        
        sleep 10
        ((attempt++))
    done
}

# Function to rollback
rollback() {
    print_warning "Rolling back deployment..."
    
    cd "$PROJECT_ROOT"
    
    # Stop current deployment
    docker-compose -f docker-compose.prod.yml down
    
    # Restore from backup if available
    local latest_backup=$(ls -t "$BACKUP_DIR"/db-backup-*.sql 2>/dev/null | head -1)
    if [ -n "$latest_backup" ]; then
        print_status "Restoring database from backup..."
        docker-compose -f docker-compose.prod.yml up -d postgres
        sleep 10
        docker exec -i admitai-postgres psql -U admitai_user admitai_korea < "$latest_backup"
    fi
    
    # Start previous version
    docker-compose -f docker-compose.prod.yml up -d
    
    print_success "Rollback completed"
}

# Function to cleanup old backups
cleanup_backups() {
    print_status "Cleaning up old backups..."
    
    # Keep only last 5 backups
    find "$BACKUP_DIR" -name "*.sql" -mtime +7 -delete
    find "$BACKUP_DIR" -name "*.tar.gz" -mtime +7 -delete
    
    print_success "Backup cleanup completed"
}

# Function to show deployment status
show_status() {
    print_status "Deployment Status:"
    echo ""
    
    # Show running containers
    docker-compose -f docker-compose.prod.yml ps
    
    echo ""
    
    # Show service URLs
    print_status "Service URLs:"
    echo "  Frontend: http://localhost"
    echo "  Backend API: http://localhost:5000"
    echo "  Health Check: http://localhost/health"
    
    if docker-compose -f docker-compose.prod.yml ps | grep -q "prometheus"; then
        echo "  Prometheus: http://localhost:9090"
    fi
    
    if docker-compose -f docker-compose.prod.yml ps | grep -q "grafana"; then
        echo "  Grafana: http://localhost:3001"
    fi
}

# Function to show help
show_help() {
    echo "AdmitAI Korea - Production Deployment"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  deploy        Deploy to production"
    echo "  rollback      Rollback to previous version"
    echo "  status        Show deployment status"
    echo "  backup        Create backup only"
    echo "  test          Run tests only"
    echo "  build         Build images only"
    echo "  cleanup       Cleanup old backups"
    echo "  help          Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 deploy     # Full deployment"
    echo "  $0 status     # Check deployment status"
    echo "  $0 rollback   # Rollback deployment"
}

# Main script logic
case "${1:-deploy}" in
    "deploy")
        # Load environment variables
        if [ -f "$PROJECT_ROOT/.env" ]; then
            export $(cat "$PROJECT_ROOT/.env" | grep -v '^#' | xargs)
        fi
        
        check_prerequisites
        create_backup
        run_tests
        build_images
        deploy
        cleanup_backups
        show_status
        ;;
    "rollback")
        rollback
        show_status
        ;;
    "status")
        show_status
        ;;
    "backup")
        create_backup
        ;;
    "test")
        run_tests
        ;;
    "build")
        build_images
        ;;
    "cleanup")
        cleanup_backups
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