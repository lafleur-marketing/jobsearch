# GitHub Actions Deployment Setup

## ✅ What's Done
- GitHub Actions workflow created (`.github/workflows/deploy.yml`)
- Code pushed to GitHub
- CapRover configuration files ready

## 🔧 Next Steps

### 1. Get CapRover App Token
1. Go to https://captain.lf1.dev/
2. Login to CapRover dashboard
3. Create app `jobsearch` if it doesn't exist
4. Go to Deployment tab → Copy the App Token

### 2. Add GitHub Secret
1. Go to your GitHub repo: https://github.com/lafleur-marketing/jobsearch
2. Click Settings → Secrets and variables → Actions
3. Add new secret:
   - Name: `CAPROVER_APP_TOKEN`
   - Value: `your_app_token_from_caprover`

### 3. Set Environment Variables in CapRover
In CapRover dashboard for `jobsearch` app:
- Go to "App Configs" → "Environment Variables"
- Add these variables:
  ```
  NEXT_PUBLIC_CHATKIT_WORKFLOW_ID=your_workflow_id
  OPENAI_API_KEY=your_openai_key
  CHATKIT_API_BASE=https://api.openai.com
  NEXT_PUBLIC_CLERKER_PUBLISHABLE_KEY=your_clerk_publishable_key
  CLERK_SECRET_KEY=your_clerk_secret_key
  NODE_ENV=production
  ```

### 4. Configure Domain
- Go to "HTTP Settings" tab
- Enable HTTPS
- Add domain: `jobsearch.lf1.dev`

### 5. Trigger Deployment
Once you've added the GitHub secret, the deployment will automatically trigger on the next push, or you can manually trigger it:
1. Go to GitHub repo → Actions tab
2. Click "Deploy to CapRover"
3. Click "Run workflow"

## 🎯 Result
Your app will be available at: https://jobsearch.lf1.dev

## 🔄 Future Deployments
Every time you push to the `main` branch, GitHub Actions will automatically deploy to CapRover!
