# Vercel Deployment Guide for jobsearch.lf1.ai

## 🚀 Quick Deployment Steps

### 1. Install Vercel CLI
```bash
pnpm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy from Project Directory
```bash
cd /Users/chiplafleur/GitHub/jobsearch
vercel --prod
```

## 🔧 Environment Variables Setup

Set these in Vercel Dashboard → Project Settings → Environment Variables:

### Required Variables:
```
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=your_workflow_id
OPENAI_API_KEY=your_openai_key
CHATKIT_API_BASE=https://api.openai.com
NEXT_PUBLIC_CLERKER_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NODE_ENV=production
```

## 🌐 Custom Domain Setup

### 1. Add Domain in Vercel Dashboard
- Go to Project Settings → Domains
- Add `jobsearch.lf1.ai`
- Follow DNS configuration instructions

### 2. DNS Configuration
Add these DNS records to your domain provider:
```
Type: CNAME
Name: jobsearch
Value: cname.vercel-dns.com
```

## ✅ Project Features Ready for Deployment

- ✅ **Modern UI/UX**: Job search focused design
- ✅ **Personalized AI**: "Hi Dren!" greeting and West Michigan focus
- ✅ **Job-focused prompts**: Resume help, interview prep, job search strategy
- ✅ **Professional branding**: Briefcase icons and career-focused messaging
- ✅ **Responsive design**: Works on all devices
- ✅ **Dark mode support**: Automatic theme switching
- ✅ **API optimization**: 60s timeout for ChatKit sessions

## 🎯 Expected Result

Your job search assistant will be live at:
**https://jobsearch.lf1.ai**

## 🔄 Future Updates

After initial deployment, you can update by running:
```bash
vercel --prod
```

Or set up GitHub integration for automatic deployments on push to main branch.
