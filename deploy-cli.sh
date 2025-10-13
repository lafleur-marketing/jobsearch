#!/bin/bash

# CapRover CLI Deployment Script
# This script avoids interactive prompts by using environment variables

echo "🚀 Deploying jobsearch to CapRover..."

# Set environment variables to avoid interactive prompts
export CAPROVER_NAME="captain-01"
export CAPROVER_APP="jobsearch"
export CAPROVER_TAR_FILE="./jobsearch.tar.gz"

# Create fresh tarball
echo "📦 Creating deployment package..."
tar --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='jobsearch.tar.gz' --exclude='.github' -czf jobsearch.tar.gz .

# Deploy using environment variables
echo "🚀 Deploying to CapRover..."
caprover deploy

echo "✅ Deployment complete!"
echo "🌐 Your app should be available at: https://jobsearch.lf1.dev"
