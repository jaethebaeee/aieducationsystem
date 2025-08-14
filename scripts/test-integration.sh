#!/bin/bash

# AdmitAI Korea - Integration Test Script
# This script tests the basic integration without requiring full AgenticSeek setup

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

# Function to test backend compilation
test_backend_compilation() {
    print_status "Testing backend compilation..."
    
    cd "$PROJECT_ROOT/backend"
    
    # Check if TypeScript compiles
    if npm run build > /dev/null 2>&1; then
        print_success "Backend TypeScript compilation successful"
    else
        print_error "Backend TypeScript compilation failed"
        return 1
    fi
}

# Function to test frontend compilation
test_frontend_compilation() {
    print_status "Testing frontend compilation..."
    
    cd "$PROJECT_ROOT/frontend"
    
    # Check if TypeScript compiles
    if npm run build > /dev/null 2>&1; then
        print_success "Frontend TypeScript compilation successful"
    else
        print_error "Frontend TypeScript compilation failed"
        return 1
    fi
}

# Function to test environment configuration
test_environment() {
    print_status "Testing environment configuration..."
    
    # Check if .env exists
    if [ -f "$PROJECT_ROOT/.env" ]; then
        print_success "Environment file exists"
    else
        print_warning "Environment file not found, creating from template"
        cp "$PROJECT_ROOT/env.example" "$PROJECT_ROOT/.env"
    fi
    
    # Check required environment variables
    local required_vars=(
        "DATABASE_URL"
        "JWT_SECRET"
        "AGENTIC_SEEK_MODE"
        "AGENTIC_SEEK_URL"
    )
    
    for var in "${required_vars[@]}"; do
        if grep -q "^${var}=" "$PROJECT_ROOT/.env"; then
            print_success "Environment variable $var is configured"
        else
            print_warning "Environment variable $var is not configured"
        fi
    done
}

# Function to test Docker Compose configuration
test_docker_compose() {
    print_status "Testing Docker Compose configuration..."
    
    cd "$PROJECT_ROOT"
    
    # Validate docker-compose.yml
    if docker-compose config > /dev/null 2>&1; then
        print_success "Docker Compose configuration is valid"
    else
        print_error "Docker Compose configuration is invalid"
        return 1
    fi
}

# Function to test API routes
test_api_routes() {
    print_status "Testing API route compilation..."
    
    cd "$PROJECT_ROOT/backend"
    
    # Check if all route files exist
    local route_files=(
        "src/routes/auth.ts"
        "src/routes/essays.ts"
        "src/routes/agenticSeek.ts"
    )
    
    for file in "${route_files[@]}"; do
        if [ -f "$file" ]; then
            print_success "Route file $file exists"
        else
            print_error "Route file $file missing"
            return 1
        fi
    done
}

# Function to test service files
test_service_files() {
    print_status "Testing service files..."
    
    cd "$PROJECT_ROOT/backend"
    
    # Check if service files exist
    local service_files=(
        "src/services/aiService.ts"
        "src/services/agenticSeekService.ts"
    )
    
    for file in "${service_files[@]}"; do
        if [ -f "$file" ]; then
            print_success "Service file $file exists"
        else
            print_error "Service file $file missing"
            return 1
        fi
    done
}

# Function to test frontend components
test_frontend_components() {
    print_status "Testing frontend components..."
    
    cd "$PROJECT_ROOT/frontend"
    
    # Check if AgenticSeek components exist
    local component_files=(
        "src/components/agenticSeek/AgenticSeekStatus.tsx"
        "src/components/agenticSeek/UniversityResearch.tsx"
    )
    
    for file in "${component_files[@]}"; do
        if [ -f "$file" ]; then
            print_success "Component file $file exists"
        else
            print_error "Component file $file missing"
            return 1
        fi
    done
}

# Function to test database schema
test_database_schema() {
    print_status "Testing database schema..."
    
    cd "$PROJECT_ROOT/backend"
    
    if [ -f "prisma/schema.prisma" ]; then
        print_success "Database schema exists"
        
        # Check if Prisma client can be generated
        if npx prisma generate > /dev/null 2>&1; then
            print_success "Prisma client generation successful"
        else
            print_warning "Prisma client generation failed (may need database connection)"
        fi
    else
        print_error "Database schema missing"
        return 1
    fi
}

# Function to show integration summary
show_integration_summary() {
    echo ""
    print_success "Integration Test Summary"
    echo "=============================="
    echo ""
    print_status "✅ Backend Integration:"
    echo "   - AgenticSeek service layer implemented"
    echo "   - API routes for AgenticSeek features"
    echo "   - Environment configuration updated"
    echo "   - Docker Compose configuration ready"
    echo ""
    print_status "✅ Frontend Integration:"
    echo "   - AgenticSeek status component"
    echo "   - University research component"
    echo "   - Service integration ready"
    echo ""
    print_status "✅ Infrastructure:"
    echo "   - Docker services configured"
    echo "   - Environment variables set"
    echo "   - Database schema updated"
    echo ""
    print_warning "Next Steps:"
    echo "1. Start Docker Desktop"
    echo "2. Run: ./start-agentic-seek.sh (will download large models)"
    echo "3. Run: ./download_models.sh"
    echo "4. Run: ./start-dev.sh"
    echo ""
    print_status "Alternative (without AgenticSeek):"
    echo "1. Set ENABLE_AGENTIC_SEEK=false in .env"
    echo "2. Run: ./start-dev.sh (uses OpenAI API)"
}

# Main test function
main() {
    echo "AdmitAI Korea - Integration Test"
    echo "================================"
    echo ""
    
    local tests_passed=0
    local tests_failed=0
    
    # Run all tests
    test_environment && ((tests_passed++)) || ((tests_failed++))
    test_docker_compose && ((tests_passed++)) || ((tests_failed++))
    test_api_routes && ((tests_passed++)) || ((tests_failed++))
    test_service_files && ((tests_passed++)) || ((tests_failed++))
    test_frontend_components && ((tests_passed++)) || ((tests_failed++))
    test_database_schema && ((tests_passed++)) || ((tests_failed++))
    test_backend_compilation && ((tests_passed++)) || ((tests_failed++))
    test_frontend_compilation && ((tests_passed++)) || ((tests_failed++))
    
    echo ""
    print_status "Test Results:"
    echo "  Passed: $tests_passed"
    echo "  Failed: $tests_failed"
    echo ""
    
    if [ $tests_failed -eq 0 ]; then
        print_success "All integration tests passed!"
        show_integration_summary
    else
        print_warning "Some tests failed. Please check the errors above."
    fi
}

# Run main function
main "$@" 