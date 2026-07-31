# 🚀 SafeDoc AI - Deployment Guide

## ✅ Current Status: API URLs Centralized

All API calls have been updated to use the centralized `config.ts` file. The app now automatically uses production or development URLs based on the environment.

---

## 📋 CRITICAL: Next Steps to Deploy

### 1️⃣ Deploy Backend First (REQUIRED)

**Option A: Railway (Recommended - Easiest)**
```bash
# Install Railway CLI
npm install -g railway

# Login
railway login

# Navigate to backend folder
cd backend

# Initialize Railway project
railway init

# Add environment variables (copy from .env file)
railway variables set GEMINI_API_KEY="your-key"
railway variables set GROK_API_KEY="your-key"
railway variables set PUSHER_APP_ID="2177349"
railway variables set PUSHER_KEY="ab96fbeb449d4f90ca68"
railway variables set PUSHER_SECRET="your-secret"
railway variables set PUSHER_CLUSTER="eu"
railway variables set JWT_SECRET="your-secret"
# ... add all other env variables from .env

# Deploy
railway up

# Get your backend URL
railway domain
# Example output: https://safedoc-backend-production.up.railway.app
```

**Option B: Render**
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add all environment variables from `backend/.env`
6. Click "Create Web Service"
7. Copy your backend URL (e.g., `https://safedoc-backend.onrender.com`)

**Option C: Heroku**
```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
cd backend
heroku create safedoc-backend

# Add environment variables
heroku config:set GEMINI_API_KEY="your-key"
heroku config:set GROK_API_KEY="your-key"
# ... add all other env variables

# Deploy
git push heroku main

# Get your backend URL
heroku open
```

---

### 2️⃣ Update Frontend Config with Production URL

Once you have your backend URL, update `web-app/src/config.ts`:

```typescript
// Replace this line (line 9):
export const API_URL = isProduction
  ? 'https://your-backend-url.railway.app' // ← CHANGE THIS
  : 'http://localhost:8081';

// With your actual backend URL:
export const API_URL = isProduction
  ? 'https://safedoc-backend-production.up.railway.app' // ← YOUR REAL URL
  : 'http://localhost:8081';
```

**Also update the FRONTEND_URL (line 14) if needed:**
```typescript
export const FRONTEND_URL = isProduction
  ? 'https://doc-tool-2.vercel.app' // ← Update with your actual Vercel URL
  : 'http://localhost:3000';
```

---

### 3️⃣ Deploy Frontend to Vercel

**Vercel deployment is already configured!** Just push to GitHub:

```bash
# Commit the updated config.ts
git add .
git commit -m "Update production API URL"
git push origin main
```

Vercel will automatically:
- Build the frontend with `npm run build --workspace=web-app`
- Deploy to your domain
- Use the production API_URL from config.ts

---

## 🔧 Configuration Summary

### Files Updated:
✅ `web-app/src/config.ts` - Centralized API configuration  
✅ `web-app/src/contexts/AuthContext.tsx` - Uses `API_URL`  
✅ `web-app/src/components/AuthModal.tsx` - Uses `API_URL` and `OAUTH_CONFIG`  
✅ `web-app/src/components/PricingModal.tsx` - Uses `API_URL`  
✅ `web-app/src/pages/Workspace.tsx` - Uses `API_URL`  
✅ `web-app/src/store/websocket-pusher.ts` - Uses `API_URL` and `PUSHER_CONFIG`  

### How It Works:
- **Development** (`npm run dev`): Uses `http://localhost:8081`
- **Production** (Vercel build): Uses your production backend URL
- **Automatic detection**: `import.meta.env.PROD` determines the environment

---

## 🔑 OAuth Setup (Optional)

To enable Google/GitHub/Apple Sign-In, update `web-app/src/config.ts`:

### Google Sign-In:
1. Get Client ID from [Google Cloud Console](https://console.cloud.google.com)
2. Update line ~21:
   ```typescript
   google: {
     clientId: 'YOUR_ACTUAL_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
   },
   ```

### GitHub Sign-In:
1. Get Client ID from [GitHub OAuth Apps](https://github.com/settings/developers)
2. Update lines ~24-26:
   ```typescript
   github: {
     clientId: 'YOUR_ACTUAL_GITHUB_CLIENT_ID',
     redirectUri: `${FRONTEND_URL}/auth/github/callback`,
   },
   ```
3. Add to backend `.env`:
   ```
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

See `OAUTH_SETUP_GUIDE.md` for detailed instructions.

---

## 🧪 Testing After Deployment

1. **Test Registration**: Create a new account
2. **Test Login**: Sign in with your account
3. **Test Document Generation**: Generate an invoice
4. **Test Pricing Modal**: Click "Upgrade" button
5. **Test OAuth** (if configured): Try "Sign in with Google"

---

## 🐛 Troubleshooting

### "Network Error" when clicking buttons:
- **Cause**: Backend not deployed or wrong URL in config.ts
- **Fix**: Deploy backend first, then update `API_URL` in config.ts

### "CORS Error" in browser console:
- **Cause**: Backend CORS not configured for your frontend domain
- **Fix**: Add your Vercel URL to backend CORS settings in `backend/src/index-pusher.ts`:
  ```typescript
  app.use(cors({
    origin: ['http://localhost:3000', 'https://doc-tool-2.vercel.app'],
    credentials: true,
  }));
  ```

### "Pusher connection failed":
- **Cause**: Pusher credentials not set in backend
- **Fix**: Add all Pusher env variables to your hosting platform

### "401 Unauthorized" errors:
- **Cause**: JWT_SECRET not set in backend
- **Fix**: Add `JWT_SECRET` environment variable to backend

---

## 📊 Environment Variables Checklist

### Backend (Railway/Render/Heroku):
```
✅ GEMINI_API_KEY=your_key
✅ GROK_API_KEY=your_key
✅ PUSHER_APP_ID=2177349
✅ PUSHER_KEY=ab96fbeb449d4f90ca68
✅ PUSHER_SECRET=your_secret
✅ PUSHER_CLUSTER=eu
✅ JWT_SECRET=your_secret
✅ STRIPE_SECRET_KEY=your_key (optional, for payments)
✅ STRIPE_WEBHOOK_SECRET=your_secret (optional)
✅ GITHUB_CLIENT_SECRET=your_secret (optional, for OAuth)
✅ PORT=8081
```

### Frontend (Vercel):
No environment variables needed! Everything is in `config.ts`.

---

## 🎯 Current Deployment Status

| Component | Status | Action Required |
|-----------|--------|-----------------|
| Frontend Config | ✅ Complete | Update production URL in config.ts |
| API URL Centralization | ✅ Complete | None |
| Backend Deployment | ⏳ Pending | Deploy to Railway/Render/Heroku |
| Frontend Deployment | ✅ Configured | Push to GitHub after backend URL |
| OAuth Setup | ⏳ Optional | Add OAuth credentials to config.ts |

---

## 🚀 Quick Deploy Checklist

1. ⬜ Deploy backend to Railway/Render/Heroku
2. ⬜ Copy backend URL
3. ⬜ Update `web-app/src/config.ts` with production URL (line 9)
4. ⬜ Commit and push to GitHub
5. ⬜ Vercel auto-deploys
6. ⬜ Test all features
7. ⬜ (Optional) Configure OAuth credentials

---

**Need Help?**
- Railway: https://docs.railway.app
- Render: https://render.com/docs
- Heroku: https://devcenter.heroku.com
- Vercel: https://vercel.com/docs

---

Made with ❤️ by [Toolset](https://toolsetlabs.com)
