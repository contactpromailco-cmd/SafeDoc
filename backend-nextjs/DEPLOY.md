# 🚀 Quick Deploy Guide

## Deploy Backend to Vercel in 3 Steps

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Login and Deploy
```bash
vercel login
vercel
```

### Step 3: Add Environment Variables
Go to Vercel dashboard → Settings → Environment Variables → Add:

```
PUSHER_APP_ID=2177349
PUSHER_KEY=ab96fbeb449d4f90ca68
PUSHER_SECRET=99ccf1f995f64d4765d7
PUSHER_CLUSTER=eu
GEMINI_API_KEY=AIzaSyAb8RN6L36cr6UpeNIP287qwfvJDjbc95-pBzNdk__pfO0RQUwQAQ.Ab8RN6KS1YNZIUD_o3kPyGx9VeTvJU6gOFsiuNUpTtdLZqh94QAQ.Ab8RN6I1IbRCFb_Oka-g-a-H9qcyZY-bHhIVfojQki1L3ZDJAA
JWT_SECRET=b1fd9938d6982b072afc2b73f201dc9058611b8d893b641c8365b82c0602a104
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY
FRONTEND_URL=https://your-frontend.vercel.app
```

Then redeploy:
```bash
vercel --prod
```

## 🎉 Done!

Your backend is now live at: `https://safedoc-backend-xxx.vercel.app`

### Update Frontend
In `web-app/src/store/websocket-pusher.ts`:
```typescript
const API_URL = 'https://your-backend-url.vercel.app';
```

### Deploy Frontend
```bash
cd ../web-app
vercel
```

---

**Need detailed help?** See `NEXTJS_VERCEL_DEPLOYMENT.md` in the root folder.
