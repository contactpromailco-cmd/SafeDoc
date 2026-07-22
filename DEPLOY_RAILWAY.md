# 🚂 Deploy SafeDoc to Railway

Railway is perfect for your Express backend! It supports WebSockets and long-running servers natively.

---

## 🎯 Why Railway for SafeDoc?

✅ **Native Express Support** - No conversion needed, use your original backend
✅ **WebSocket Support** - Better for real-time features
✅ **Persistent Connections** - Ideal for Pusher integration
✅ **Postgres Integration** - Easy to add database later
✅ **Simple Deployment** - Deploy directly from GitHub
✅ **Free Tier** - $5 free credit/month

---

## 📦 What We'll Deploy

- **Backend**: Express server (port 8081) from `backend/` folder
- **Frontend**: React app from `web-app/` folder

---

## 🚀 STEP 1: Create Railway Account

1. Go to: https://railway.app
2. Click **"Login"** → Sign up with GitHub
3. Authorize Railway to access your repositories

---

## 🚂 STEP 2: Deploy Backend

### 2.1 Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **"SafeDoc"** repository
4. Railway will detect your project

### 2.2 Configure Backend Service

1. Click **"Add variables"**
2. Add these environment variables:

```env
NODE_ENV=production
PORT=8081

# Pusher
PUSHER_APP_ID=2177349
PUSHER_KEY=ab96fbeb449d4f90ca68
PUSHER_SECRET=99ccf1f995f64d4765d7
PUSHER_CLUSTER=eu

# Gemini AI
GEMINI_API_KEY=your_actual_gemini_api_key_here

# JWT Secret
JWT_SECRET=b1fd9938d6982b072afc2b73f201dc9058611b8d893b641c8365b82c0602a104

# Stripe
STRIPE_SECRET_KEY=your_actual_stripe_secret_key_here

# Frontend URL (update after frontend deployment)
FRONTEND_URL=http://localhost:3000
```

### 2.3 Configure Build Settings

1. Click **"Settings"** tab
2. Set **Root Directory**: `backend`
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `npm start` (or `node dist/index-pusher.js`)
5. Click **"Save"**

### 2.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. You'll get a URL like: `https://safedoc-backend-production.up.railway.app`

**Copy this URL!** You'll need it for the frontend.

---

## 🎨 STEP 3: Deploy Frontend to Vercel

Since Railway is best for backend servers, we'll use Vercel for the frontend (it's optimized for static sites):

### 3.1 Update Frontend API URL

First, update your frontend to point to Railway backend:

**Edit**: `web-app/src/store/websocket-pusher.ts`

```typescript
// Change this:
const API_URL = 'http://localhost:8081';

// To this (use YOUR Railway URL):
const API_URL = 'https://safedoc-backend-production.up.railway.app';
```

Commit and push:
```bash
git add web-app/src/store/websocket-pusher.ts
git commit -m "Update API URL to Railway backend"
git push
```

### 3.2 Deploy Frontend to Vercel

```bash
cd web-app
vercel
```

Follow prompts:
- Project name: **safedoc**
- Root directory: **./  **
- Build command: **npm run build**
- Output directory: **dist**

You'll get a URL like: `https://safedoc.vercel.app`

### 3.3 Update Backend FRONTEND_URL

Go back to Railway:
1. Open your backend service
2. Click **"Variables"** tab
3. Update `FRONTEND_URL` to your Vercel URL
4. Railway will auto-redeploy

---

## ✅ STEP 4: Verify Deployment

### Test Backend

```bash
curl https://your-railway-url.up.railway.app/api/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test User"}'
```

Expected: JSON response with user and token

### Test Frontend

1. Open: `https://your-frontend.vercel.app`
2. Click "Get Started"
3. Register an account
4. Generate a document
5. Test real-time features

---

## 🎯 Railway vs Vercel Comparison

| Feature | Railway | Vercel |
|---------|---------|--------|
| **Express.js** | ✅ Native | ❌ Needs conversion |
| **WebSockets** | ✅ Full support | ⚠️ Limited |
| **Long-running** | ✅ Yes | ❌ 10s timeout |
| **Pricing** | $5 free/month | 100GB free |
| **Database** | ✅ Easy Postgres | ❌ Separate service |
| **Static Sites** | ⚠️ OK | ✅ Optimized |

**Best Setup**: Railway (backend) + Vercel (frontend) 🚀

---

## 💰 Railway Pricing

### Free Tier
- $5 credit/month
- Enough for development and testing
- ~500 hours of uptime

### Pro Plan ($20/month)
- Unlimited projects
- Priority support
- Custom domains
- Team collaboration

---

## 🔧 Railway Features You'll Love

### 1. Logs
- Real-time logs in dashboard
- Filter by service
- Download logs

### 2. Metrics
- CPU usage
- Memory usage
- Network traffic
- Request count

### 3. Auto-Deploy
- Push to GitHub = auto-deploy
- Rollback with one click
- Preview deployments for PRs

### 4. Database (Optional)
Add Postgres easily:
1. Click **"New"** → **"Database"** → **"Postgres"**
2. Railway provides connection string
3. Add to your environment variables

---

## 🚀 Quick Deploy Commands

### Deploy Backend (Railway)
1. Go to https://railway.app/new
2. Select GitHub repo
3. Configure environment variables
4. Deploy!

### Deploy Frontend (Vercel)
```bash
cd web-app
vercel
```

---

## 📝 Deployment Checklist

### Backend (Railway)
- [ ] Create Railway account
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Set root directory to `backend`
- [ ] Deploy
- [ ] Copy Railway URL

### Frontend (Vercel)
- [ ] Update API_URL in frontend code
- [ ] Commit and push changes
- [ ] Run `vercel` in web-app folder
- [ ] Copy Vercel URL

### Final Steps
- [ ] Update FRONTEND_URL in Railway
- [ ] Test registration
- [ ] Test document generation
- [ ] Test real-time features

---

## 🆘 Troubleshooting

### Railway Build Fails
- Check `package.json` has correct scripts
- Verify all dependencies are listed
- Check build logs for errors

### Backend Not Responding
- Verify environment variables are set
- Check Railway logs for errors
- Ensure PORT is set to 8081

### Frontend Can't Connect
- Verify API_URL is correct in frontend
- Check CORS settings in backend
- Ensure Railway URL is HTTPS

### Pusher Not Working
- Verify Pusher credentials in Railway
- Check Pusher dashboard for errors
- Ensure cluster is set to `eu`

---

## 🎉 After Deployment

Your live URLs:
- **Backend**: `https://safedoc-backend-production.up.railway.app`
- **Frontend**: `https://safedoc.vercel.app`

Share your app with the world! 🌍

---

## 📚 Resources

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Vercel Docs**: https://vercel.com/docs

---

**Ready to deploy?** Go to https://railway.app and let's get started! 🚂
