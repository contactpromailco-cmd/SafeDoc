# ✅ SafeDoc Deployment Checklist

Use this checklist to deploy SafeDoc to Vercel step-by-step.

---

## 🎯 Pre-Deployment Checklist

- [x] Next.js backend created (`backend-nextjs/`)
- [x] All API routes converted
- [x] All services copied
- [x] Environment variables configured
- [x] Dependencies installed
- [ ] Vercel CLI installed
- [ ] Vercel account created
- [ ] Backend tested locally (optional)
- [ ] Frontend updated with backend URL

---

## 📦 PART 1: Deploy Backend

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```
- [ ] Vercel CLI installed globally

### Step 2: Login to Vercel
```bash
vercel login
```
- [ ] Logged into Vercel (browser opens)
- [ ] Account connected (GitHub/Email)

### Step 3: Navigate to Backend
```bash
cd "c:\Users\Surface\Desktop\business\doc tool\backend-nextjs"
```
- [ ] In `backend-nextjs` directory

### Step 4: Initial Deploy
```bash
vercel
```

Answer prompts:
- [ ] Set up and deploy? → **Y**
- [ ] Which scope? → Select your account
- [ ] Link to existing project? → **N**
- [ ] Project name? → **safedoc-backend**
- [ ] Directory? → **./  ** (current)
- [ ] Override settings? → **N**

**📝 Note your deployed URL:**
```
Deployed URL: https://_________________________________.vercel.app
```

### Step 5: Add Environment Variables

Go to: https://vercel.com/dashboard → `safedoc-backend` → Settings → Environment Variables

Add each variable:

#### Pusher
- [ ] `PUSHER_APP_ID` = `2177349`
- [ ] `PUSHER_KEY` = `ab96fbeb449d4f90ca68`
- [ ] `PUSHER_SECRET` = `99ccf1f995f64d4765d7`
- [ ] `PUSHER_CLUSTER` = `eu`

#### AI
- [ ] `GEMINI_API_KEY` = `AIzaSyAb8RN6L36cr6UpeNIP287qwfvJDjbc95-pBzNdk__pfO0RQUwQAQ.Ab8RN6KS1YNZIUD_o3kPyGx9VeTvJU6gOFsiuNUpTtdLZqh94QAQ.Ab8RN6I1IbRCFb_Oka-g-a-H9qcyZY-bHhIVfojQki1L3ZDJAA`

#### Auth
- [ ] `JWT_SECRET` = `b1fd9938d6982b072afc2b73f201dc9058611b8d893b641c8365b82c0602a104`

#### Stripe
- [ ] `STRIPE_SECRET_KEY` = `sk_test_YOUR_STRIPE_SECRET_KEY`

#### Frontend (temporary)
- [ ] `FRONTEND_URL` = `http://localhost:3000` (will update later)

### Step 6: Redeploy with Environment Variables
```bash
vercel --prod
```
- [ ] Production deployment complete
- [ ] Backend is live

### Step 7: Test Backend
```bash
curl -X POST https://your-backend-url.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass123","name":"Test"}'
```
- [ ] Backend responds with JSON
- [ ] No errors in response

---

## 🎨 PART 2: Deploy Frontend

### Step 1: Update Frontend API URL

Edit: `web-app/src/store/websocket-pusher.ts`

Find:
```typescript
const API_URL = 'http://localhost:8081';
```

Replace with:
```typescript
const API_URL = 'https://your-backend-url.vercel.app';
```

**⚠️ IMPORTANT:** Use YOUR actual backend URL from Part 1 Step 4!

- [ ] API_URL updated in frontend

### Step 2: Test Build Locally (Optional)
```bash
cd "c:\Users\Surface\Desktop\business\doc tool\web-app"
npm run build
```
- [ ] Build succeeds with no errors

### Step 3: Navigate to Frontend
```bash
cd "c:\Users\Surface\Desktop\business\doc tool\web-app"
```
- [ ] In `web-app` directory

### Step 4: Deploy Frontend
```bash
vercel
```

Answer prompts:
- [ ] Set up and deploy? → **Y**
- [ ] Project name? → **safedoc**
- [ ] Directory? → **./  ** (current)
- [ ] Override settings? → **Y**
  - [ ] Build Command: `npm run build`
  - [ ] Output Directory: `dist`
  - [ ] Development Command: `npm run dev`

**📝 Note your frontend URL:**
```
Frontend URL: https://_________________________________.vercel.app
```

### Step 5: Production Deploy
```bash
vercel --prod
```
- [ ] Frontend is live
- [ ] Can access the website

### Step 6: Test Frontend
Open: `https://your-frontend-url.vercel.app`

- [ ] Page loads successfully
- [ ] No console errors
- [ ] Can click "Get Started"
- [ ] Can open Auth modal

---

## 🔄 PART 3: Connect Frontend & Backend

### Step 1: Update Backend FRONTEND_URL

Go to: https://vercel.com/dashboard → `safedoc-backend` → Settings → Environment Variables

Find `FRONTEND_URL` and update:
- [ ] Changed from `http://localhost:3000`
- [ ] To: `https://your-frontend-url.vercel.app`

### Step 2: Redeploy Backend
```bash
cd "c:\Users\Surface\Desktop\business\doc tool\backend-nextjs"
vercel --prod
```
- [ ] Backend redeployed with new FRONTEND_URL

---

## 🧪 PART 4: End-to-End Testing

### Test 1: Registration
1. Open: `https://your-frontend-url.vercel.app`
2. Click "Get Started"
3. Click "Create Account"
4. Fill form:
   - Email: test@example.com
   - Password: password123
   - Name: Test User
5. Click "Create Account"

- [ ] No errors
- [ ] Redirected to dashboard
- [ ] User info displayed

### Test 2: Document Generation
1. Click "Generate Document"
2. Select "Invoice"
3. Fill invoice form
4. Click "Generate"

- [ ] Document generates
- [ ] Preview shows
- [ ] No errors

### Test 3: AI Negotiation
1. Click "AI Negotiation"
2. Enter Party A name
3. Enter Party B name
4. Submit a term (e.g., "Payment within 30 days")
5. Check AI mediator response

- [ ] Suggestion appears
- [ ] AI compromise shown
- [ ] Fairness score displayed

### Test 4: Real-time Updates (Pusher)
1. Open 2 browser tabs with your app
2. Start negotiation in Tab 1
3. Check if update appears in Tab 2

- [ ] Both tabs receive updates
- [ ] Real-time sync works

### Test 5: Fraud Analysis
1. Generate or paste a document
2. Click "Analyze for Fraud"
3. Wait for AI analysis

- [ ] Analysis completes
- [ ] Risk level shown
- [ ] Findings displayed

---

## 🌐 PART 5: Update Toolset Labs Site

### Step 1: Update Main Page

Edit: `site toolset/index (1).html`

Find SafeDoc section (around line 500):
```html
<a href="http://localhost:3000" class="cta-button primary">Launch SafeDoc →</a>
```

Replace with:
```html
<a href="https://your-frontend-url.vercel.app" class="cta-button primary">Launch SafeDoc →</a>
```

- [ ] Link updated in index page

### Step 2: Update SafeDoc Page

Edit: `site toolset/safedoc.html`

Find:
```html
<a href="http://localhost:3000" class="cta-button primary">Launch App →</a>
```

Replace with:
```html
<a href="https://your-frontend-url.vercel.app" class="cta-button primary">Launch App →</a>
```

- [ ] Link updated in SafeDoc page

### Step 3: Deploy Toolset Labs Site (Optional)

If you want to deploy the marketing site:
```bash
cd "c:\Users\Surface\Desktop\business\doc tool\site toolset"
vercel
```

- [ ] Marketing site deployed (optional)

---

## 📊 PART 6: Setup Monitoring

### Vercel Dashboard

Go to: https://vercel.com/dashboard

#### Backend Project
- [ ] View deployment logs
- [ ] Check function performance
- [ ] Monitor error rate

#### Frontend Project  
- [ ] View analytics
- [ ] Check page views
- [ ] Monitor load times

### Pusher Dashboard

Go to: https://dashboard.pusher.com

- [ ] View connection stats
- [ ] Check message count
- [ ] Monitor channels

### Stripe Dashboard

Go to: https://dashboard.stripe.com

- [ ] Verify test mode is active
- [ ] Check API keys are correct
- [ ] Monitor test transactions

---

## 🎉 DEPLOYMENT COMPLETE!

### Your Live URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://_________________________________ |
| **Backend** | https://_________________________________ |
| **Toolset** | https://_________________________________ (optional) |

### All Features Live

- [x] ✅ User Authentication
- [x] ✅ AI Document Generation
- [x] ✅ AI Contract Negotiation
- [x] ✅ Fraud Detection
- [x] ✅ Real-time Updates (Pusher)
- [x] ✅ Stripe Payments
- [x] ✅ Usage-based Billing
- [x] ✅ 3 Pricing Tiers

---

## 🔍 Troubleshooting

### Issue: Backend not responding
- [ ] Check environment variables are set in Vercel
- [ ] View function logs in Vercel dashboard
- [ ] Verify all env vars are correct

### Issue: Frontend can't connect to backend
- [ ] Verify API_URL in `websocket-pusher.ts` is correct
- [ ] Check browser console for errors
- [ ] Ensure backend URL has no trailing slash

### Issue: Pusher not working
- [ ] Verify Pusher credentials in backend env vars
- [ ] Check Pusher dashboard for errors
- [ ] Ensure cluster is `eu`

### Issue: Build fails
- [ ] Check build logs in Vercel
- [ ] Verify all dependencies in package.json
- [ ] Try `npm install` locally first

---

## 📞 Support

Need help? Check these docs:

- **Quick Guide**: `DEPLOY_NOW.md`
- **Architecture**: `DEPLOYMENT_ARCHITECTURE.md`
- **Conversion Details**: `CONVERSION_COMPLETE.md`
- **Backend Docs**: `backend-nextjs/README.md`

---

## 🚀 Next Steps After Deployment

- [ ] Set up custom domain (optional)
- [ ] Configure Stripe webhooks for production
- [ ] Add Google Analytics (optional)
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Create user documentation
- [ ] Share with beta users
- [ ] Collect feedback
- [ ] Iterate and improve

---

**🎉 Congratulations! SafeDoc is now LIVE!**

Your startup is deployed and ready for users! 🚀
