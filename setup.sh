#!/bin/bash

# Setup script for Presentation AI

echo "Setting up Presentation AI..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d 'v' -f 2 | cut -d '.' -f 1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Create .env.local file if it doesn't exist
if [ ! -f .env.local ]; then
    echo "Creating .env.local file..."
    cp .env.example .env.local
    echo "Please edit .env.local to add your API keys and configuration."
fi

# Set up the database
echo "Setting up the database..."
npx prisma db push

echo "Setup complete!"
echo "You can now run the application with: npm run dev"
echo "To use Llama 4 locally with Pinokio:"
echo "1. Install Pinokio from https://pinokio.computer"
echo "2. Run: npm run pinokio:download"
echo "3. Run: npm run pinokio:start"
echo "4. Set USE_LOCAL_LLAMA4=true in your .env.local file"

