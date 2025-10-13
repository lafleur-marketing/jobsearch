#!/bin/bash

# Non-interactive CapRover deployment script
# This script tries to avoid the interactive prompt issues

echo "🚀 Deploying jobsearch to CapRover (non-interactive)..."

# Create fresh tarball
echo "📦 Creating deployment package..."
tar --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='jobsearch.tar.gz' --exclude='.github' -czf jobsearch.tar.gz .

# Try different approaches to avoid interactive prompts
echo "🔄 Attempting deployment..."

# Method 1: Try with all parameters specified
echo "Method 1: Direct parameters..."
caprover deploy -n captain-01 -a jobsearch -t jobsearch.tar.gz 2>/dev/null && echo "✅ Success!" && exit 0

# Method 2: Try with environment variables
echo "Method 2: Environment variables..."
CAPROVER_NAME=captain-01 CAPROVER_APP=jobsearch CAPROVER_TAR_FILE=jobsearch.tar.gz caprover deploy 2>/dev/null && echo "✅ Success!" && exit 0

# Method 3: Try with config file
echo "Method 3: Config file..."
caprover deploy -c caprover-config.json 2>/dev/null && echo "✅ Success!" && exit 0

# Method 4: Try default flag
echo "Method 4: Default flag..."
caprover deploy --default 2>/dev/null && echo "✅ Success!" && exit 0

# If all methods fail, provide manual instructions
echo ""
echo "❌ CLI deployment failed due to interactive prompt issues."
echo ""
echo "📋 Manual deployment options:"
echo "1. Upload jobsearch.tar.gz to CapRover dashboard:"
echo "   - Go to https://captain.lf1.dev/"
echo "   - Login → jobsearch app → Deployment → Upload Tar File"
echo ""
echo "2. Use GitHub Actions (recommended):"
echo "   - Add CAPROVER_PASSWORD secret to GitHub"
echo "   - Push to main branch for automatic deployment"
echo ""
echo "3. Try CLI in Terminal.app (not integrated terminal):"
echo "   - Open Terminal.app"
echo "   - cd to this directory"
echo "   - Run: caprover deploy --default"
echo ""
echo "📁 Deployment package ready: jobsearch.tar.gz"
