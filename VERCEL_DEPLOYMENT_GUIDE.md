# 🚀 Vercel Deployment Guide

## Prerequisites
✅ Vercel CLI installed
✅ Vercel account (free) - https://vercel.com/signup

---

## 🎯 Quick Deployment (3 Projects)

You'll deploy **3 separate Vercel projects**:

1. **Toolset Labs Site** (Static HTML)
2. **SafeDoc Backend** (Node.js API)
3. **SafeDoc Frontend** (React + Vite)

---

## 📦 Option 1: Deploy via Vercel Dashboard (Easiest)

### A. Deploy Toolset Labs Site

1. Go to https://vercel.com/new
2. Click "Import Git Repository" OR "Add New... > Project"
3. Choose "Import from folder" or connect GitHub
4. Select `site toolset` folder
5. Settings:
   - **Framework Preset**: Other
   - **Root Directory**: `site toolset`
   - **Build Command**: (leave empty)
   - **Output Directory**: (leave empty)
6. Click **Deploy**
7. ✅ Your site will be live at: `https://toolset-labs-xxx.vercel.app`

### B. Deploy SafeDoc Backend

1. Go to https://vercel.com/new
2. Select `backend` folder
3. Settings:
   - **Framework Preset**: Other
   - **Root Directory**: `backend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:
   - `PUSHER_APP_ID` = 2177349
   - `PUSHER_KEY` = ab96fbeb449d4f90ca68
   - `PUSHER_SECRET` = 99ccf1f995f64d4765d7
   - `PUSHER_CLUSTER` = eu
   - `GEMINI_API_KEY` = (your key)
   - `JWT_SECRET` = (your secret)
   - `STRIPE_SECRET_KEY` = (your key)
5. Click **Deploy**
6. ✅ Backend will be live at: `https://safedoc-backend-xxx.vercel.app`
7. **COPY THIS URL** - you'll need it for the frontend

### C. Deploy SafeDoc Frontend

1. Go to https://vercel.com/new
2. Select `web-app` folder
3. Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `web-app`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:
   - `VITE_PUSHER_KEY` = ab96fbeb449d4f90ca68
   - `VITE_PUSHER_CLUSTER` = eu
   - `VITE_API_URL` = `https://safedoc-backend-xxx.vercel.app` (use URL from step B)
5. Click **Deploy**
6. ✅ Frontend will be live at: `https://safedoc-ai-xxx.vercel.app`

---

## 🖥️ Option 2: Deploy via CLI (Advanced)

### 1. Deploy Toolset Labs Site

```bash
cd "c:\Users\Surface\Desktop\business\doc tool\site toolset"
vercel --prod
```

### 2. Deploy SafeDoc Backend

```bash
cd "c:\Users\Surface\Desktop\business\doc tool\backend"
npm run build
vercel --prod
```

**Copy the deployment URL**, then add environment variables:
```bash
vercel env add PUSHER_APP_ID production
vercel env add PUSHER_KEY production
vercel env add PUSHER_SECRET production
vercel env add PUSHER_CLUSTER production
vercel env add GEMINI_API_KEY production
vercel env add JWT_SECRET production
vercel env add STRIPE_SECRET_KEY production
```

### 3. Deploy SafeDoc Frontend

First, update the API URL in `web-app/vercel.json` with your backend URL from step 2.

```bash
cd "c:\Users\Surface\Desktop\business\doc tool\web-app"
npm run build
vercel --prod
```

---

## 🔗 Update Links After Deployment

### 1. Update Toolset Labs site links

In `site toolset/index (1).html` and `site toolset/safedoc.html`:

**Find and replace:**
- `http://localhost:3000` → `https://safedoc-ai-xxx.vercel.app` (your frontend URL)

### 2. Update Frontend API URL

In `web-app/src/store/websocket-pusher.ts`:

**Replace:**
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8081';
```

**With:**
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'https://safedoc-backend-xxx.vercel.app';
```

Then rebuild and redeploy:
```bash
cd web-app
npm run build
vercel --prod
```

---

## 🎯 Final URLs

After deployment, you'll have:

1. **Toolset Labs**: `https://toolset-labs-xxx.vercel.app`
   - Main portfolio site
   - Shows all your products including SafeDoc

2. **SafeDoc Backend**: `https://safedoc-backend-xxx.vercel.app`
   - API endpoints
   - Handles document generation, auth, payments

3. **SafeDoc Frontend**: `https://safedoc-ai-xxx.vercel.app`
   - Main app users interact with
   - Document generation interface

---

## 🔧 Common Issues & Solutions

### Issue: Backend timeout on Vercel
**Solution**: Vercel free tier has 10-second timeout. Use Vercel Pro or deploy backend to Railway/Render.

### Issue: CORS errors
**Solution**: Add frontend URL to backend CORS allowlist in `backend/src/index-pusher.ts`:
```typescript
app.use(cors({
  origin: ['https://safedoc-ai-xxx.vercel.app', 'http://localhost:3000']
}));
```

### Issue: Environment variables not working
**Solution**: Redeploy after adding env vars, or use `vercel env pull`.

### Issue: Build fails
**Solution**: Check Node.js version in Vercel settings (use Node 18).

---

## 💡 Pro Tips

1. **Custom Domains**: Add your own domain in Vercel dashboard
   - Settings → Domains → Add Domain
   - Example: `toolset-labs.com`, `safedoc.ai`

2. **Auto-Deploy**: Connect to GitHub for automatic deployments on push

3. **Preview Deployments**: Every git branch gets its own preview URL

4. **Analytics**: Enable Vercel Analytics for free traffic insights

5. **Functions**: Backend runs as Vercel Serverless Functions (cold starts possible)

---

## ✅ Deployment Checklist

- [ ] Create Vercel account
- [ ] Deploy Toolset Labs site
- [ ] Deploy SafeDoc backend
- [ ] Copy backend URL
- [ ] Update frontend env vars with backend URL
- [ ] Deploy SafeDoc frontend
- [ ] Update Toolset Labs site with frontend URL
- [ ] Redeploy Toolset Labs site
- [ ] Test all links work
- [ ] Test document generation works
- [ ] Test authentication works
- [ ] Test Stripe payments work

---

## 🆘 Need Help?

**Vercel Docs**: https://vercel.com/docs
**Support**: https://vercel.com/support

**Or just ask me!** I can help debug any deployment issues.

---

## 🚀 Ready to Deploy?

**Recommended: Start with Option 1 (Vercel Dashboard)**

It's the easiest way and gives you a visual interface to manage everything!

Just run this to open Vercel:
```bash
start https://vercel.com/new
```
