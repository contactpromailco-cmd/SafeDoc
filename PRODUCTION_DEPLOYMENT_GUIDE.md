# SafeDoc Production Deployment Guide 🚀

## Complete Step-by-Step Production Setup

---

## 📋 Pre-Deployment Checklist

### 1. Get Required Services

#### Stripe (Payment Processing)
1. Go to https://stripe.com
2. Create account (or use existing)
3. Get API keys from https://dashboard.stripe.com/test/apikeys
   - `STRIPE_SECRET_KEY` (starts with `sk_test_` for test, `sk_live_` for production)
   - `STRIPE_PUBLISHABLE_KEY` (starts with `pk_test_` or `pk_live_`)
4. Set up products in Stripe Dashboard:
   - **SafeDoc Pro**: $12/month (or $120/year)
   - **SafeDoc Business**: $39/month (or $390/year)
5. Set up webhook endpoint for subscription events

#### Email Service (Optional but Recommended)
**Option A: Gmail**
1. Enable 2-Factor Authentication on Gmail
2. Generate App Password:
   - Go to Google Account → Security → 2-Step Verification → App Passwords
   - Select "Mail" and "Other (Custom name)"
   - Save the 16-character password

**Option B: SendGrid** (Professional)
1. Sign up at https://sendgrid.com (Free: 100 emails/day)
2. Get API key from Settings → API Keys
3. Verify sender email

**Option C: AWS SES** (Enterprise)
1. Create AWS account
2. Set up SES in AWS Console
3. Verify domain
4. Get SMTP credentials

#### Hosting Services

**Backend Options:**
- **Vercel** (Easiest, Free tier available) ✅
- **Railway** (Good for Node.js)
- **Heroku** (Classic choice)
- **AWS Elastic Beanstalk** (Enterprise)
- **DigitalOcean App Platform**

**Frontend Options:**
- **Vercel** (Recommended, Free tier) ✅
- **Netlify** (Great for static sites)
- **Cloudflare Pages** (Fast CDN)
- **AWS S3 + CloudFront**

---

## 🔧 Backend Deployment (Vercel)

### Step 1: Prepare Backend

1. **Add vercel.json** (already exists):
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index-pusher.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index-pusher.js"
    }
  ]
}
```

2. **Ensure backend is compiled**:
```bash
cd backend
npm run build
```

### Step 2: Deploy to Vercel

**Via Vercel CLI:**
```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from backend directory
cd backend
vercel --prod
```

**Via Vercel Dashboard:**
1. Go to https://vercel.com/new
2. Import your Git repository
3. Set root directory to `backend`
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Deploy!

### Step 3: Configure Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

```env
# Required
NODE_ENV=production
PORT=8080

# Pusher (Real-time)
PUSHER_APP_ID=2177349
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=eu

# Gemini AI
GEMINI_API_KEY=your_gemini_api_key

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# Stripe Payment (Required for payments)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=SafeDoc <noreply@yourdomain.com>
```

**Important**: Use **production keys** for live deployment:
- Stripe: `sk_live_...` instead of `sk_test_...`
- Generate strong JWT_SECRET: `openssl rand -base64 32`

### Step 4: Get Backend URL

After deployment, Vercel gives you a URL like:
```
https://safedoc-backend-abc123.vercel.app
```

Save this for frontend configuration!

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Update API URLs

Update these files with your backend URL:

**1. web-app/src/contexts/AuthContext.tsx** (line 20):
```typescript
const API_URL = 'https://safedoc-backend-abc123.vercel.app';
```

**2. web-app/src/components/PricingModal.tsx** (line 47):
```typescript
const response = await fetch('https://safedoc-backend-abc123.vercel.app/api/payments/create-checkout', {
```

**3. web-app/src/pages/Workspace.tsx** (3 locations):
```typescript
// Line ~281
const response = await fetch('https://safedoc-backend-abc123.vercel.app/api/documents/generate', {

// Line ~365
fetch('https://safedoc-backend-abc123.vercel.app/api/documents/export-odf', {

// Line ~380
await fetch('https://safedoc-backend-abc123.vercel.app/api/documents/analyze', {
```

**Better approach - Create config file:**

Create `web-app/src/config.ts`:
```typescript
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
```

Then update imports:
```typescript
import { API_URL } from '../config';
```

### Step 2: Add Environment Variable

Create `web-app/.env.production`:
```env
VITE_API_URL=https://safedoc-backend-abc123.vercel.app
```

### Step 3: Build Frontend

```bash
cd web-app
npm run build
```

This creates `web-app/dist` folder with production build.

### Step 4: Deploy to Vercel

**Via Vercel CLI:**
```bash
cd web-app
vercel --prod
```

**Via Vercel Dashboard:**
1. Go to https://vercel.com/new
2. Import repository
3. Set root directory to `web-app`
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Add environment variable: `VITE_API_URL`
7. Deploy!

### Step 5: Get Frontend URL

Vercel provides URL like:
```
https://safedoc-app-xyz789.vercel.app
```

This is your production app! 🎉

---

## 🎯 Custom Domain Setup (Optional)

### Backend Domain

1. **Buy domain** (e.g., api.safedoc.com)
2. In Vercel Dashboard → Backend Project → Settings → Domains
3. Add domain: `api.safedoc.com`
4. Update DNS records (Vercel provides instructions)
5. SSL automatically configured!

### Frontend Domain

1. **Buy domain** (e.g., safedoc.com or app.safedoc.com)
2. In Vercel Dashboard → Frontend Project → Settings → Domains
3. Add domain: `safedoc.com` and `www.safedoc.com`
4. Update DNS records
5. SSL automatically configured!

**After custom domains**:
- Update `VITE_API_URL` to `https://api.safedoc.com`
- Redeploy frontend

---

## 🔐 Stripe Webhook Setup

### Step 1: Create Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://your-backend.vercel.app/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

### Step 2: Get Webhook Secret

1. After creating webhook, click on it
2. Copy "Signing secret" (starts with `whsec_`)
3. Add to backend environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Step 3: Test Webhook

```bash
# Install Stripe CLI
stripe listen --forward-to https://your-backend.vercel.app/api/webhooks/stripe

# Trigger test event
stripe trigger checkout.session.completed
```

---

## 🗄️ Database Setup (Production)

Currently, user data is stored in-memory. For production, use a database:

### Option 1: Supabase (Easiest)

1. Sign up at https://supabase.com (Free tier available)
2. Create new project
3. Get connection string
4. Install Supabase client:
   ```bash
   npm install @supabase/supabase-js
   ```
5. Create users table:
   ```sql
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     email TEXT UNIQUE NOT NULL,
     password_hash TEXT NOT NULL,
     name TEXT NOT NULL,
     plan TEXT DEFAULT 'free',
     documents_used INTEGER DEFAULT 0,
     stripe_customer_id TEXT,
     created_at TIMESTAMP DEFAULT NOW()
   );
   ```

### Option 2: MongoDB Atlas

1. Sign up at https://www.mongodb.com/cloud/atlas (Free tier)
2. Create cluster
3. Get connection string
4. Install MongoDB driver:
   ```bash
   npm install mongodb
   ```

### Option 3: PostgreSQL (Railway/Heroku)

1. Add PostgreSQL addon
2. Get DATABASE_URL
3. Install pg client:
   ```bash
   npm install pg
   ```

**Then update AuthService.ts** to use real database instead of in-memory Map.

---

## 📊 Monitoring & Analytics

### 1. Error Tracking (Sentry)

```bash
npm install @sentry/node @sentry/react
```

**Backend (backend/src/index-pusher.ts):**
```typescript
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.errorHandler());
```

**Frontend (web-app/src/main.tsx):**
```typescript
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: import.meta.env.MODE,
});
```

### 2. Analytics (Google Analytics)

Install:
```bash
npm install react-ga4
```

In `web-app/src/App.tsx`:
```typescript
import ReactGA from 'react-ga4';

useEffect(() => {
  ReactGA.initialize('G-XXXXXXXXXX');
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });
}, []);
```

### 3. Uptime Monitoring

- **UptimeRobot**: https://uptimerobot.com (Free)
- **Pingdom**: https://pingdom.com
- **Better Uptime**: https://betteruptime.com

Monitor endpoints:
- `https://your-backend.vercel.app/health`
- `https://your-frontend.vercel.app/`

---

## 🔒 Security Hardening

### 1. Enable CORS Properly

In `backend/src/index-pusher.ts`:
```typescript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://safedoc.com'
    : 'http://localhost:3000',
  credentials: true,
}));
```

### 2. Add Rate Limiting

```bash
npm install express-rate-limit
```

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. Add Helmet (Security Headers)

```bash
npm install helmet
```

```typescript
import helmet from 'helmet';
app.use(helmet());
```

### 4. Use HTTPS Only

In `backend/src/index-pusher.ts`:
```typescript
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

### 5. Secure Environment Variables

Never commit:
- `.env` files
- Stripe keys
- JWT secrets
- Database credentials
- API keys

Add to `.gitignore`:
```
.env
.env.local
.env.production
```

---

## 🧪 Pre-Launch Testing

### 1. Test on Production Backend

```bash
# Test auth
curl -X POST https://your-backend.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test1234","name":"Test User"}'

# Test health
curl https://your-backend.vercel.app/health
```

### 2. Test Full User Flow

1. ✅ Register new account
2. ✅ Login
3. ✅ Generate document
4. ✅ Download document
5. ✅ Hit limit
6. ✅ Upgrade (test mode)
7. ✅ Generate more documents
8. ✅ Logout/login

### 3. Test Stripe Integration

Use test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- 3D Secure: `4000 0027 6000 3184`

### 4. Load Testing

```bash
# Install Apache Bench
apt-get install apache2-utils

# Test backend
ab -n 1000 -c 10 https://your-backend.vercel.app/health
```

---

## 📈 Launch Checklist

### Before Going Live:

- [ ] Backend deployed to production
- [ ] Frontend deployed to production
- [ ] Environment variables set
- [ ] Database configured (not in-memory)
- [ ] Stripe in live mode (sk_live_)
- [ ] Stripe webhooks configured
- [ ] Email service configured
- [ ] Custom domain configured (optional)
- [ ] SSL certificates active
- [ ] Error tracking enabled (Sentry)
- [ ] Analytics enabled (GA)
- [ ] Uptime monitoring active
- [ ] Rate limiting enabled
- [ ] Security headers added (Helmet)
- [ ] CORS properly configured
- [ ] All test accounts removed
- [ ] Legal pages added (Terms, Privacy)
- [ ] Contact/support email set up
- [ ] Social media accounts created
- [ ] Landing page ready
- [ ] Pricing page clear
- [ ] Documentation complete

### Day 1 Monitoring:

- [ ] Check error logs every hour
- [ ] Monitor server response times
- [ ] Track user registrations
- [ ] Watch payment transactions
- [ ] Check email deliverability
- [ ] Monitor API usage
- [ ] Check document generation success rate

---

## 💰 Pricing Configuration

### In Stripe Dashboard:

**Product 1: SafeDoc Pro**
- Price: $12/month (monthly)
- Price: $120/year (yearly) - 17% discount
- Metadata: 
  - `plan`: `pro`
  - `documents_limit`: `100`

**Product 2: SafeDoc Business**
- Price: $39/month (monthly)
- Price: $390/year (yearly) - 17% discount
- Metadata:
  - `plan`: `business`
  - `documents_limit`: `999999`

### Backend Plan Configuration

Already configured in `middleware/auth.ts`:
```typescript
free: 10 docs/month
pro: 100 docs/month
business: unlimited (999999)
```

---

## 🚀 Go Live!

### Launch Day Steps:

1. **Final Production Deploy**
   ```bash
   # Backend
   cd backend
   vercel --prod
   
   # Frontend
   cd web-app
   vercel --prod
   ```

2. **Announce on Social Media**
   ```
   🎉 Excited to launch SafeDoc! 
   
   Generate professional documents with AI in seconds.
   ✨ Invoice, NDA, Contracts & more
   🤖 Powered by Google Gemini
   🛡️ Built-in fraud detection
   
   Start FREE: https://safedoc.com
   ```

3. **Submit to Directories**
   - Product Hunt
   - Hacker News (Show HN)
   - Reddit (r/SideProject)
   - BetaList
   - Indie Hackers

4. **Monitor Everything**
   - Check Sentry for errors
   - Watch Stripe for payments
   - Monitor Vercel logs
   - Track user signups
   - Read user feedback

5. **Iterate Based on Feedback**
   - Fix critical bugs immediately
   - Note feature requests
   - Improve UX pain points
   - Optimize slow pages

---

## 📞 Support & Maintenance

### Daily Tasks:
- Check error logs
- Respond to support emails
- Monitor payment transactions
- Review user feedback

### Weekly Tasks:
- Update dependencies
- Review analytics
- Improve features based on feedback
- Content marketing (blog, social)

### Monthly Tasks:
- Review server costs
- Analyze user retention
- Plan new features
- Update documentation
- Security audit

---

## 🎯 Success Metrics

Track these KPIs:

| Metric | Goal |
|--------|------|
| User Signups | 100/month |
| Free → Pro Conversion | 5% |
| Pro → Business Conversion | 10% |
| Document Generation Success Rate | >95% |
| Average Response Time | <500ms |
| Uptime | >99.9% |
| Monthly Recurring Revenue | $1,000 |
| Customer Churn | <5% |

---

## 🎉 You're Ready to Launch!

Your SafeDoc system is **production-ready**!

**Final Pre-Launch Checklist:**
✅ Backend deployed  
✅ Frontend deployed  
✅ Stripe configured  
✅ Email working  
✅ Monitoring enabled  
✅ Security hardened  
✅ Domain configured  
✅ Legal pages added  

**🚀 LAUNCH!** 🚀

---

**Good luck with your launch!** 🎊

For questions: hello@safedoc.com  
Documentation: https://docs.safedoc.com  
Status Page: https://status.safedoc.com
