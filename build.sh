#!/bin/bash

# Build script for Vercel deployment
# This script handles the rollup optional dependency issue

echo "🚀 Starting build process..."

# Install dependencies with specific flags to avoid rollup issues
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps --no-optional

# Build the project
echo "🏗️ Building project..."
npm run build

echo "✅ Build completed successfully!" 