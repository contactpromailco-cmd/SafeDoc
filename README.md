# 🚀 SafeDoc - AI-Powered Document Intelligence Platform

> Professional document generation, AI contract negotiation, and fraud detection powered by Google Gemini AI.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/safedoc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

### 🤖 AI Document Generation
- **Smart Templates**: Invoice, Contract, NDA, Proposal, Quote, Receipt
- **Gemini AI Powered**: Natural language to professional documents
- **Visual Preview**: Beautiful PDF-like rendering with Canvas
- **ODF Export**: Download as .odt format

### 🤝 AI Contract Negotiation
- **Two-Party System**: Real-time negotiation between parties
- **AI Mediator**: Game theory-based compromise suggestions
- **Fairness Scoring**: Algorithmic balance assessment (70-95% range)
- **Live Updates**: Pusher Channels for real-time sync

### 🔍 Fraud Detection
- **Document Analysis**: AI-powered fraud risk assessment
- **Pattern Recognition**: Suspicious language and inconsistencies
- **Threat Intelligence**: Risk scoring with recommendations
- **Confidence Metrics**: Detailed findings and verification steps

### 💳 Usage-Based Pricing
- **Free Tier**: 10 docs/month + $1/doc overage
- **Pro Tier**: 75 docs/month + $0.50/doc overage ($12/month)
- **Business Tier**: Unlimited docs ($39/month)
- **Stripe Integration**: Automated billing and webhooks

## 🏗️ Architecture

```
SafeDoc Platform
├── backend-nextjs/         → Next.js API (Vercel Serverless)
│   ├── API Routes          → Authentication, Documents, Payments
│   └── Services            → AI, Auth, Stripe, Document Generation
├── web-app/                → React Frontend (Vite)
│   ├── Components          → UI Components
│   └── Store               → State Management (Zustand)
└── site toolset/           → Marketing Website
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm or yarn
- Vercel account (for deployment)

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/safedoc.git
cd safedoc
```

### 2. Backend Setup
```bash
cd backend-nextjs
npm install
cp .env.example .env.local
# Add your API keys to .env.local
npm run dev
```

Backend runs on: http://localhost:3000

### 3. Frontend Setup
```bash
cd ../web-app
npm install
npm run dev
```

Frontend runs on: http://localhost:5173

## 🌐 Deploy to Vercel

### Option 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/safedoc)

### Option 2: Manual Deploy

#### Deploy Backend
```bash
cd backend-nextjs
npm i -g vercel
vercel login
vercel
```

Add environment variables in Vercel dashboard, then:
```bash
vercel --prod
```

#### Deploy Frontend
```bash
cd web-app
# Update API_URL in src/store/websocket-pusher.ts with your backend URL
vercel
vercel --prod
```

**See detailed deployment guide**: [`DEPLOY_NOW.md`](./DEPLOY_NOW.md)

## 🔑 Environment Variables

### Backend (Required)
```env
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_cluster
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret_min_32_chars
STRIPE_SECRET_KEY=your_stripe_secret_key
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Optional)
```env
VITE_API_URL=https://your-backend.vercel.app
```

## 📊 Tech Stack

### Backend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **AI**: Google Gemini AI
- **Real-time**: Pusher Channels
- **Payments**: Stripe
- **Auth**: JWT + bcrypt
- **Image Gen**: Node Canvas

### Frontend
- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React

### Infrastructure
- **Hosting**: Vercel (Serverless)
- **CDN**: Vercel Edge Network
- **Database**: In-memory (upgrade to PostgreSQL/MongoDB for production)

## 📁 Project Structure

```
safedoc/
├── backend-nextjs/
│   ├── src/
│   │   ├── app/api/                    # API Routes
│   │   │   ├── auth/                   # Authentication
│   │   │   ├── documents/              # Document generation
│   │   │   ├── negotiation/            # AI negotiation
│   │   │   ├── payments/               # Stripe payments
│   │   │   ├── fraud-analysis/         # Fraud detection
│   │   │   └── webhooks/               # Stripe webhooks
│   │   └── services/                   # Business logic
│   │       ├── AuthService.ts          # User auth & JWT
│   │       ├── GeminiAI.ts             # AI document generation
│   │       ├── StripeService.ts        # Payment processing
│   │       ├── InvoiceImageGenerator.ts # Visual invoices
│   │       └── ...                     # 13 total services
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
│
├── web-app/
│   ├── src/
│   │   ├── components/                 # React components
│   │   ├── pages/                      # Page components
│   │   ├── store/                      # State management
│   │   └── types/                      # TypeScript types
│   ├── public/
│   └── package.json
│
├── site toolset/                       # Marketing website
│   ├── index (1).html                  # Landing page
│   └── safedoc.html                    # Product page
│
├── DOCS/
│   ├── START_HERE.md                   # 👈 Start here!
│   ├── DEPLOYMENT_CHECKLIST.md         # Step-by-step deploy
│   ├── DEPLOY_NOW.md                   # Complete guide
│   ├── DEPLOYMENT_ARCHITECTURE.md      # Architecture diagrams
│   └── CONVERSION_COMPLETE.md          # Technical details
│
└── README.md                           # This file
```

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Documents
- `POST /api/documents/generate` - Generate AI document

### Negotiation
- `POST /api/negotiation/suggest` - Submit negotiation proposal
- `POST /api/negotiation/accept` - Accept AI compromise

### Payments
- `POST /api/payments/create-checkout` - Create Stripe checkout
- `POST /api/payments/portal` - Billing portal access

### Analysis
- `POST /api/fraud-analysis` - Analyze document for fraud

### Webhooks
- `POST /api/webhooks/stripe` - Handle Stripe events

## 💰 Pricing

| Plan | Price | Documents | Overage Cost |
|------|-------|-----------|--------------|
| **Free** | $0/month | 10/month | $1.00/doc |
| **Pro** | $12/month | 75/month | $0.50/doc |
| **Business** | $39/month | Unlimited | $0/doc |

## 🧪 Testing

### Test Backend
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123","name":"Test User"}'
```

### Test Frontend
1. Open http://localhost:5173
2. Click "Get Started"
3. Register an account
4. Generate a document
5. Try AI negotiation

## 🔒 Security

- ✅ HTTPS enforced (Vercel automatic)
- ✅ JWT authentication (stateless)
- ✅ bcrypt password hashing (12 rounds)
- ✅ Environment variables (secrets not in code)
- ✅ CORS protection
- ✅ Rate limiting (Vercel automatic)
- ✅ Input validation
- ✅ XSS protection (React escapes by default)

## 📈 Performance

- **Global CDN**: < 100ms latency worldwide
- **Serverless**: Auto-scales with traffic
- **Edge Functions**: Runs close to users
- **99.99% Uptime**: Vercel SLA

## 🐛 Troubleshooting

### Build Fails
- Check environment variables in Vercel dashboard
- View build logs for specific errors
- Ensure all dependencies in package.json

### Frontend Can't Connect
- Verify API_URL in `web-app/src/store/websocket-pusher.ts`
- Check browser console for CORS errors
- Ensure backend URL has no trailing slash

### Pusher Not Working
- Verify Pusher credentials in backend env vars
- Check cluster setting (must match Pusher dashboard)
- View Pusher dashboard for connection logs

### Stripe Issues
- Use test mode keys during development
- Check Stripe dashboard for error logs
- Verify webhook secret for production

## 📚 Documentation

- **Quick Start**: [START_HERE.md](./START_HERE.md)
- **Deployment**: [DEPLOY_NOW.md](./DEPLOY_NOW.md)
- **Architecture**: [DEPLOYMENT_ARCHITECTURE.md](./DEPLOYMENT_ARCHITECTURE.md)
- **Backend API**: [backend-nextjs/README.md](./backend-nextjs/README.md)
- **Checklist**: [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](./LICENSE) file for details

## 🙏 Acknowledgments

- **Google Gemini AI** - Document generation and analysis
- **Pusher** - Real-time WebSocket infrastructure
- **Stripe** - Payment processing
- **Vercel** - Deployment and hosting
- **Next.js** - Backend framework
- **React** - Frontend framework

## 📞 Support

- **Documentation**: See `/DOCS` folder
- **Issues**: [GitHub Issues](https://github.com/yourusername/safedoc/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/safedoc/discussions)

## 🗺️ Roadmap

- [ ] PostgreSQL/MongoDB integration
- [ ] Multi-tenant support
- [ ] Template marketplace
- [ ] Email notifications
- [ ] API rate limiting per user
- [ ] Document version history
- [ ] Collaborative editing
- [ ] Mobile app (React Native)

## ⭐ Star History

If you find this project useful, please consider giving it a star! ⭐

---

**Built with ❤️ by [Your Name]**

[Live Demo](https://safedoc.vercel.app) • [Documentation](./START_HERE.md) • [Report Bug](https://github.com/yourusername/safedoc/issues)
