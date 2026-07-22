# ⚡ QUICK TEST - 5 Minutes

## 🚀 START SERVERS

### Terminal 1 - Backend:
```bash
cd backend
npm run dev
```
Wait for: `🚀 Server running on port 8080`

### Terminal 2 - Frontend:
```bash
cd web-app
npm run dev
```
Wait for: `➜  Local:   http://localhost:3000/`

---

## 🧪 TEST IN 5 MINUTES

### 1. Open Browser (2 min)
1. Go to: **http://localhost:3000**
2. Click **"🔓 Sign In"** → **"Sign Up"** tab
3. Create account:
   - Name: `Test User`
   - Email: `test@test.com`
   - Password: `test123`
4. Click **"Create Account"**

✅ You should be logged in and see "Welcome back, Test User!"

---

### 2. Test Voice Feature (1 min)
**⚠️ Use Chrome or Edge browser!**

1. Scroll to purple **"Voice-to-Document"** section
2. Click **"Start Speaking"**
3. Say loudly: 
   ```
   "Create an invoice for John Smith for one thousand dollars"
   ```
4. Wait 10 seconds

✅ Document should appear with invoice for John Smith ($1,000)

---

### 3. Test Snap & Generate (1 min)
1. Scroll to cyan **"Snap & Generate"** section
2. Click **"Upload Image"** (🖼️)
3. Upload ANY image file from your computer
4. Wait 10 seconds

✅ Should create a digitized document from the image

---

### 4. Test Standard Template (1 min)
1. Scroll up to template grid
2. Click **Invoice** card (💰)
3. Fill quick data:
   - Client Name: `ABC Corp`
   - Items: `Web Design`
   - Quantities: `1`
   - Prices: `500`
4. Click **"✨ Generate with AI"**

✅ Professional invoice appears in ~10 seconds
✅ Click **"📥 Download PNG"** to save

---

### 5. Check Smart Features (30 sec)
1. Scroll to emerald **"Smart Contract Chains"**
   - ✅ Should show suggestion based on last document
2. Scroll to rose **"Smart Templates with Memory"**
   - ✅ Shows "AI Learned Your Patterns" (after 2+ docs)

---

## 🎯 DONE!

If all 5 tests passed:
- ✅ Voice works
- ✅ Image processing works
- ✅ Document generation works
- ✅ Smart features work
- ✅ Download works

**Everything is functional! 🚀**

---

## 🐛 IF SOMETHING FAILS

### Voice doesn't work:
- Are you using Chrome/Edge?
- Did you allow microphone permission?
- Check browser console for errors

### Backend errors:
```bash
# Check if Gemini API key is set
cd backend
cat .env | findstr GEMINI
```

### Frontend errors:
- Check browser console (F12)
- Look for red error messages
- Verify backend is running on port 8080

---

## 📞 Quick Debug Commands

### Check if backend is running:
```bash
curl http://localhost:8080/health
```
Should return: `{"status":"healthy"}`

### Check if frontend is accessible:
Open: http://localhost:3000
Should show SafeDoc AI interface

### Restart everything:
```bash
# Stop both terminals (Ctrl+C)
# Then restart both servers again
```

---

## ✅ SUCCESS INDICATORS

**Backend Console Shows:**
```
✨ Gemini AI initialized
🚀 Server running on port 8080
📡 Pusher configured
🤖 AI Generating document: invoice
✅ Document generated: [id]
```

**Frontend Shows:**
- Purple, cyan, emerald, amber, rose sections visible
- All template cards display
- Header shows user name and usage
- Documents generate and preview

**Browser Console (F12):**
- No red error messages
- API calls succeed (200 status)
- WebSocket/Pusher connected

---

## 🎉 ALL DONE!

Your SafeDoc AI is fully functional with:
- 🎤 Voice-to-Document
- 📸 Snap & Generate
- 🔗 Smart Contract Chains
- 🤝 Collaborative Negotiation
- 🧠 Smart Templates with Memory

**Ready to destroy competitors! 💪**
