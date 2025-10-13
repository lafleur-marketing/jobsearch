#!/bin/bash

# CapRover CLI Deployment Script for Terminal.app
# This script works when run in Terminal.app (not integrated terminal)

echo "🚀 Deploying jobsearch to CapRover via CLI..."

# Create fresh tarball
echo "📦 Creating deployment package..."
tar --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='jobsearch.tar.gz' --exclude='.github' -czf jobsearch.tar.gz .

# Deploy using CLI
echo "🚀 Deploying to CapRover..."
caprover deploy --default

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: https://jobsearch.lf1.dev"
