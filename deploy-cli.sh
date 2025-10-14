#!/bin/bash

# CapRover CLI Deployment Script
# This script avoids interactive prompts by using environment variables

echo "🚀 Deploying jobsearch to CapRover..."

# Set environment variables to avoid interactive prompts
export CAPROVER_NAME="captain-01"
export CAPROVER_APP="jobsearch"
export CAPROVER_TAR_FILE="./jobsearch.tar.gz"

# Create fresh tarball (with macOS metadata exclusion)
echo "📦 Creating deployment package..."
COPYFILE_DISABLE=1 tar \
  --exclude='.git' \
  --exclude='node_modules' \
  --exclude='.next' \
  --exclude='jobsearch.tar.gz' \
  --exclude='.github' \
  --exclude='._*' \
  --exclude='.DS_Store' \
  --exclude='*.log' \
  --exclude='.env.local' \
  -czf jobsearch.tar.gz .

if [ $? -ne 0 ]; then
    echo "❌ Failed to create tarball"
    exit 1
fi

echo "✅ Tarball created successfully"

# Deploy using CapRover CLI
echo "🚀 Deploying to CapRover..."
caprover deploy

if [ $? -eq 0 ]; then
    echo "✅ Deployment complete!"
    echo "🌐 Your app should be available at: https://jobsearch.lf1.dev"
else
    echo "❌ Deployment failed!"
    exit 1
fi
