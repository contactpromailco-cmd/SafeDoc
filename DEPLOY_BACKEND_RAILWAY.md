# 🚂 Deploy Backend to Railway (Recommended)

## Why Railway Instead of Vercel?

- ✅ Better for Express.js apps
- ✅ No serverless cold starts
- ✅ Free $5/month credit
- ✅ Easy environment variables
- ✅ Automatic HTTPS
- ✅ No build configuration needed

---

## 🚀 Deploy in 3 Minutes

### Step 1: Create Railway Account
1. Go to: https://railway.app/
2. Click "Start a New Project"
3. Login with GitHub (free)

### Step 2: Deploy Backend
1. Click "Deploy from GitHub repo" OR "Empty Project"
2. If GitHub: Select your repo, choose `backend` folder
3. If Empty: We'll use CLI (easier)

### Step 3: Deploy via CLI (Easiest)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Go to backend folder
cd "c:\Users\Surface\Desktop\business\doc tool\backend"

# Initialize
railway init

# Deploy
railway up
```

### Step 4: Add Environment Variables

In Railway dashboard:
1. Go to your project
2. Click "Variables" tab
3. Add these:

```
PORT=8080
NODE_ENV=production
PUSHER_APP_ID=2177349
PUSHER_KEY=ab96fbeb449d4f90ca68
PUSHER_SECRET=99ccf1f995f64d4765d7
PUSHER_CLUSTER=eu
GEMINI_API_KEY=AIzaSyAb8RN6L36cr6UpeNIP287qwfvJDjbc95-pBzNdk__pfO0RQUwQAQ.Ab8RN6KS1YNZIUD_o3kPyGx9VeTvJU6gOFsiuNUpTtdLZqh94QAQ.Ab8RN6I1IbRCFb_Oka-g-a-H9qcyZY-bHhIVfojQki1L3ZDJAA
JWT_SECRET=b1fd9938d6982b072afc2b73f201dc9058611b8d893b641c8365b82c0602a104
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY
```

### Step 5: Get Your URL

Railway will give you a URL like:
```
https://safedoc-backend-production.up.railway.app
```

**Copy this URL!** You'll need it for the frontend.

---

## 🎯 Then Deploy Frontend to Vercel

Frontend works PERFECT on Vercel!

1. Go to: https://vercel.com/new
2. Import `web-app` folder
3. Add environment variable:
   - `VITE_API_URL` = (your Railway backend URL)
4. Deploy!

---

## 📋 Summary

- **Backend** → Railway (perfect for Express)
- **Frontend** → Vercel (perfect for React/Vite)
- **Site** → Vercel (perfect for static HTML)

This is the **professional setup** most companies use!

---

## 💡 Want Me to Help?

Say:
- "install railway cli" - I'll do it
- "deploy to railway" - I'll guide you
- "help with vercel frontend" - I'll assist

Let's get this deployed! 🚀
