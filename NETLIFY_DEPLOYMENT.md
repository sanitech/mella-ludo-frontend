# Netlify Deployment Guide

## 🚀 Quick Deploy

### Option 1: Deploy via Netlify UI
1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `22.17.0`
5. Click "Deploy site"

### Option 2: Deploy via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod --dir=dist
```

## ⚙️ Configuration Files

### netlify.toml
- Handles SPA routing (redirects all routes to index.html)
- Sets security headers
- Configures caching for static assets
- Specifies Node.js version

### public/_redirects
- Backup routing configuration
- Ensures all routes work with React Router

### public/_headers
- Security headers configuration
- Cache control for static assets

## 🔧 Environment Variables

Set these in Netlify dashboard under Site settings > Environment variables:

```
VITE_API_BASE_URL=https://nextgame.onrender.com
```

## 🐛 Troubleshooting

### Route Not Found Error
- ✅ **Fixed**: `netlify.toml` redirects all routes to `index.html`
- ✅ **Fixed**: `public/_redirects` provides backup routing
- ✅ **Fixed**: React Router will handle client-side routing

### Build Errors
- ✅ **Fixed**: Using esbuild instead of terser
- ✅ **Fixed**: Node.js version specified (22.17.0)
- ✅ **Fixed**: npm configuration in `.npmrc`

### Performance Issues
- ✅ **Fixed**: Static asset caching configured
- ✅ **Fixed**: Code splitting with manual chunks
- ✅ **Fixed**: Security headers optimized

## 📁 File Structure
```
mella-ludo-admin-pannel/
├── netlify.toml          # Netlify configuration
├── public/
│   ├── _redirects        # Routing rules
│   └── _headers          # Header configuration
├── src/                  # Source code
├── dist/                 # Build output (generated)
└── package.json          # Dependencies
```

## 🎯 Success Indicators
- ✅ All routes work (no 404 errors)
- ✅ React Router navigation works
- ✅ Static assets load quickly
- ✅ Security headers are applied
- ✅ Build completes without errors 