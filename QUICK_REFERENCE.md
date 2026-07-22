# 🚀 SafeDoc - Quick Reference Card

## ⚡ START HERE

### Your URLs:
- **Frontend**: http://localhost:3000/
- **Backend**: http://localhost:8080/

### Current Status:
✅ Backend running (Terminal 1)  
✅ Frontend running (Terminal 2)  
✅ Usage-based pricing active  
✅ Authentication enabled  
✅ Ready to use!

---

## 💰 Pricing at a Glance

| Plan | Price | Included | Overage | Key Features |
|------|-------|----------|---------|--------------|
| **Free** | $0/mo | 10 docs | $1.00/doc | 2 themes, branding |
| **Pro** | $12/mo | 75 docs | $0.50/doc | 4 themes, no branding |
| **Business** | $39/mo | Unlimited | None | Email, fraud detection, teams |

---

## 🎯 Quick Test Scenarios

### Test 1: Register & First Doc (2 min)
```
1. Open http://localhost:3000/
2. Click "Sign In" → "Create Account"
3. Email: test@example.com, Password: password123
4. Click "Invoice" template
5. Fill any details → Generate
6. Download PNG!
```

### Test 2: Test Overage (5 min)
```
1. Login as free user
2. Generate 10 documents (any type)
3. Header shows: "10/10"
4. Generate 11th document
5. Alert: "Additional charge: $1.00"
6. Header shows: "11/10 +1 ($1.00)"
7. Continue generating → see costs accumulate!
```

### Test 3: Test All Themes (3 min)
```
1. Click "Invoice"
2. Fill same details
3. Generate with "Professional" theme
4. Download
5. Repeat with "Modern", "Creative", "Minimal"
6. Compare - all look different!
```

---

## 🔑 Default Credentials

**No default credentials - create your own!**

```
Email: anything@example.com
Password: password123 (min 8 chars)
```

Every registration starts with FREE plan (10 docs/month)

---

## 📊 Feature Comparison

### Document Types (All Plans):
- 💰 Invoice (specialized layout)
- 🔒 NDA (legal template)
- 📋 Contract (service agreement)
- 💼 Proposal (business pitch)
- 🧾 Receipt (payment confirmation)
- 💭 Quote (price estimation)
- ✨ AI Custom (generate any document)

### Themes (Pro+):
- **Professional** - Corporate blue, formal
- **Modern** - Vibrant colors, contemporary
- **Creative** - Bold gradients, artistic
- **Minimal** - Clean, simple, elegant

### Advanced Features (Business):
- 📧 Email auto-send to clients
- 🛡️ Fraud detection (6 forensic layers)
- 📊 Version history
- 📈 Document analytics
- 🤖 Smart AI suggestions
- 👥 3 team member seats
- 🔧 API access

---

## 💡 How Overage Works

### Free Plan Example:
```
Month 1:
├─ Generate 10 docs → $0 (included)
├─ Generate 11th doc → +$1.00 overage
├─ Generate 12th doc → +$1.00 overage
└─ Total: $2.00 billed end of month

Header shows: 12/10 +2 ($2.00)
```

### Pro Plan Example:
```
Month 1:
├─ Generate 75 docs → $12 (included)
├─ Generate 76th doc → +$0.50 overage
├─ Generate 80th doc → +$0.50 overage
└─ Total: $12 + $2.50 = $14.50

Header shows: 80/75 +5 ($2.50)
```

### Business Plan:
```
Generate unlimited → $39 flat
No overages ever!

Header shows: 500/∞
```

---

## 🛠️ Common Commands

### Restart Backend:
```powershell
cd backend
node dist/index-pusher.js
```

### Restart Frontend:
```powershell
cd web-app
npm run dev
```

### Rebuild Backend (after code changes):
```powershell
cd backend
npm run build
node dist/index-pusher.js
```

### Check Ports:
```powershell
netstat -ano | findstr :8080
netstat -ano | findstr :3000
```

---

## 🐛 Troubleshooting

### "Failed to fetch" errors
**Fix**: Backend not running
```powershell
cd backend
node dist/index-pusher.js
```

### "Cannot connect to server"
**Fix**: Check backend logs (Terminal 1)
- Verify Gemini API key in .env
- Check Pusher credentials

### Documents not generating
**Fix**: Check backend console for AI errors
- Verify GEMINI_API_KEY is set
- Check API quota not exceeded

### Login not working
**Fix**: Token expired or invalid
- Just login again (token lasts 7 days)
- Check JWT_SECRET in backend/.env

### Port already in use
**Fix**: Kill existing process
```powershell
# Find process on port 8080
Get-NetTCPConnection -LocalPort 8080 | Select -ExpandProperty OwningProcess

# Kill it
Stop-Process -Id <PID> -Force
```

---

## 📁 Important Files

### Configuration:
- `backend/.env` - API keys, secrets
- `backend/src/index-pusher.ts` - Main server
- `backend/src/services/AuthService.ts` - User management

### Frontend:
- `web-app/src/pages/Workspace.tsx` - Main UI
- `web-app/src/contexts/AuthContext.tsx` - Auth state
- `web-app/src/components/PricingModal.tsx` - Plans

### Documentation:
- `USAGE_BASED_PRICING_COMPLETE.md` - Pricing details
- `FRONTEND_AUTH_COMPLETE.md` - Auth system
- `TESTING_GUIDE.md` - Test scenarios
- `SYSTEM_STATUS.md` - Current status

---

## 🎨 UI Cheat Sheet

### Header Elements:
```
[SafeDoc AI] [●Live] [PRO 45/75] [⚡Upgrade] [⚙️] [🚪]
                      ↑           ↑           ↑    ↑
                    usage      upgrade    settings logout
```

### With Overage:
```
[PRO 78/75 +3 ($1.50)]
     ↑  ↑  ↑     ↑
  used limit overage cost
```

### Template Cards:
Click any card → Fill form → Select theme → Generate!

### Modals:
- **Auth Modal**: Login/Register
- **Pricing Modal**: View/Upgrade plans
- **Settings Modal**: Company logo/details
- **Preview Modal**: View/Download document

---

## 💳 Stripe Setup (Optional)

To enable real payments:

1. Get Stripe keys from https://dashboard.stripe.com/test/apikeys

2. Add to `backend/.env`:
```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

3. Create products in Stripe:
   - Pro: $12/month
   - Business: $39/month

4. Test with card: 4242 4242 4242 4242

---

## 📧 Email Setup (Optional)

To enable email auto-send:

1. Create Gmail app password:
   - Enable 2FA on Gmail
   - Generate app password

2. Add to `backend/.env`:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

3. Restart backend

4. Enable "Send via email" when generating docs!

---

## 🎯 Revenue Calculator

### Example: 100 Users

**Scenario 1: No Overages**
- 60 Free = $0
- 30 Pro = $360
- 10 Business = $390
- **Total: $750/month**

**Scenario 2: With Overages**
- 60 Free (avg 12 docs) = $0 + (60 × 2 × $1) = $120
- 30 Pro (avg 80 docs) = $360 + (30 × 5 × $0.50) = $435
- 10 Business = $390
- **Total: $945/month** (+$195 from overages!)

**Annual Revenue: $11,340**

---

## 🚀 Growth Strategy

### Month 1-3: Free Users
- Get 1000 free users
- Let them hit limits
- Show value proposition

### Month 4-6: Convert to Pro
- 10% convert = 100 Pro users
- $1,200/month revenue
- Add features based on feedback

### Month 7-12: Scale to Business
- Agencies discover you
- 20 Business users = $780/month
- Enterprise features

### Year 2: Scale
- 5,000 users total
- 500 Pro, 50 Business
- $6,000 + $1,950 = $7,950/month
- **$95,400/year!**

---

## ✅ Pre-Launch Checklist

Before going live:

### Must Have:
- [ ] Add Stripe keys (enable payments)
- [ ] Set production API URL in frontend
- [ ] Use HTTPS (not HTTP)
- [ ] Add real database (not in-memory)
- [ ] Set strong JWT_SECRET
- [ ] Configure email service

### Should Have:
- [ ] Error monitoring (Sentry)
- [ ] Analytics (Google Analytics)
- [ ] Rate limiting
- [ ] CDN for assets
- [ ] Backup system

### Nice to Have:
- [ ] Password reset flow
- [ ] Email verification
- [ ] User profile editing
- [ ] Team management
- [ ] Document templates library
- [ ] Mobile app

---

## 🎉 You're All Set!

**Everything is working and ready to use!**

### Start Testing:
1. Open http://localhost:3000/
2. Create account
3. Generate documents
4. Test overage charges
5. Try all themes
6. Upload company logo
7. Test fraud detection

### Next Steps:
1. Add Stripe keys for payments
2. Configure email for auto-send
3. Test with real users
4. Gather feedback
5. Launch! 🚀

---

**Quick Support:**
- Check Terminal 1 (backend logs)
- Check Terminal 2 (frontend logs)
- Read error messages carefully
- Most issues = API keys not set

**You Got This!** 💪

---

*Last Updated: Now*  
*System: OPERATIONAL ✅*  
*Ready: 100%*  
*Let's make money! 💰*
