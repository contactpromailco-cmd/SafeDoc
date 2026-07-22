# Next.js Backend - Vercel Deployment Guide

## ✅ Conversion Complete!

Your Express backend has been successfully converted to Next.js API routes for optimal Vercel deployment.

## 📁 New Project Structure

```
backend-nextjs/
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── auth/
│   │       │   ├── register/route.ts ✅
│   │       │   └── login/route.ts ✅
│   │       ├── documents/
│   │       │   └── generate/route.ts ✅
│   │       ├── negotiation/
│   │       │   ├── suggest/route.ts ✅
│   │       │   └── accept/route.ts ✅
│   │       ├── payments/
│   │       │   ├── create-checkout/route.ts ✅
│   │       │   └── portal/route.ts ✅
│   │       ├── fraud-analysis/route.ts ✅
│   │       └── webhooks/
│   │           └── stripe/route.ts ✅
│   └── services/ (copied from backend)
│       ├── AuthService.ts ✅
│       ├── GeminiAI.ts ✅
│       ├── StripeService.ts ✅
│       ├── InvoiceImageGenerator.ts ✅
│       └── ... (all other services)
├── .env.local (local environment variables) ✅
├── .env.example (template) ✅
├── vercel.json (deployment config) ✅
├── package.json ✅
└── README.md (deployment instructions) ✅
```

## 🚀 Deploy to Vercel NOW

### Step 1: Navigate to Next.js project

```bash
cd backend-nextjs
```

### Step 2: Install Vercel CLI (if not installed)

```bash
npm i -g vercel
```

### Step 3: Login to Vercel

```bash
vercel login
```

### Step 4: Deploy

```bash
vercel
```

Follow the prompts:
- **Set up and deploy?** Yes
- **Which scope?** Your account
- **Link to existing project?** No
- **Project name?** safedoc-backend (or your choice)
- **Directory?** ./ (current directory)
- **Override settings?** No

### Step 5: Add Environment Variables

After deployment, add these in Vercel dashboard (Settings → Environment Variables):

**Required:**
- `PUSHER_APP_ID` = `2177349`
- `PUSHER_KEY` = `ab96fbeb449d4f90ca68`
- `PUSHER_SECRET` = `99ccf1f995f64d4765d7`
- `PUSHER_CLUSTER` = `eu`
- `GEMINI_API_KEY` = `AIzaSyAb8RN6L36cr6UpeNIP287qwfvJDjbc95-pBzNdk__pfO0RQUwQAQ.Ab8RN6KS1YNZIUD_o3kPyGx9VeTvJU6gOFsiuNUpTtdLZqh94QAQ.Ab8RN6I1IbRCFb_Oka-g-a-H9qcyZY-bHhIVfojQki1L3ZDJAA`
- `JWT_SECRET` = `b1fd9938d6982b072afc2b73f201dc9058611b8d893b641c8365b82c0602a104`
- `STRIPE_SECRET_KEY` = `sk_test_YOUR_STRIPE_SECRET_KEY`
- `FRONTEND_URL` = (will be your Vercel frontend URL)

### Step 6: Redeploy

After adding environment variables:

```bash
vercel --prod
```

## 🌐 Your Deployed Backend URL

After deployment, you'll get a URL like:
```
https://safedoc-backend.vercel.app
```

## 📝 API Endpoints

All routes are now available at:

```
https://safedoc-backend.vercel.app/api/auth/register
https://safedoc-backend.vercel.app/api/auth/login
https://safedoc-backend.vercel.app/api/documents/generate
https://safedoc-backend.vercel.app/api/negotiation/suggest
https://safedoc-backend.vercel.app/api/negotiation/accept
https://safedoc-backend.vercel.app/api/payments/create-checkout
https://safedoc-backend.vercel.app/api/payments/portal
https://safedoc-backend.vercel.app/api/fraud-analysis
https://safedoc-backend.vercel.app/api/webhooks/stripe
```

## 🔧 Update Frontend

After backend is deployed, update your frontend:

1. **Update API URL** in `web-app/src/store/websocket-pusher.ts`:
   ```typescript
   const API_URL = 'https://safedoc-backend.vercel.app';
   ```

2. **Deploy frontend** (if not deployed):
   ```bash
   cd ../web-app
   vercel
   ```

## ✅ What Changed from Express?

### Before (Express):
```typescript
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  // ... logic
  res.json({ success: true });
});
```

### After (Next.js):
```typescript
export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  // ... same logic
  return NextResponse.json({ success: true });
}
```

**Benefits:**
- ✅ Serverless functions (auto-scaling)
- ✅ Edge network deployment
- ✅ Zero server management
- ✅ Built-in TypeScript support
- ✅ Automatic HTTPS
- ✅ Global CDN

## 🔍 Testing Locally

Before deploying:

```bash
cd backend-nextjs
npm install
npm run dev
```

Open: http://localhost:3000/api/auth/login (should return method not allowed for GET)

Test with curl:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test User"}'
```

## 🎯 Next Steps

1. ✅ Deploy backend to Vercel
2. ✅ Get deployed URL
3. ✅ Update frontend API_URL
4. ✅ Deploy frontend to Vercel
5. ✅ Update FRONTEND_URL in backend env vars
6. ✅ Update Toolset Labs site HTML with live URLs
7. ✅ Test everything works end-to-end

## 🐛 Troubleshooting

### Build fails?
- Check all dependencies are in `package.json`
- Run `npm install` locally first
- Check build logs in Vercel dashboard

### API not working?
- Verify environment variables are set in Vercel
- Check function logs in Vercel dashboard
- Test locally first with `npm run dev`

### CORS errors?
- Ensure `FRONTEND_URL` is correct
- Add CORS middleware if needed (Next.js API routes don't need it by default)

## 📊 Monitoring

View logs in Vercel:
1. Go to your project dashboard
2. Click **Functions** tab
3. Select any API route
4. View real-time logs

## 💰 Cost

Vercel Free Tier includes:
- ✅ 100GB bandwidth/month
- ✅ 1000 serverless function executions/day
- ✅ Automatic HTTPS
- ✅ Global CDN

**This is perfect for SafeDoc!**

---

Need help? Check `backend-nextjs/README.md` for detailed documentation.
