# 🏗️ SafeDoc Deployment Architecture

## Current State: LOCAL

```
┌─────────────────────────────────────────────────────────────────┐
│                         YOUR COMPUTER                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────┐              ┌──────────────────┐        │
│  │   Frontend       │              │   Backend        │        │
│  │   (Vite React)   │ ───────────► │   (Express)      │        │
│  │   Port 3000      │   HTTP/WS    │   Port 8081      │        │
│  └──────────────────┘              └──────────────────┘        │
│                                              │                  │
│                                              │                  │
│                                              ▼                  │
│                                     ┌─────────────────┐         │
│                                     │   Services      │         │
│                                     │  - Gemini AI    │         │
│                                     │  - Pusher       │         │
│                                     │  - Stripe       │         │
│                                     └─────────────────┘         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Limitations:**
- ❌ Only accessible on your computer
- ❌ No uptime when computer is off
- ❌ No scalability
- ❌ Not production-ready

---

## Target State: VERCEL DEPLOYMENT

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              INTERNET (GLOBAL)                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │
            ┌───────────────────────┴───────────────────────┐
            │                                               │
            ▼                                               ▼
┌───────────────────────┐                     ┌───────────────────────┐
│   VERCEL FRONTEND     │                     │   VERCEL BACKEND      │
│   (React + Vite)      │                     │   (Next.js API)       │
├───────────────────────┤                     ├───────────────────────┤
│ URL:                  │                     │ URL:                  │
│ safedoc.vercel.app    │◄────── HTTP ───────►│ safedoc-backend       │
│                       │                     │   .vercel.app         │
│ Features:             │                     │                       │
│ • Auth UI             │                     │ API Routes:           │
│ • Document Gen UI     │                     │ • /api/auth/*         │
│ • Negotiation UI      │                     │ • /api/documents/*    │
│ • Fraud Detection UI  │                     │ • /api/negotiation/*  │
│ • Pricing Page        │                     │ • /api/payments/*     │
│                       │                     │ • /api/fraud-analysis │
│ Built with:           │                     │ • /api/webhooks/*     │
│ • React 18            │                     │                       │
│ • TypeScript          │                     │ Built with:           │
│ • Tailwind CSS        │                     │ • Next.js 16          │
│ • Zustand             │                     │ • TypeScript          │
│ • Recharts            │                     │ • Serverless Funcs    │
│                       │                     │                       │
│ Deployment:           │                     │ Deployment:           │
│ • Static files        │                     │ • Edge Functions      │
│ • Global CDN          │                     │ • Auto-scaling        │
│ • HTTPS               │                     │ • HTTPS               │
└───────────────────────┘                     └───────────┬───────────┘
            │                                             │
            │                                             │
            └─────────────────────┬───────────────────────┘
                                  │
                                  │
            ┌─────────────────────┴───────────────────────────────┐
            │                                                     │
            ▼                          ▼                          ▼
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│   PUSHER             │  │   GEMINI AI          │  │   STRIPE             │
│   (Real-time)        │  │   (Document Gen)     │  │   (Payments)         │
├──────────────────────┤  ├──────────────────────┤  ├──────────────────────┤
│ • WebSocket          │  │ • AI Generation      │  │ • Subscriptions      │
│ • Notifications      │  │ • Contract Analysis  │  │ • Usage Billing      │
│ • Live Updates       │  │ • Fraud Detection    │  │ • Webhooks           │
│                      │  │ • Negotiation AI     │  │ • Payment Processing │
│ Cluster: EU          │  │ Model: Gemini Pro    │  │ Mode: Test           │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
```

**Benefits:**
- ✅ Accessible from anywhere globally
- ✅ 99.99% uptime
- ✅ Auto-scales with traffic
- ✅ Production-ready
- ✅ Fast (edge network)
- ✅ Secure (HTTPS by default)

---

## Data Flow: User Registration

```
┌─────────┐                ┌──────────┐                ┌──────────┐
│  User   │                │ Frontend │                │ Backend  │
│ Browser │                │  Vercel  │                │  Vercel  │
└────┬────┘                └────┬─────┘                └────┬─────┘
     │                          │                           │
     │  1. Fill registration    │                           │
     │     form                 │                           │
     ├─────────────────────────►│                           │
     │                          │                           │
     │                          │  2. POST /api/auth/       │
     │                          │     register              │
     │                          ├──────────────────────────►│
     │                          │                           │
     │                          │                           │ 3. Hash password
     │                          │                           │    (bcrypt)
     │                          │                           │
     │                          │                           │ 4. Store user
     │                          │                           │    (in-memory)
     │                          │                           │
     │                          │                           │ 5. Generate JWT
     │                          │                           │
     │                          │  6. Return token +        │
     │                          │     user data             │
     │                          │◄──────────────────────────┤
     │                          │                           │
     │  7. Store token in       │                           │
     │     localStorage         │                           │
     │◄─────────────────────────┤                           │
     │                          │                           │
     │  8. Redirect to          │                           │
     │     dashboard            │                           │
     │◄─────────────────────────┤                           │
     │                          │                           │
```

---

## Data Flow: AI Document Generation

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  User   │    │ Frontend │    │ Backend  │    │ Gemini   │    │ Pusher   │
│ Browser │    │  Vercel  │    │  Vercel  │    │   AI     │    │ Channel  │
└────┬────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘    └────┬─────┘
     │              │               │               │               │
     │ Fill form    │               │               │               │
     ├─────────────►│               │               │               │
     │              │               │               │               │
     │              │ POST /api/    │               │               │
     │              │ documents/    │               │               │
     │              │ generate      │               │               │
     │              ├──────────────►│               │               │
     │              │               │               │               │
     │              │               │ Send prompt   │               │
     │              │               ├──────────────►│               │
     │              │               │               │               │
     │              │               │               │ Generate AI   │
     │              │               │               │ content       │
     │              │               │               │               │
     │              │               │ Return doc    │               │
     │              │               │◄──────────────┤               │
     │              │               │               │               │
     │              │               │ Broadcast     │               │
     │              │               │ via Pusher    │               │
     │              │               ├───────────────────────────────►│
     │              │               │               │               │
     │              │ Return        │               │               │ Real-time
     │              │ document      │               │               │ update
     │              │◄──────────────┤               │               │
     │              │               │               │               ├────┐
     │ Display doc  │               │               │               │    │
     │◄─────────────┤               │               │               │    │
     │              │               │               │               │◄───┘
     │              │               │               │               │
```

---

## Infrastructure Comparison

### Before (Local Express)

```
Single Server (Your Computer)
├── Express.js (1 process)
├── WebSocket Server (1 instance)
├── Port 8081
└── No redundancy

Issues:
- Single point of failure
- No auto-scaling
- Manual deployment
- Downtime during updates
```

### After (Vercel Serverless)

```
Global Edge Network
├── Function per API route
│   ├── /api/auth/login → Serverless Function
│   ├── /api/documents/generate → Serverless Function
│   └── /api/negotiation/suggest → Serverless Function
├── Auto-scaling
├── Zero-downtime deploys
├── Automatic rollbacks
└── Global CDN

Benefits:
- Infinite scalability
- Pay only for usage
- 99.99% uptime
- Instant global distribution
```

---

## Deployment Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                   DEVELOPMENT (Your Computer)                   │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 │ git push
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   GITHUB (Optional)                             │
│                   Version Control                               │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 │ webhook
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   VERCEL BUILD                                  │
│                   1. Install dependencies                       │
│                   2. Run 'npm run build'                        │
│                   3. Optimize assets                            │
│                   4. Generate functions                         │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 │ deploy
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   VERCEL EDGE NETWORK                           │
│                   Global Distribution                           │
│                                                                 │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   │
│   │   USA    │   │  Europe  │   │   Asia   │   │  Others  │   │
│   │  (East)  │   │   (EU)   │   │  (SG)    │   │  (SYD)   │   │
│   └──────────┘   └──────────┘   └──────────┘   └──────────┘   │
│                                                                 │
│   All regions serve your app with < 50ms latency               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Cost Breakdown (Vercel Free Tier)

```
┌────────────────────────────────────────────────────────────┐
│  Vercel Free Tier Limits                                   │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ✅ Bandwidth: 100 GB/month                                │
│     → ~300,000 page loads                                 │
│                                                            │
│  ✅ Function Invocations: 1,000/day                        │
│     → ~30,000/month                                       │
│                                                            │
│  ✅ Build Time: 6,000 minutes/month                        │
│     → ~200 builds                                         │
│                                                            │
│  ✅ Deployments: Unlimited                                 │
│                                                            │
│  ✅ Projects: Unlimited                                    │
│                                                            │
│  ✅ HTTPS: Free & Automatic                                │
│                                                            │
│  ✅ Custom Domains: Unlimited                              │
│                                                            │
└────────────────────────────────────────────────────────────┘

Cost for 1000 users/month:
- Vercel: $0 (within free tier)
- Pusher: $0 (200K messages/day free)
- Gemini: ~$5 (pay-per-use)
- Stripe: Only on revenue (2.9% + 30¢)

Total: ~$5/month 🎉
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                      USER REQUEST                               │
└────────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   Vercel Edge Network   │
                    │   • HTTPS Only          │
                    │   • DDoS Protection     │
                    │   • Rate Limiting       │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   Next.js Middleware    │
                    │   • CORS Headers        │
                    │   • Security Headers    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   JWT Authentication    │
                    │   • Token Verification  │
                    │   • User Authorization  │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   API Route Handler     │
                    │   • Input Validation    │
                    │   • Business Logic      │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │   Response              │
                    │   • Sanitized Output    │
                    │   • No Secrets Exposed  │
                    └─────────────────────────┘

Security Features:
✅ HTTPS enforced (no HTTP)
✅ JWT tokens (stateless auth)
✅ bcrypt password hashing (12 rounds)
✅ Environment variables (secrets not in code)
✅ CORS protection
✅ Rate limiting (Vercel automatic)
✅ Input validation
✅ SQL injection protection (no SQL)
✅ XSS protection (React escapes by default)
```

---

## Monitoring & Observability

```
┌─────────────────────────────────────────────────────────────────┐
│                   VERCEL DASHBOARD                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  📊 Analytics                                                   │
│     ├─ Page views                                              │
│     ├─ Unique visitors                                         │
│     ├─ Top pages                                               │
│     └─ Geographic distribution                                 │
│                                                                 │
│  ⚡ Functions                                                   │
│     ├─ Invocation count                                        │
│     ├─ Execution time                                          │
│     ├─ Error rate                                              │
│     └─ Success rate                                            │
│                                                                 │
│  📝 Logs                                                        │
│     ├─ Real-time function logs                                 │
│     ├─ Build logs                                              │
│     ├─ Error tracking                                          │
│     └─ Request/response logs                                   │
│                                                                 │
│  🚀 Deployments                                                │
│     ├─ Deploy history                                          │
│     ├─ Build status                                            │
│     ├─ Rollback capability                                     │
│     └─ Preview deployments                                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Ready to Deploy?

Follow the step-by-step guide in: **`DEPLOY_NOW.md`**

```bash
cd backend-nextjs
vercel
```

That's it! 🚀
