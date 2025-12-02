# Deployment Guide for JibonJatra

This guide covers deploying the frontend to both Vercel and Render.

## Prerequisites

- GitHub repository with your code
- Vercel account (vercel.com)
- Render account (render.com)

## 1. Vercel Deployment (Recommended for Frontend)

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Import Project" or "New Project"
3. Select your GitHub repository
4. Choose the frontend folder as the root directory

### Step 2: Configure Environment Variables

In Vercel dashboard:

1. Go to Project Settings > Environment Variables
2. Add these variables:
   - `REACT_APP_API_BASE` = `https://jibonjatra.onrender.com/api`
   - `GENERATE_SOURCEMAP` = `false`
   - `CI` = `false`

### Step 3: Deploy

1. Vercel will automatically deploy when you push to main branch
2. Your app will be available at: `https://your-project-name.vercel.app`

### Custom Domain (Optional)

1. In Vercel dashboard, go to Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## 2. Render Deployment (Alternative)

### Step 1: Create Static Site

1. Go to [render.com](https://render.com) dashboard
2. Click "New" > "Static Site"
3. Connect your GitHub repository
4. Choose the frontend folder as the root directory

### Step 2: Configure Build Settings

- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `build`
- **Node Version**: `18` or `20`

### Step 3: Environment Variables

Add these in Render:

- `REACT_APP_API_BASE` = `https://jibonjatra.onrender.com/api`
- `GENERATE_SOURCEMAP` = `false`
- `CI` = `false`

### Step 4: Deploy

1. Click "Create Static Site"
2. Render will build and deploy automatically
3. Your app will be available at: `https://your-project-name.onrender.com`

## 3. Backend Deployment (If Needed)

If you need to deploy your backend to a different service:

### For Node.js Backend on Render:

1. Create new "Web Service" on Render
2. Connect backend repository
3. Set build command: `npm install`
4. Set start command: `npm start` or `node server.js`
5. Add environment variables (database URLs, JWT secrets, etc.)

### For Node.js Backend on Railway/Heroku:

1. Connect repository
2. Add buildpacks if needed
3. Set environment variables
4. Deploy

## 4. Environment Management

### Development:

```env
REACT_APP_API_BASE=http://localhost:5000/api
```

### Production (Both Vercel & Render):

```env
REACT_APP_API_BASE=https://your-backend-url.com/api
GENERATE_SOURCEMAP=false
CI=false
```

## 5. Automatic Deployments

### GitHub Integration:

Both Vercel and Render can auto-deploy on git push:

1. Connect your GitHub repository
2. Choose branch (usually `main` or `master`)
3. Every push to that branch triggers a new deployment

### Manual Deployment:

- **Vercel**: Use `vercel` CLI or dashboard
- **Render**: Use dashboard or API

## 6. Monitoring & Logs

### Vercel:

- View deployments in dashboard
- Check function logs
- Monitor performance

### Render:

- View build logs in dashboard
- Monitor uptime and performance
- Set up notifications

## 7. Troubleshooting

### Common Issues:

1. **Build Failures**: Check Node.js version compatibility
2. **Environment Variables**: Ensure all required vars are set
3. **API Calls**: Verify CORS settings on backend
4. **Routing**: Ensure SPA routing is configured (handled by vercel.json)

### Build Optimization:

- Source maps disabled for production
- Bundle analysis available with `npm run analyze`
- Static assets cached properly

## 8. Cost Considerations

### Vercel:

- Free tier: 100GB bandwidth, unlimited static deployments
- Pro tier: $20/month for team features

### Render:

- Free tier: 750 hours/month (sleeps after 15min inactivity)
- Paid plans: Starting $7/month for always-on services

## 9. Performance Tips

1. **CDN**: Both services provide global CDN
2. **Caching**: Static assets cached automatically
3. **Compression**: Gzip/Brotli enabled by default
4. **Image Optimization**: Consider using service-specific solutions

## 10. Security

1. **HTTPS**: Enabled by default on both platforms
2. **Environment Variables**: Never commit secrets to git
3. **CORS**: Configure properly on backend
4. **Headers**: Security headers configured in deployment files
