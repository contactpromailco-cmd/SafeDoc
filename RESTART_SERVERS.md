# 🔄 RESTART SERVERS - Fix 404 Errors

## The Problem
The negotiation endpoints are in the code but returning 404. This happens because:
- Backend needs to reload the new code
- TypeScript needs to recompile

## ✅ SOLUTION - Restart Backend

### Step 1: Stop Backend Server
In the terminal running backend:
1. Press **Ctrl + C** to stop the server
2. Wait for it to fully stop

### Step 2: Restart Backend
```bash
cd backend
npm run dev
```

### Step 3: Verify Backend Started
You should see:
```
✨ Gemini AI initialized
🚀 Server running on port 8080
📡 Pusher configured: app_id=2177349, cluster=eu
```

### Step 4: Test Negotiation
1. Go to browser: http://localhost:3000
2. Login if needed
3. Scroll to amber **"Collaborative Negotiation Mode"** section
4. Click **"🤝 Start Negotiation Session"**
5. Type: `"Payment within 45 days"`
6. Click **"📤 Send"**

**Expected Result:**
- AI Mediator responds with compromise
- Fairness score displayed
- "Accept This Compromise" button appears

---

## 🔍 VERIFY ENDPOINTS EXIST

After backend restarts, test in a new terminal:

```bash
curl http://localhost:8080/health
```

Should return: `{"status":"healthy","timestamp":...}`

---

## 🐛 TROUBLESHOOTING

### Backend won't start?
**Error: Port already in use**
```bash
# Find what's using port 8080
netstat -ano | findstr :8080

# Kill that process (replace PID with actual number)
taskkill /PID <PID> /F

# Then restart backend
cd backend
npm run dev
```

### Still getting 404?
Check backend console for errors:
- Look for red error messages
- Check if routes are being registered
- Verify no syntax errors

### TypeScript errors?
```bash
cd backend
npx tsc --noEmit
```

This will show any compilation errors.

---

## ✅ QUICK TEST CHECKLIST

After restart, test these endpoints:

1. **Health Check** ✅
   ```bash
   curl http://localhost:8080/health
   ```

2. **Negotiation Suggest** ✅
   ```bash
   curl -X POST http://localhost:8080/api/negotiation/suggest \
     -H "Content-Type: application/json" \
     -d "{\"sessionId\":\"test-123\",\"party\":\"A\",\"suggestion\":\"Payment in 30 days\",\"partyName\":\"Test User\"}"
   ```
   
   Should return JSON with AI suggestion

3. **Document Generate** ✅
   (Requires auth token - test via UI)

---

## 🚀 THAT'S IT!

Once backend restarts:
- ✅ All 5 killer features will work
- ✅ Negotiation mode will be live
- ✅ No more 404 errors

**Just restart the backend server!** 🎉
