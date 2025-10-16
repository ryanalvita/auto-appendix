# Cloud Deployment Guide

This guide provides step-by-step instructions for deploying Auto Appendix to cloud platforms.

## Prerequisites

1. Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
2. Docker installed locally (for testing)

---

## Option 1: Render (Recommended - Free & Easy)

Render provides free hosting with auto-deploys from GitHub.

### Step 1: Push Your Code to GitHub

First, make sure your code is in a GitHub repository:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Prepare for deployment"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/auto-appendix.git

# Push to GitHub
git push -u origin main
```

### Step 2: Sign Up for Render

1. Go to https://render.com
2. Click "Get Started for Free"
3. Sign up with your GitHub account
4. Authorize Render to access your GitHub repositories

### Step 3: Create a New Web Service

1. From your Render dashboard, click the **"New +"** button in the top right
2. Select **"Web Service"**
3. You'll see a list of your GitHub repositories
4. Find and click **"Connect"** next to your `auto-appendix` repository
   - If you don't see your repository, click "Configure account" to grant access

### Step 4: Configure the Web Service

On the configuration page, set the following:

- **Name**: `auto-appendix` (or any name you prefer)
- **Region**: Choose the closest to your users (e.g., Oregon USA, Frankfurt EU)
- **Branch**: `main` (or your default branch name)
- **Root Directory**: Leave empty
- **Environment**: Select **Docker**
- **Plan**: Select **Free**

Render will automatically detect your `Dockerfile` and use it for deployment.

### Step 5: Advanced Settings (Optional)

Click on **"Advanced"** to configure additional settings:

- **Health Check Path**: Set to `/health`
- **Auto-Deploy**: Should be enabled by default (deploys on every push)

### Step 6: Deploy

1. Click **"Create Web Service"** at the bottom
2. Render will start building your Docker image
3. Wait for the build to complete (usually 2-5 minutes)
4. Watch the logs to see the progress

### Step 7: Access Your Application

Once deployed successfully:

1. You'll see "Live" status with a green indicator
2. Your app URL will be displayed at the top: `https://auto-appendix-xxxx.onrender.com`
3. Click on the URL to open your application
4. Test the health endpoint: `https://auto-appendix-xxxx.onrender.com/health`

### Important Notes About Free Tier:

- ⚠️ Free tier apps **spin down after 15 minutes of inactivity**
- ⏱️ First request after idle takes **~30-50 seconds** to wake up
- 💾 You get **750 hours per month** of free usage
- 🔄 Apps auto-deploy when you push to GitHub

### Step 8: Monitor Your Deployment

- **View Logs**: Click on your service → "Logs" tab
- **Metrics**: Click "Metrics" to see request counts and response times
- **Events**: See deployment history in "Events" tab

### Step 9: Set Up Custom Domain (Optional)

1. Go to your service → "Settings"
2. Scroll to "Custom Domain"
3. Click "Add Custom Domain"
4. Follow instructions to configure DNS

---

## Option 2: Google Cloud Run (Production-Ready)

Google Cloud Run offers pay-per-use pricing and excellent performance.

### Step 1: Install Google Cloud CLI

```bash
# Install gcloud CLI
curl https://sdk.cloud.google.com | bash

# Restart your shell
exec -l $SHELL

# Initialize gcloud
gcloud init
```

### Step 2: Set Up Google Cloud Project

```bash
# Login to Google Cloud
gcloud auth login

# Create a new project (or use existing)
gcloud projects create auto-appendix-prod --name="Auto Appendix"

# Set the project as active
gcloud config set project auto-appendix-prod

# Enable required APIs
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable containerregistry.googleapis.com
```

### Step 3: Build and Deploy

Navigate to your project directory and run:

```bash
# Deploy directly (Cloud Build will build the Docker image)
gcloud run deploy auto-appendix \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8000 \
  --memory 1Gi \
  --cpu 1 \
  --max-instances 10 \
  --min-instances 0
```

Alternatively, build and push manually:

```bash
# Set your project ID
export PROJECT_ID=auto-appendix-prod

# Build the image using Cloud Build
gcloud builds submit --tag gcr.io/$PROJECT_ID/auto-appendix

# Deploy to Cloud Run
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

### Step 4: Get Your URL

After deployment completes, you'll see output like:

```
Service [auto-appendix] revision [auto-appendix-00001-xxx] has been deployed and is serving 100 percent of traffic.
Service URL: https://auto-appendix-xxxxx-uc.a.run.app
```

### Step 5: Test Your Deployment

```bash
# Get the service URL
gcloud run services describe auto-appendix --region us-central1 --format 'value(status.url)'

# Test health endpoint
curl $(gcloud run services describe auto-appendix --region us-central1 --format 'value(status.url)')/health
```

### Step 6: Set Up Continuous Deployment (Optional)

Create a Cloud Build trigger for automatic deployments:

```bash
# Connect your GitHub repository
gcloud builds triggers create github \
  --repo-name=auto-appendix \
  --repo-owner=YOUR_GITHUB_USERNAME \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

### Cost Estimate:

- First 2 million requests per month: **FREE**
- After that: ~$0.40 per million requests
- Memory/CPU usage: ~$0.00002400 per request
- Very affordable for low to medium traffic

---

## Testing Your Deployment

Once deployed on either platform, test thoroughly:

```bash
# Health check
curl https://YOUR_URL/health

# Upload a test image
curl -X POST https://YOUR_URL/upload \
  -F "files=@test-image.jpg" \
  -F "output_format=pdf" \
  -F "paper_size=A4"
```

---

## Continuous Deployment

### Render:

- ✅ **Automatic** - Deploys on every push to main branch
- Configure in: Service Settings → Build & Deploy

### Google Cloud Run:

- Set up Cloud Build triggers (see Step 6 above)
- Or use GitHub Actions with Cloud Run deployment

---

## Environment Variables

If you need to set environment variables in the future:

### Render:

1. Go to your service
2. Click "Environment" in the left sidebar
3. Click "Add Environment Variable"
4. Enter key and value
5. Click "Save Changes" (triggers auto-redeploy)

### Google Cloud Run:

```bash
# Set environment variable
gcloud run services update auto-appendix \
  --update-env-vars KEY=value \
  --region us-central1
```

Or in the Google Cloud Console:

1. Go to Cloud Run
2. Select your service
3. Click "Edit & Deploy New Revision"
4. Add environment variables
5. Click "Deploy"

---

## Monitoring and Logs

### Render:

- **Logs**: Service → "Logs" tab (real-time streaming)
- **Metrics**: Service → "Metrics" tab
- **Events**: Service → "Events" tab (deployment history)

### Google Cloud Run:

```bash
# View recent logs
gcloud run services logs read auto-appendix --region us-central1

# Stream logs in real-time
gcloud run services logs tail auto-appendix --region us-central1
```

Or use Google Cloud Console:

1. Go to Cloud Run → Your Service
2. Click "Logs" tab
3. Use Cloud Logging for advanced filtering

---

## Troubleshooting

### App won't start:

1. **Check logs** on your platform
2. **Test Docker locally**:
   ```bash
   docker build -t auto-appendix .
   docker run -p 8000:8000 auto-appendix
   ```
3. **Visit** http://localhost:8000 to verify it works

### Health check failing:

- Ensure `/health` endpoint is accessible
- Check that port 8000 is exposed in Dockerfile
- Verify the health check path in platform settings

### Out of memory:

**Render:**

- Free tier has limited memory
- Upgrade to paid plan for more resources

**Google Cloud Run:**

```bash
# Increase memory allocation
gcloud run services update auto-appendix \
  --memory 2Gi \
  --region us-central1
```

### Render: App is slow to wake up

- This is normal on free tier after 15 minutes of inactivity
- Consider upgrading to paid tier for always-on service
- Or accept the 30-50 second cold start

---

## Platform Comparison

| Feature             | Render (Free)       | Google Cloud Run        |
| ------------------- | ------------------- | ----------------------- |
| **Cost**            | Free (750hrs/month) | Free tier + pay-per-use |
| **Cold Starts**     | Yes (~30-50s)       | Minimal (<5s)           |
| **Setup Time**      | 5 minutes           | 10-15 minutes           |
| **Scalability**     | Limited on free     | Excellent               |
| **Best For**        | Development, demos  | Production apps         |
| **Custom Domain**   | ✅ Yes              | ✅ Yes                  |
| **SSL Certificate** | ✅ Auto             | ✅ Auto                 |
| **Auto Deploy**     | ✅ Yes              | Manual/CI setup         |

---

## Recommended Workflow

1. **Start with Render** for development and testing (free tier)
2. **Move to Google Cloud Run** when you need:
   - Better performance
   - No cold starts
   - Higher traffic handling
   - Production-grade infrastructure

---

## Next Steps After Deployment

1. ✅ Test your application thoroughly
2. ✅ Set up a custom domain (optional)
3. ✅ Configure monitoring and alerts
4. ✅ Add your app URL to your GitHub README
5. ✅ Share with users!

---

## Support Resources

**Render:**

- Documentation: https://render.com/docs
- Community: https://community.render.com
- Status Page: https://status.render.com

**Google Cloud Run:**

- Documentation: https://cloud.google.com/run/docs
- Pricing Calculator: https://cloud.google.com/products/calculator
- Support: https://cloud.google.com/support

---

## Quick Reference Commands

### Render

```bash
# No CLI needed - everything is in the web dashboard!
```

### Google Cloud Run

```bash
# Deploy
gcloud run deploy auto-appendix --source .

# View logs
gcloud run services logs tail auto-appendix

# Update memory
gcloud run services update auto-appendix --memory 2Gi

# Delete service
gcloud run services delete auto-appendix
```

---

Good luck with your deployment! 🚀

**Need help?** Check the troubleshooting section or reach out to the platform's support.
