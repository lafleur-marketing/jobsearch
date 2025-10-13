#!/bin/bash

# CapRover Deployment Script for jobsearch.lf1.dev

echo "🚀 Preparing deployment for jobsearch.lf1.dev"

# Create deployment package
echo "📦 Creating deployment package..."
tar --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='jobsearch.tar.gz' -czf jobsearch.tar.gz .

echo "✅ Deployment package created: jobsearch.tar.gz"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://captain.lf1.dev/"
echo "2. Login to CapRover dashboard"
echo "3. Create app 'jobsearch' if it doesn't exist"
echo "4. Go to Deployment tab → Upload Tar File"
echo "5. Upload jobsearch.tar.gz"
echo "6. Set environment variables in App Configs:"
echo "   - NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=your_workflow_id"
echo "   - OPENAI_API_KEY=your_openai_key"
echo "   - CHATKIT_API_BASE=https://api.openai.com"
echo "   - NEXT_PUBLIC_CLERKER_PUBLISHABLE_KEY=your_clerk_publishable_key"
echo "   - CLERK_SECRET_KEY=your_clerk_secret_key"
echo "   - NODE_ENV=production"
echo "7. Configure domain jobsearch.lf1.dev in HTTP Settings"
echo ""
echo "🎯 Your app will be available at: https://jobsearch.lf1.dev"
