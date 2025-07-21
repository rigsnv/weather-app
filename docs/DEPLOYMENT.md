# Deployment Guide

This guide covers deploying the Weather App to various platforms and environments.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Process](#build-process)
- [Environment Configuration](#environment-configuration)
- [Platform-Specific Deployments](#platform-specific-deployments)
  - [Vercel](#vercel)
  - [Netlify](#netlify)
  - [Azure Static Web Apps](#azure-static-web-apps)
  - [GitHub Pages](#github-pages)
- [Backend Deployment](#backend-deployment)
- [CI/CD Setup](#cicd-setup)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- ✅ Met Office API key
- ✅ Production environment variables configured
- ✅ Backend API (optional, for production)
- ✅ Domain name (optional)

## Build Process

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create production environment file:

```bash
cp .env.example .env.production
```

Edit `.env.production`:

```bash
VITE_MET_OFFICE_API_KEY=your_production_api_key
VITE_DEV_API_BASE_URL=https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point/
VITE_PROD_API_BASE_URL=https://your-backend-api.com
```

### 3. Build Application

```bash
npm run build
```

This creates a `dist/` directory with optimized production files.

### 4. Test Build Locally

```bash
npm run preview
```

Visit `http://localhost:4173` to test the production build.

## Environment Configuration

### Development vs Production

| Environment | API Usage | Security | Performance |
|-------------|-----------|----------|-------------|
| Development | Direct Met Office API | API key exposed | Fast development |
| Production | Backend proxy | API key protected | Optimized build |

### Environment Variables

| Variable | Development | Production | Required |
|----------|-------------|------------|----------|
| `VITE_MET_OFFICE_API_KEY` | Your dev key | Your prod key | Yes |
| `VITE_DEV_API_BASE_URL` | Met Office URL | Met Office URL | Yes |
| `VITE_PROD_API_BASE_URL` | Not used | Your backend URL | No |

## Platform-Specific Deployments

### Vercel

#### Automatic Deployment (Recommended)

1. **Connect Repository**
   ```bash
   # Push to GitHub
   git push origin main
   ```

2. **Import to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import from GitHub
   - Select your repository

3. **Configure Build Settings**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variables**
   ```
   VITE_MET_OFFICE_API_KEY=your_key_here
   VITE_DEV_API_BASE_URL=https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point/
   VITE_PROD_API_BASE_URL=your_backend_url
   ```

5. **Deploy**
   - Click "Deploy"
   - Your app will be available at `https://your-app.vercel.app`

#### Manual Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify

#### Drag and Drop Deployment

1. **Build Application**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Drag `dist/` folder to deploy area
   - Configure environment variables in site settings

#### Git-Based Deployment

1. **Connect Repository**
   - Create new site from Git
   - Choose your GitHub repository

2. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   - Go to Site Settings > Environment Variables
   - Add your environment variables

4. **Deploy**
   - Push to main branch for automatic deployment

### Azure Static Web Apps

#### Using Azure CLI

1. **Install Azure CLI**
   ```bash
   # macOS
   brew install azure-cli
   
   # Windows
   winget install Microsoft.AzureCLI
   ```

2. **Login to Azure**
   ```bash
   az login
   ```

3. **Create Static Web App**
   ```bash
   az staticwebapp create \
     --name weather-app \
     --resource-group your-resource-group \
     --source https://github.com/your-username/weather-app \
     --location "Central US" \
     --branch main \
     --app-location "/" \
     --api-location "" \
     --output-location "dist"
   ```

#### Using GitHub Actions

1. **Create Workflow File**
   ```yaml
   # .github/workflows/azure-static-web-apps.yml
   name: Azure Static Web Apps CI/CD
   
   on:
     push:
       branches: [ main ]
     pull_request:
       types: [opened, synchronize, reopened, closed]
       branches: [ main ]
   
   jobs:
     build_and_deploy_job:
       runs-on: ubuntu-latest
       steps:
       - uses: actions/checkout@v3
         with:
           submodules: true
       - name: Build And Deploy
         uses: Azure/static-web-apps-deploy@v1
         with:
           azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
           repo_token: ${{ secrets.GITHUB_TOKEN }}
           action: "upload"
           app_location: "/"
           api_location: ""
           output_location: "dist"
   ```

2. **Configure Secrets**
   - Add `AZURE_STATIC_WEB_APPS_API_TOKEN` to GitHub secrets
   - Add environment variables to Azure portal

### GitHub Pages

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add Deploy Script**
   ```json
   // package.json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Configure Base URL**
   ```javascript
   // vite.config.js
   export default defineConfig({
     base: '/weather-app/',
     // ... other config
   })
   ```

4. **Deploy**
   ```bash
   npm run build
   npm run deploy
   ```

## Backend Deployment

For production use, deploy a backend to proxy Met Office API requests:

### Node.js/Express Backend

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());
app.use(express.json());

app.put('/weather', async (req, res) => {
  const { latitude, longitude } = req.body;
  
  try {
    const response = await fetch(
      `https://data.hub.api.metoffice.gov.uk/sitespecific/v0/point/hourly?latitude=${latitude}&longitude=${longitude}`,
      {
        headers: {
          'accept': 'application/json',
          'apikey': process.env.MET_OFFICE_API_KEY
        }
      }
    );
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Deploy Backend Options

- **Vercel**: Serverless functions
- **Netlify**: Netlify Functions
- **Azure**: Azure Functions
- **Railway**: Container deployment
- **Heroku**: Platform as a Service

## CI/CD Setup

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Build
      run: npm run build
      env:
        VITE_MET_OFFICE_API_KEY: ${{ secrets.VITE_MET_OFFICE_API_KEY }}
        VITE_DEV_API_BASE_URL: ${{ secrets.VITE_DEV_API_BASE_URL }}
        VITE_PROD_API_BASE_URL: ${{ secrets.VITE_PROD_API_BASE_URL }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## Monitoring

### Performance Monitoring

- **Google Analytics**: Track user engagement
- **Vercel Analytics**: Monitor Core Web Vitals
- **Sentry**: Error tracking and performance monitoring

### Health Checks

Monitor your deployed application:

```javascript
// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

### Alerts

Set up alerts for:
- API failures
- High error rates
- Performance degradation
- SSL certificate expiry

## Troubleshooting

### Common Issues

#### Build Failures

**Problem**: Build fails with environment variable errors
```bash
Error: Environment variable VITE_MET_OFFICE_API_KEY is required
```

**Solution**: Ensure all environment variables are configured in your deployment platform.

#### CORS Issues

**Problem**: API requests blocked by CORS policy
```
Access to fetch at 'https://api.example.com' has been blocked by CORS policy
```

**Solution**: Configure CORS headers in your backend or use a proxy.

#### Geolocation Not Working

**Problem**: Geolocation fails on deployed app

**Solution**: Ensure your app is served over HTTPS. Most browsers require HTTPS for geolocation API.

### Debug Steps

1. **Check Browser Console**
   - Look for JavaScript errors
   - Verify API requests

2. **Verify Environment Variables**
   ```bash
   # Check if variables are loaded
   console.log(import.meta.env.VITE_MET_OFFICE_API_KEY);
   ```

3. **Test API Endpoints**
   ```bash
   curl -X GET "your-api-endpoint" -H "accept: application/json"
   ```

4. **Check Network Tab**
   - Verify API responses
   - Check for 404/500 errors

### Performance Optimization

- **Image Optimization**: Use WebP format for images
- **Code Splitting**: Implement lazy loading for components
- **CDN**: Use a CDN for static assets
- **Caching**: Configure proper cache headers

## Security Considerations

- ✅ Never expose API keys in client-side code
- ✅ Use HTTPS for all communications
- ✅ Implement rate limiting on backend
- ✅ Validate all user inputs
- ✅ Keep dependencies updated

## Rollback Strategy

If deployment fails:

1. **Automatic Rollback**: Configure automatic rollback on failed health checks
2. **Manual Rollback**: Use platform-specific rollback features
3. **Database Backup**: Maintain database backups if applicable

---

For additional help with deployment, consult the platform-specific documentation or create an issue in the repository.
