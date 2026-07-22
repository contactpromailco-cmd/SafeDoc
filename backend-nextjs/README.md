# SafeDoc Backend - Next.js API

Complete backend for SafeDoc AI document generation platform, built with Next.js API routes for optimal Vercel deployment.

## Features

- ✅ **Authentication**: Register, login, JWT tokens
- ✅ **Document Generation**: AI-powered document creation with Gemini AI
- ✅ **AI Negotiation**: Real-time contract negotiation with AI mediator
- ✅ **Fraud Analysis**: AI-powered document fraud detection
- ✅ **Payments**: Stripe subscriptions with usage-based billing
- ✅ **Real-time**: Pusher Channels for WebSocket-like functionality
- ✅ **Webhooks**: Stripe webhook handling

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Runtime**: Node.js
- **AI**: Google Gemini AI
- **Real-time**: Pusher Channels
- **Payments**: Stripe
- **Auth**: JWT with bcrypt

## API Routes

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Documents
- `POST /api/documents/generate` - Generate AI document

### Negotiation
- `POST /api/negotiation/suggest` - Submit negotiation suggestion
- `POST /api/negotiation/accept` - Accept AI compromise

### Payments
- `POST /api/payments/create-checkout` - Create Stripe checkout
- `POST /api/payments/portal` - Access billing portal

### Analysis
- `POST /api/fraud-analysis` - Analyze document for fraud

### Webhooks
- `POST /api/webhooks/stripe` - Handle Stripe events

## Local Development

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment**:
   Copy `.env.example` to `.env.local` and add your keys:
   ```bash
   cp .env.example .env.local
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open**: http://localhost:3000

## Deploy to Vercel

### Option 1: Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Add environment variables** in Vercel dashboard:
   - `PUSHER_APP_ID`
   - `PUSHER_KEY`
   - `PUSHER_SECRET`
   - `PUSHER_CLUSTER`
   - `GEMINI_API_KEY`
   - `JWT_SECRET`
   - `STRIPE_SECRET_KEY`
   - `FRONTEND_URL`

### Option 2: Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your Git repository
3. Framework preset: **Next.js**
4. Add environment variables
5. Click **Deploy**

## Environment Variables

### Required
- `PUSHER_APP_ID` - Pusher app ID
- `PUSHER_KEY` - Pusher key
- `PUSHER_SECRET` - Pusher secret
- `PUSHER_CLUSTER` - Pusher cluster (e.g., 'eu')
- `GEMINI_API_KEY` - Google Gemini AI API key
- `JWT_SECRET` - Secret for JWT token signing
- `STRIPE_SECRET_KEY` - Stripe secret key
- `FRONTEND_URL` - Frontend URL (e.g., https://safedoc.vercel.app)

### Optional
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret
- `STRIPE_PRICE_PRO_MONTHLY` - Stripe price ID for Pro monthly
- `STRIPE_PRICE_PRO_YEARLY` - Stripe price ID for Pro yearly
- `STRIPE_PRICE_BUSINESS_MONTHLY` - Stripe price ID for Business monthly
- `STRIPE_PRICE_BUSINESS_YEARLY` - Stripe price ID for Business yearly

## Pricing Plans

- **Free**: $0/month - 10 docs + $1/doc overage
- **Pro**: $12/month - 75 docs + $0.50/doc overage
- **Business**: $39/month - Unlimited docs

## Project Structure

```
backend-nextjs/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── register/route.ts
│   │   │   │   └── login/route.ts
│   │   │   ├── documents/
│   │   │   │   └── generate/route.ts
│   │   │   ├── negotiation/
│   │   │   │   ├── suggest/route.ts
│   │   │   │   └── accept/route.ts
│   │   │   ├── payments/
│   │   │   │   ├── create-checkout/route.ts
│   │   │   │   └── portal/route.ts
│   │   │   ├── fraud-analysis/route.ts
│   │   │   └── webhooks/
│   │   │       └── stripe/route.ts
│   │   └── layout.tsx
│   └── services/
│       ├── AuthService.ts
│       ├── GeminiAI.ts
│       ├── StripeService.ts
│       └── ...
├── .env.local (local config)
├── .env.example (template)
├── next.config.ts
├── package.json
├── tsconfig.json
└── vercel.json (deployment config)
```

## License

MIT
