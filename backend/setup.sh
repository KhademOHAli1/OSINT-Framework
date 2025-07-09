#!/bin/bash

# OSINT Framework Backend Setup Script
# This script sets up the KeystoneJS backend with PostgreSQL

set -e

echo "🚀 OSINT Framework Backend Setup"
echo "================================="

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

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'.' -f1 | sed 's/v//')
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node --version)"
    exit 1
fi

print_success "Node.js $(node --version) found"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    print_warning "PostgreSQL not found. Please install PostgreSQL 15+ or use Docker."
    read -p "Continue with Docker setup? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
    USE_DOCKER=true
else
    print_success "PostgreSQL found"
    USE_DOCKER=false
fi

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating .env file..."
    cp .env.example .env
    
    # Generate session secret
    SESSION_SECRET=$(openssl rand -base64 32)
    sed -i.bak "s/your-super-secret-session-key-change-this-in-production/$SESSION_SECRET/" .env
    rm .env.bak
    
    print_success ".env file created with generated session secret"
else
    print_warning ".env file already exists"
fi

# Install dependencies
print_status "Installing dependencies..."
npm install
print_success "Dependencies installed"

if [ "$USE_DOCKER" = true ]; then
    # Docker setup
    print_status "Setting up with Docker..."
    
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    
    # Start PostgreSQL with Docker
    print_status "Starting PostgreSQL with Docker..."
    docker-compose up -d postgres
    
    # Wait for PostgreSQL to be ready
    print_status "Waiting for PostgreSQL to be ready..."
    sleep 10
    
    # Update .env for Docker
    sed -i.bak 's|DATABASE_URL="postgresql://username:password@localhost:5432/osint_framework"|DATABASE_URL="postgresql://postgres:postgres@localhost:5432/osint_framework"|' .env
    rm .env.bak
    
else
    # Local PostgreSQL setup
    print_status "Setting up local PostgreSQL database..."
    
    # Ask for database credentials
    read -p "PostgreSQL username (default: postgres): " DB_USER
    DB_USER=${DB_USER:-postgres}
    
    read -s -p "PostgreSQL password: " DB_PASS
    echo
    
    read -p "Database name (default: osint_framework): " DB_NAME
    DB_NAME=${DB_NAME:-osint_framework}
    
    # Update .env file
    sed -i.bak "s|DATABASE_URL=\"postgresql://username:password@localhost:5432/osint_framework\"|DATABASE_URL=\"postgresql://$DB_USER:$DB_PASS@localhost:5432/$DB_NAME\"|" .env
    rm .env.bak
    
    # Create database if it doesn't exist
    print_status "Creating database..."
    PGPASSWORD=$DB_PASS createdb -h localhost -U $DB_USER $DB_NAME 2>/dev/null || print_warning "Database might already exist"
fi

# Generate Prisma client
print_status "Generating Prisma client..."
npx prisma generate
print_success "Prisma client generated"

# Run database migrations
print_status "Running database migrations..."
npm run migrate
print_success "Database migrations completed"

# Seed database
print_status "Seeding database with sample data..."
npm run seed
print_success "Database seeded successfully"

# Final instructions
echo
echo "🎉 Setup completed successfully!"
echo "================================="
echo
echo "Next steps:"
echo "1. Start the development server:"
echo "   npm run dev"
echo
echo "2. Access the admin panel:"
echo "   http://localhost:4000"
echo
echo "3. Default admin credentials:"
echo "   Email: admin@osintframework.com"
echo "   Password: admin123"
echo
echo "4. GraphQL Playground:"
echo "   http://localhost:4000/api/graphql"
echo
echo "5. For production deployment:"
echo "   - Change the default admin password"
echo "   - Update SESSION_SECRET in .env"
echo "   - Configure proper CORS origins"
echo
if [ "$USE_DOCKER" = true ]; then
    echo "Docker services started:"
    echo "- PostgreSQL: localhost:5432"
    echo "- Redis: localhost:6379"
    echo
    echo "To stop Docker services:"
    echo "  docker-compose down"
fi

print_success "Backend setup complete! 🚀"
