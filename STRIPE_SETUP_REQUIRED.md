# ⚠️ Stripe Setup Required - DO THIS NOW!

## Current Status: ❌ Subscriptions Won't Work Yet

Your Stripe key is configured, but you need to **create products in Stripe** first!

---

## 🚨 Quick Fix (5 minutes)

### Step 1: Go to Stripe Dashboard
**Open this URL**: https://dashboard.stripe.com/test/products

### Step 2: Create PRO Product

1. Click **"+ Add product"**

2. Fill in:
   ```
   Name: SafeDoc Pro
   Description: 75 AI-powered documents per month with all features
   ```

3. Under **Pricing**:
   ```
   Price: $12.00 USD
   Billing period: Monthly
   ```

4. Click **"Save product"**

5. **COPY THE PRICE ID** (looks like `price_1abc123...`)
   - It's shown under the pricing section
   - Starts with `price_`

### Step 3: Create BUSINESS Product

1. Click **"+ Add product"** again

2. Fill in:
   ```
   Name: SafeDoc Business
   Description: Unlimited AI-powered documents with advanced features
   ```

3. Under **Pricing**:
   ```
   Price: $39.00 USD
   Billing period: Monthly
   ```

4. Click **"Save product"**

5. **COPY THE PRICE ID**

### Step 4: Add Price IDs to .env

Open `backend/.env` and add these lines:

```env
# Stripe Price IDs (from dashboard)
STRIPE_PRICE_PRO_MONTHLY=price_YOUR_PRO_ID_HERE
STRIPE_PRICE_BUSINESS_MONTHLY=price_YOUR_BUSINESS_ID_HERE
```

Replace `price_YOUR_PRO_ID_HERE` with the actual price IDs you copied!

### Step 5: Restart Backend

```powershell
# Backend will restart automatically with new price IDs
```

### Step 6: Test!

1. Open http://localhost:3000/
2. Login
3. Click "Upgrade"
4. Select Pro plan
5. Should redirect to Stripe checkout! ✅

---

## 📋 Complete .env Example

Your `backend/.env` should look like this:

```env
# Pusher Configuration
PUSHER_APP_ID=2177349
PUSHER_KEY=ab96fbeb449d4f90ca68
PUSHER_SECRET=99ccf1f995f64d4765d7
PUSHER_CLUSTER=eu

# Server Configuration
PORT=8080
NODE_ENV=development

# Google Gemini AI Key
GEMINI_API_KEY=AIzaSyAb8RN6L36cr6UpeNIP287qwfvJDjbc95-pBzNdk__pfO0RQUwQAQ.Ab8RN6KS1YNZIUD_o3kPyGx9VeTvJU6gOFsiuNUpTtdLZqh94QAQ.Ab8RN6I1IbRCFb_Oka-g-a-H9qcyZY-bHhIVfojQki1L3ZDJAA

# Authentication
JWT_SECRET=b1fd9938d6982b072afc2b73f201dc9058611b8d893b641c8365b82c0602a104

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_YOUR_STRIPE_SECRET_KEY

# Stripe Price IDs (ADD THESE!)
STRIPE_PRICE_PRO_MONTHLY=price_1abc123...
STRIPE_PRICE_BUSINESS_MONTHLY=price_1def456...

# Optional - For yearly plans
# STRIPE_PRICE_PRO_YEARLY=price_1ghi789...
# STRIPE_PRICE_BUSINESS_YEARLY=price_1jkl012...

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## 🎯 Alternative: Use Manual Price Creation

If you want to skip the Stripe dashboard, I can show you how to create prices via API. But dashboard is easier!

---

## ✅ How to Know It's Working

### Before Setup:
```
Click Upgrade → Nothing happens or error
```

### After Setup:
```
Click Upgrade → Redirects to Stripe checkout page ✅
```

---

## 🚀 After You Add Price IDs

Just give me the price IDs and I'll add them to your .env file!

Example:
```
Pro Price ID: price_1QYrPaK344QKqsPwuEgVp8oR
Business Price ID: price_1QYrQhK344QKqsPwuq0nW8pW
```

Then I'll:
1. Update .env
2. Restart backend
3. Test the checkout flow
4. Confirm everything works! ✅

---

## 📺 Visual Guide

### What You'll See in Stripe Dashboard:

```
Products
├─ SafeDoc Pro
│  └─ Pricing
│     └─ $12.00 / month
│        └─ Price ID: price_1abc... ← COPY THIS!
│
└─ SafeDoc Business
   └─ Pricing
      └─ $39.00 / month
         └─ Price ID: price_1def... ← COPY THIS!
```

---

## ⏱️ Time Estimate

- Create products: 2 minutes
- Copy price IDs: 30 seconds
- Update .env: 30 seconds
- Restart backend: 10 seconds
- Test: 1 minute

**Total: ~5 minutes** 🚀

---

## 💡 Pro Tip

You can also create **yearly plans** later:
- Pro Yearly: $120/year (save $24)
- Business Yearly: $390/year (save $78)

Just create more prices in Stripe and add their IDs!

---

## ❓ Need Help?

If you get stuck, just share:
1. Screenshot of Stripe products page
2. Or copy/paste the price IDs

I'll help you set it up! 💪

---

**Do this now and subscriptions will work!** 🎉

*Current Status: Waiting for Stripe price IDs*  
*Time Required: 5 minutes*  
*Difficulty: Easy*
