# 🚂 Railway Deployment - Quick Start

## ✅ Ready to Deploy!

Your SafeDoc backend is configured for Railway! Here's how to deploy in 5 minutes.

---

## 🎯 Step-by-Step

### 1. Go to Railway
Open: https://railway.app/new

### 2. Login with GitHub
- Click **"Login with GitHub"**
- Authorize Railway

### 3. Deploy from GitHub
- Click **"Deploy from GitHub repo"**
- Select **"SafeDoc"** repository
- Railway will detect your project

### 4. Configure Service
Click on the deployed service, then:

#### Set Root Directory
- Go to **Settings** tab
- **Root Directory**: `backend`
- Click **Save**

#### Add Environment Variables
Click **Variables** tab and add:

```
NODE_ENV=production
PORT=8081

PUSHER_APP_ID=2177349
PUSHER_KEY=ab96fbeb449d4f90ca68
PUSHER_SECRET=99ccf1f995f64d4765d7
PUSHER_CLUSTER=eu

GEMINI_API_KEY=AIzaSyAb8RN6L36cr6UpeNIP287qwfvJDjbc95-pBzNdk__pfO0RQUwQAQ.Ab8RN6KS1YNZIUD_o3kPyGx9VeTvJU6gOFsiuNUpTtdLZqh94QAQ.Ab8RN6I1IbRCFb_Oka-g-a-H9qcyZY-bHhIVfojQki1L3ZDJAA

JWT_SECRET=b1fd9938d6982b072afc2b73f201dc9058611b8d893b641c8365b82c0602a104

STRIPE_SECRET_KEY=sk_test_51TkTsK344QKqsPwuFTJt2trZtFdmhFnPLflx2U1RME1m7g0qwFdkX7vSUktUx2EROZw0PkPpQ0GGvmnX3pdElzRP00jbOnDRKt

FRONTEND_URL=http://localhost:3000
```

### 5. Deploy!
- Railway will automatically build and deploy
- Wait 2-3 minutes
- You'll get a URL like: `https://safedoc-production.up.railway.app`

**Copy this URL!**

---

## 🎨 Deploy Frontend to Vercel

### 1. Update API URL in Frontend

Edit `web-app/src/store/websocket-pusher.ts`:

```typescript
const API_URL = 'https://YOUR-RAILWAY-URL.up.railway.app';
```

### 2. Commit and Push
```bash
git add web-app/src/store/websocket-pusher.ts
git commit -m "Update API URL to Railway backend"
git push
```

### 3. Deploy to Vercel
```bash
cd web-app
vercel
```

### 4. Update Backend FRONTEND_URL
Go back to Railway → Variables → Update `FRONTEND_URL` to your Vercel URL

---

## ✅ Done!

Your app is now live:
- **Backend**: Railway
- **Frontend**: Vercel  

**Total time**: ~10 minutes

---

## 💡 Why This Setup?

✅ **Railway** = Perfect for Express servers
✅ **Vercel** = Perfect for React frontends
✅ **Best of both worlds** = Fast, scalable, reliable

---

## 🆘 Need Help?

See detailed guide: `DEPLOY_RAILWAY.md`

**Ready?** Go to: https://railway.app/new 🚂
