# Docker Deployment Guide for Hetzner Server

## Option 1: Build on Server (Recommended)

### 1. Connect to your Hetzner server:
```bash
ssh root@5.161.102.171
```

### 2. Clone your repository:
```bash
git clone https://github.com/yourusername/jobsearch.git
cd jobsearch
```

### 3. Build Docker image:
```bash
docker build -t jobsearch-app .
```

### 4. Tag for CapRover registry:
```bash
docker tag jobsearch-app captain.lf1.dev:5000/jobsearch:latest
```

### 5. Push to CapRover registry:
```bash
docker push captain.lf1.dev:5000/jobsearch:latest
```

### 6. Deploy via CapRover CLI:
```bash
caprover deploy -n captain-01 -a jobsearch -i captain.lf1.dev:5000/jobsearch:latest
```

## Option 2: Use Web Dashboard

### 1. Go to CapRover Dashboard:
- Visit: https://captain.lf1.dev/
- Login with your credentials

### 2. Create App:
- Click "Apps" → "Create New App"
- Name: `jobsearch`
- Click "Create New App"

### 3. Deploy:
- Go to "Deployment" tab
- Select "Upload Tar File"
- Upload `jobsearch.tar.gz` (already created)

### 4. Configure Environment Variables:
Go to "App Configs" → "Environment Variables" and add:
```
NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=your_workflow_id
OPENAI_API_KEY=your_openai_key
CHATKIT_API_BASE=https://api.openai.com
NEXT_PUBLIC_CLERKER_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NODE_ENV=production
```

### 5. Configure Domain:
- Go to "HTTP Settings" tab
- Enable HTTPS
- Add domain: `jobsearch.lf1.dev`

## Environment Variables Needed

Make sure to replace these with your actual values:
- `your_workflow_id` - Your ChatKit workflow ID
- `your_openai_key` - Your OpenAI API key
- `your_clerk_publishable_key` - Your Clerk publishable key
- `your_clerk_secret_key` - Your Clerk secret key

## DNS Configuration

Make sure your DNS is configured:
- `jobsearch.lf1.dev` → `5.161.102.171`
- `captain.lf1.dev` → `5.161.102.171`
