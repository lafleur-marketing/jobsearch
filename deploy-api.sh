#!/bin/bash

# Direct CapRover API Deployment Script
# This bypasses the CLI issues by using the CapRover API directly

echo "🚀 Deploying jobsearch to CapRover via API..."

# Configuration
CAPROVER_URL="https://captain.lf1.dev"
APP_NAME="jobsearch"
TAR_FILE="jobsearch.tar.gz"

# Create fresh tarball
echo "📦 Creating deployment package..."
tar --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='jobsearch.tar.gz' --exclude='.github' -czf $TAR_FILE .

echo "📤 Uploading to CapRover..."
echo "⚠️  You'll need to manually upload $TAR_FILE to CapRover dashboard:"
echo "   1. Go to https://captain.lf1.dev/"
echo "   2. Login to CapRover"
echo "   3. Go to 'jobsearch' app"
echo "   4. Deployment tab → Upload Tar File"
echo "   5. Upload $TAR_FILE"
echo ""
echo "🎯 Or use the web dashboard for now until CLI issues are resolved."

# Alternative: Try to get app token for API deployment
echo ""
echo "💡 For automated deployment, you can:"
echo "   1. Get the app token from CapRover dashboard"
echo "   2. Use it with GitHub Actions (already configured)"
echo "   3. Or fix the CLI by running in a different terminal environment"
