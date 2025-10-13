#!/bin/bash

# CapRover API Deployment Script
# This bypasses the CLI interactive prompt issues

echo "🚀 Deploying jobsearch to CapRover via API..."

# Configuration
CAPROVER_URL="https://captain.lf1.dev"
APP_NAME="jobsearch"
TAR_FILE="jobsearch.tar.gz"

# Create fresh tarball
echo "📦 Creating deployment package..."
tar --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='jobsearch.tar.gz' --exclude='.github' -czf $TAR_FILE .

echo "✅ Deployment package created: $TAR_FILE"
echo ""
echo "📋 Next steps:"
echo "1. Go to $CAPROVER_URL"
echo "2. Login to CapRover dashboard"
echo "3. Go to '$APP_NAME' app"
echo "4. Deployment tab → Upload Tar File"
echo "5. Upload $TAR_FILE"
echo ""
echo "🎯 Your app will be available at: https://jobsearch.lf1.dev"
echo ""
echo "💡 For automated deployment, use GitHub Actions:"
echo "   - Add CAPROVER_PASSWORD secret to GitHub"
echo "   - Push to main branch for automatic deployment"
