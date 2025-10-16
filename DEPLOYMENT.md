# Cloud Deployment Guide

This guide provides step-by-step instructions for deploying Auto Appendix to three popular cloud platforms.

## Prerequisites

1. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
2. Docker installed locally (for testing)

---

## Option 1: Railway (Recommended - Easiest)

Railway offers a generous free tier and automatic deployments from GitHub.

### Steps:

1. **Sign up for Railway**
   - Go to https://railway.app
   - Sign up with your GitHub account

2. **Create a New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Authorize Railway to access your GitHub
   - Select your `auto-appendix` repository

3. **Configure Deployment**
   - Railway will automatically detect your `Dockerfile`
   - It will use the `railway.toml` configuration
   - Click "Deploy"

4. **Get Your URL**
   - Once deployed, go to "Settings" → "Domains"
   - Click "Generate Domain"
   - Your app will be available at: `https://your-app.up.railway.app`

### Estimated Time: 5 minutes
### Cost: Free tier (500 hours/month, $5 credit)

---

## Option 2: Render

Render provides free hosting with auto-deploys from GitHub.

### Steps:

1. **Sign up for Render**
   - Go to https://render.com
   - Sign up with your GitHub account

2. **Create a New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select your `auto-appendix` repository

3. **Configure the Service**
   - Name: `auto-appendix`
   - Environment: `Docker`
   - Plan: `Free`
   - Render will detect your `Dockerfile` automatically

4. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy your app
   - Your app will be at: `https://auto-appendix.onrender.com`

### Notes:
- Free tier apps spin down after 15 minutes of inactivity
- First request after idle takes ~30 seconds to wake up

### Estimated Time: 5 minutes
### Cost: Free tier available

---

## Option 3: Google Cloud Run

Google Cloud Run offers pay-per-use pricing and excellent performance.

### Steps:

1. **Install Google Cloud CLI**
   ```bash
   # Install gcloud CLI
   curl https://sdk.cloud.google.com | bash
   exec -l $SHELL
   gcloud init
   ```

2. **Create a Google Cloud Project**
   ```bash
   # Login to Google Cloud
   gcloud auth login
   
   # Create a new project (or use existing)
   gcloud projects create auto-appendix-prod --name="Auto Appendix"
   
   # Set the project
   gcloud config set project auto-appendix-prod
   
   # Enable required APIs
   gcloud services enable run.googleapis.com
   gcloud services enable containerregistry.googleapis.com
   ```

3. **Build and Push Docker Image**
   ```bash
   # Set your project ID
   export PROJECT_ID=auto-appendix-prod
   
   # Build the image
   gcloud builds submit --tag gcr.io/$PROJECT_ID/auto-appendix
   ```

4. **Deploy to Cloud Run**
   ```bash
   # Deploy the service
   gcloud run deploy auto-appendix \
     --image gcr.io/$PROJECT_ID/auto-appendix \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --port 8000 \
     --memory 1Gi \
     --cpu 1 \
     --max-instances 10
   ```

5. **Get Your URL**
   - After deployment, you'll receive a URL like:
   - `https://auto-appendix-xxxxx-uc.a.run.app`

### Estimated Time: 10-15 minutes
### Cost: Pay-per-use (~$0.00002400 per request, very cheap for low traffic)

---

## Option 4: Heroku (Alternative)

### Quick Deploy:

1. **Install Heroku CLI**
   ```bash
   curl https://cli-assets.heroku.com/install.sh | sh
   heroku login
   ```

2. **Create and Deploy**
   ```bash
   # Create app
   heroku create auto-appendix-app
   
   # Set stack to container
   heroku stack:set container
   
   # Deploy
   git push heroku main
   
   # Open app
   heroku open
   ```

### Cost: Free tier discontinued, starts at $7/month

---

## Testing Your Deployment

Once deployed, test your application:

```bash
# Replace YOUR_URL with your actual deployment URL
curl https://YOUR_URL/health

# Should return:
# {"status":"healthy","service":"appendix-creator"}
```

---

## Continuous Deployment

All platforms support automatic deployments:

- **Railway & Render**: Automatically deploy on every push to main branch
- **Google Cloud Run**: Set up Cloud Build triggers for automatic deployment
- **Heroku**: Automatic with GitHub integration

---

## Environment Variables (If Needed)

If you need to set environment variables:

- **Railway**: Settings → Variables
- **Render**: Environment → Environment Variables
- **Google Cloud Run**: `--set-env-vars` flag or Console UI
- **Heroku**: `heroku config:set KEY=value`

---

## Monitoring and Logs

### Railway:
- Click on your service → "Logs" tab

### Render:
- Click on your service → "Logs" tab

### Google Cloud Run:
```bash
gcloud run services logs read auto-appendix --region us-central1
```

### Heroku:
```bash
heroku logs --tail
```

---

## Troubleshooting

### App won't start:
1. Check logs on your platform
2. Verify Dockerfile builds locally: `docker build -t auto-appendix .`
3. Test locally: `docker run -p 8000:8000 auto-appendix`

### Health check failing:
- Ensure `/health` endpoint is accessible
- Check port configuration (should be 8000)

### Out of memory:
- Increase memory allocation in platform settings
- Railway: Automatically scales
- Render: Upgrade plan
- Cloud Run: Add `--memory 2Gi` flag

---

## Recommended Platform Based on Needs

- **Best for beginners**: Railway (easiest setup)
- **Best for free hosting**: Render (true free tier, no credit card)
- **Best for production**: Google Cloud Run (scalable, reliable)
- **Best for startups**: Railway (good free tier, easy scaling)

---

## Next Steps

After deployment:

1. ✅ Test your application thoroughly
2. ✅ Set up a custom domain (optional)
3. ✅ Configure monitoring and alerts
4. ✅ Set up automatic backups if needed
5. ✅ Add SSL certificate (automatic on all platforms)

---

## Support

For platform-specific issues:
- Railway: https://railway.app/discord
- Render: https://render.com/docs
- Google Cloud: https://cloud.google.com/run/docs
- Heroku: https://devcenter.heroku.com

Good luck with your deployment! 🚀
