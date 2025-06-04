#!/bin/bash

# CorestoneGrader Deployment Script
# This script automates the deployment process for any hosting provider

set -e

echo "🚀 Starting CorestoneGrader deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if .env file exists
if [ ! -f .env ]; then
    print_warning ".env file not found. Copying from .env.example..."
    cp .env.example .env
    print_error "Please edit .env file with your configuration before continuing."
    exit 1
fi

# Check if required environment variables are set
print_status "Checking environment variables..."
source .env

if [ -z "$DATABASE_URL" ]; then
    print_error "DATABASE_URL is not set in .env file"
    exit 1
fi

if [ -z "$OPENAI_API_KEY" ]; then
    print_error "OPENAI_API_KEY is not set in .env file"
    exit 1
fi

if [ -z "$SESSION_SECRET" ]; then
    print_error "SESSION_SECRET is not set in .env file"
    exit 1
fi

print_status "Environment variables validated ✓"

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Build the application
print_status "Building application..."
npm run build

# Run database migrations
print_status "Running database migrations..."
npm run db:push

# Create uploads directory
print_status "Creating uploads directory..."
mkdir -p uploads
chmod 755 uploads

# Create SSL directory for certificates
print_status "Creating SSL directory..."
mkdir -p ssl

# Generate self-signed certificates if none exist
if [ ! -f ssl/cert.pem ] || [ ! -f ssl/key.pem ]; then
    print_warning "SSL certificates not found. Generating self-signed certificates..."
    openssl req -x509 -newkey rsa:4096 -keyout ssl/key.pem -out ssl/cert.pem -days 365 -nodes \
        -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
    print_warning "Self-signed certificates generated. Replace with proper SSL certificates for production."
fi

# Set proper permissions
print_status "Setting file permissions..."
chmod 600 ssl/key.pem
chmod 644 ssl/cert.pem

print_status "Deployment completed successfully! 🎉"
print_status ""
print_status "Next steps:"
print_status "1. Start the application: npm start"
print_status "2. Or use Docker: docker-compose up -d"
print_status ""
print_status "Application will be available at:"
print_status "- HTTP: http://localhost:5000"
print_status "- HTTPS: https://localhost (if using nginx)"