# 🧪 TESTING GUIDE - SafeDoc AI

## Quick Start Testing

### 1️⃣ Start the Backend
```bash
cd backend
npm install
npm run dev
```

**Expected output:**
```
✨ Gemini AI initialized
🚀 Server running on port 8080
📡 Pusher configured: app_id=2177349, cluster=eu
💰 Automated billing cron job scheduled
```

### 2️⃣ Start the Frontend
Open a new terminal:
```bash
cd web-app
npm install
npm run dev
```

**Expected output:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

### 3️⃣ Open Browser
Navigate to: **http://localhost:3000**

---

## 🔐 AUTHENTICATION TESTING

### Test 1: Register New User
1. Click **"🔓 Sign In"** button in header
2. Click **"Sign Up"** tab
3. Fill in:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
4. Click **"Create Account"**

**Expected Result:**
- ✅ Account created successfully
- ✅ Automatically logged in
- ✅ Header shows: "Welcome back, Test User! 👋"
- ✅ Shows "0/10 documents" (Free plan)

### Test 2: Logout and Login
1. Click 🚪 logout icon in header
2. Click **"🔓 Sign In"** again
3. Enter email and password
4. Click **"Sign In"**

**Expected Result:**
- ✅ Successfully logged in
- ✅ User data persists

---

## 🎤 FEATURE #1: VOICE-TO-DOCUMENT TESTING

### Prerequisites:
- ⚠️ **Must use Chrome or Edge browser** (Firefox doesn't support Web Speech API well)
- ⚠️ **Allow microphone access** when prompted

### Test 1: Create Invoice with Voice
1. Scroll to purple **"Voice-to-Document"** section
2. Click **"Start Speaking"** button
3. When microphone activates, say clearly:
   ```
   "Create an invoice for John Doe for five hundred dollars for web design services"
   ```
4. Wait for processing

**Expected Result:**
- ✅ Button shows "Listening..." with red pulsing effect
- ✅ Transcript appears: "Create an invoice for John Doe..."
- ✅ Button changes to "Creating Document..."
- ✅ Document preview modal opens within 5-10 seconds
- ✅ Invoice generated with AI-extracted details
- ✅ Document usage increments (1/10)

### Test 2: Voice - Create Contract
Say:
```
"I need a contract with Acme Corporation for software development worth ten thousand dollars"
```

**Expected Result:**
- ✅ Contract document generated
- ✅ Contains "Acme Corporation" and "$10,000"

### Test 3: Voice - Browser Not Supported
Open in Firefox:
**Expected Result:**
- ✅ Alert: "Voice recognition not supported in your browser. Please use Chrome or Edge."

### Test 4: Voice - Not Logged In
1. Logout
2. Try to use voice feature

**Expected Result:**
- ✅ Message: "⚠️ Please sign in to use voice features"

---

## 📸 FEATURE #2: SNAP & GENERATE TESTING

### Test 1: Upload Paper Document Image
1. Scroll to cyan **"Snap & Generate"** section
2. Click **"Upload Image"** (🖼️)
3. Select any image file from your computer (ideally a document photo/screenshot)
4. Wait for processing

**Expected Result:**
- ✅ Loading indicator shows
- ✅ AI processes image (5-10 seconds)
- ✅ Enhanced digital document appears
- ✅ Document usage increments

### Test 2: Mobile Camera (if testing on phone)
1. Click **"Take Photo"** (📷)
2. Camera opens
3. Take photo of any paper document
4. Submit

**Expected Result:**
- ✅ Camera interface opens
- ✅ Photo captured and processed
- ✅ Digitized document created

### Test 3: Snap - Not Authenticated
1. Logout
2. Try to upload image

**Expected Result:**
- ✅ Message: "⚠️ Please sign in to use snap features"

---

## 🔗 FEATURE #3: SMART CONTRACT CHAINS TESTING

### Test 1: Create Document Chain
1. Create a **Proposal** document (use any template)
2. After generation, scroll to emerald **"Smart Contract Chains"** section
3. Look for suggestion box

**Expected Result:**
- ✅ Shows: "You created a PROPOSAL. Want to create the next step?"
- ✅ Button: "⚡ Create Follow-Up Document"

4. Click the button

**Expected Result:**
- ✅ Opens Contract template modal
- ✅ Form may have pre-filled data from proposal

### Test 2: Verify Chain Logic
Create documents in order:
1. Proposal → Should suggest: Contract
2. Contract → Should suggest: Invoice
3. Invoice → Should suggest: Receipt

**Expected Result:**
- ✅ Each document suggests the logical next step

---

## 🤝 FEATURE #4: COLLABORATIVE NEGOTIATION TESTING

### Test 1: View Negotiation Interface
1. Scroll to amber **"Collaborative Negotiation Mode"** section
2. Review the example conversation
3. Click **"🤝 Start Negotiation Session"**

**Expected Result:**
- ✅ Alert: "🚀 Negotiation mode coming soon! This feature enables real-time collaborative editing..."
- ✅ (This is a UI preview - full implementation would require WebSocket collaboration)

---

## 🧠 FEATURE #5: SMART TEMPLATES WITH MEMORY TESTING

### Test 1: Initial State (No History)
1. Scroll to rose **"Smart Templates with Memory"** section
2. As a new user with no documents

**Expected Result:**
- ✅ Shows: "AI is learning your patterns..."
- ✅ Message: "Create a few documents and watch the magic happen!"

### Test 2: After Creating Documents
1. Create 3-5 documents (any types)
2. Return to Smart Templates section

**Expected Result:**
- ✅ Shows: "AI Learned Your Patterns"
- ✅ Displays: "X documents analyzed"
- ✅ Shows patterns like:
  - "You frequently create invoices on Fridays"
  - "Your typical project value: $2,500 - $5,000"
- ✅ Quick action buttons appear:
  - "⚡ Friday Invoice"
  - "⚡ Standard Contract"

### Test 3: Use Quick Actions
Click **"⚡ Friday Invoice"**

**Expected Result:**
- ✅ Invoice template opens
- ✅ Alert: "💡 Form pre-filled with your typical values!"

---

## 📋 STANDARD DOCUMENT GENERATION TESTING

### Test 1: Create Invoice
1. Click **Invoice** template card
2. Fill in all fields:
   - Client Name: `ABC Company`
   - Client Address: `123 Main St`
   - Client Email: `client@abc.com`
   - Items: `Logo Design` (one per line)
   - Quantities: `1`
   - Prices: `500`
   - Payment Method: `Bank Transfer`
   - Note: `Thank you!`
3. Select theme: **Modern**
4. Click **"✨ Generate with AI"**

**Expected Result:**
- ✅ Loading modal: "AI is Creating Your Document"
- ✅ Preview opens after 5-10 seconds
- ✅ Invoice image displays with professional layout
- ✅ All entered data appears correctly
- ✅ Company logo appears (if set in settings)

### Test 2: Download Document
In preview modal, click **"📥 Download PNG"**

**Expected Result:**
- ✅ PNG file downloads
- ✅ Filename: `INVOICE-[date].png`
- ✅ Image opens correctly

### Test 3: Test All Templates
Repeat for each template:
- ✅ Invoice
- ✅ NDA
- ✅ Contract
- ✅ Proposal
- ✅ Receipt
- ✅ Quote
- ✅ AI Custom

**For AI Custom:**
Use prompt: `"Create a partnership agreement between two tech companies"`

**Expected Result:**
- ✅ Each generates with unique specialized layout
- ✅ All themes look visually different
- ✅ Professional formatting

---

## ⚙️ COMPANY SETTINGS TESTING

### Test 1: Upload Logo
1. Click **⚙️** settings icon in header
2. Click logo upload button
3. Select an image file

**Expected Result:**
- ✅ Logo preview appears immediately
- ✅ Saved to localStorage

### Test 2: Update Company Info
Change:
- Company Name: `My Business Inc`
- Address: `456 Business Ave`
- Email: `info@mybusiness.com`
- Phone: `(555) 999-8888`

Click **"Save Settings"**

**Expected Result:**
- ✅ Settings saved
- ✅ Modal closes
- ✅ Next document generation uses new info

### Test 3: Verify Settings Persist
1. Refresh browser
2. Open settings again

**Expected Result:**
- ✅ All settings still there (localStorage)

---

## 🛡️ FRAUD DETECTION TESTING

### Test 1: Upload Document for Analysis
1. Scroll to **"Document Fraud Detector"** section
2. Upload any document image or PDF
3. Wait for AI analysis

**Expected Result:**
- ✅ Shows: "⏳ Analyzing..."
- ✅ Analysis complete in 5-15 seconds
- ✅ Results display:
  - Risk Score (1-10)
  - Risk Level (Low/Medium/High)
  - Overall Assessment
  - 6 Forensic Checks with details
  - AI Insights
  - Final Verdict
  - Confidence percentage

### Test 2: URL Analysis
1. Paste a document URL
2. Click **"🔍 Analyze Document"**

**Expected Result:**
- ✅ Same analysis results as upload

### Test 3: Copy Report
Click **"📋 Copy Report"**

**Expected Result:**
- ✅ Alert: "📋 Report copied to clipboard!"
- ✅ Report text in clipboard

---

## 💳 STRIPE PAYMENT TESTING

### Test 1: View Pricing (Free User)
As a free user:
- Header shows: **"⚡ Upgrade"** button

Click it

**Expected Result:**
- ✅ Pricing modal opens
- ✅ Shows 3 plans:
  - Free: $0/month, 10 docs, $1/overage
  - Pro: $12/month, 75 docs, $0.50/overage
  - Business: $39/month, unlimited

### Test 2: Attempt Stripe Checkout
Click **"Get Pro"** button

**Expected Result:**
- ⚠️ If Stripe not fully configured:
  - Error or redirect fails
- ✅ If Stripe configured:
  - Redirects to Stripe Checkout
  - Test mode credit card: `4242 4242 4242 4242`

---

## 📊 DOCUMENT USAGE & OVERAGE TESTING

### Test 1: Free Plan Limit
As free user (10 docs limit):
1. Generate 10 documents
2. Try to generate 11th document

**Expected Result:**
- ✅ Document 1-10: Generate successfully
- ✅ Document 11: Alert shows overage charge
  - "✅ Document generated!"
  - "💰 Additional charge: $1.00"
  - "You can continue generating..."
- ✅ Header shows: "10/10 +1 ($1.00)"

### Test 2: Continue After Overage
Generate 12th, 13th documents

**Expected Result:**
- ✅ Each generates successfully
- ✅ Overage count increases
- ✅ Total cost accumulates: +2 ($2.00), +3 ($3.00)

---

## 🔍 BROWSER COMPATIBILITY TESTING

### Chrome/Edge ✅
- All features work
- Voice recognition: ✅
- Camera capture: ✅

### Firefox ⚠️
- Standard features: ✅
- Voice recognition: ❌ (shows warning)
- Camera capture: ✅

### Safari ⚠️
- Standard features: ✅
- Voice recognition: ⚠️ (limited support)
- Camera capture: ✅

---

## 📱 MOBILE TESTING

### Test on Phone
1. Access on mobile device
2. Test voice (use Chrome mobile)
3. Test camera capture
4. Test responsive layout

**Expected:**
- ✅ All sections stack vertically
- ✅ Buttons are touch-friendly
- ✅ Camera access works
- ✅ Voice works on Chrome mobile

---

## 🐛 ERROR TESTING

### Test 1: Backend Offline
1. Stop backend server
2. Try to generate document

**Expected Result:**
- ✅ Shows error after timeout
- ✅ Alert: "Failed to generate document"

### Test 2: Invalid Auth Token
1. Manually corrupt token in localStorage
2. Try to generate document

**Expected Result:**
- ✅ 401 Unauthorized
- ✅ Alert: "⏰ Session expired. Please login again."
- ✅ Auth modal opens

### Test 3: Network Error
1. Disconnect internet
2. Try to generate document

**Expected Result:**
- ✅ Error handling
- ✅ User-friendly message

---

## ✅ TESTING CHECKLIST

### Core Features
- [ ] User Registration
- [ ] User Login/Logout
- [ ] Document Generation (all 7 templates)
- [ ] Theme Selection (4 themes)
- [ ] Document Download
- [ ] Company Settings
- [ ] Fraud Detection

### Killer Features
- [ ] Voice-to-Document (Chrome/Edge)
- [ ] Snap & Generate (image upload)
- [ ] Smart Contract Chains
- [ ] Collaborative Negotiation UI
- [ ] Smart Templates with Memory

### Payment & Usage
- [ ] Free plan limits
- [ ] Overage tracking
- [ ] Overage alerts
- [ ] Usage display in header
- [ ] Pricing modal

### Security & Auth
- [ ] Protected endpoints
- [ ] Token expiration
- [ ] Login required for features
- [ ] Auth state persistence

### UI/UX
- [ ] Responsive design
- [ ] Loading states
- [ ] Error messages
- [ ] Success feedback
- [ ] Animations & transitions

---

## 🚀 PRODUCTION TESTING

Before deploying:

### Performance
- [ ] Page load time < 3 seconds
- [ ] Document generation < 15 seconds
- [ ] No memory leaks
- [ ] Smooth animations

### Security
- [ ] All API keys in .env (not committed)
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Input validation on backend

### Data
- [ ] User data persists correctly
- [ ] Settings save properly
- [ ] Document history accurate
- [ ] Overage calculations correct

---

## 📞 SUPPORT & DEBUGGING

### Check Backend Logs
Backend console shows:
- `🤖 AI Generating document: [type]`
- `✅ Document generated: [id]`
- `💰 Overage charge applied`
- `📧 Sending document to [email]`

### Check Browser Console
Look for:
- API call logs
- WebSocket/Pusher connection status
- Error messages
- State updates

### Common Issues

**Voice not working:**
- Use Chrome or Edge
- Allow microphone permission
- Check HTTPS (required for mic access in production)

**Documents not generating:**
- Check backend is running (port 8080)
- Verify Gemini API key is valid
- Check network tab for API errors

**Images not showing:**
- Check company logo is valid base64
- Verify image generation service is working
- Look for canvas errors in backend logs

---

## 🎉 SUCCESS CRITERIA

Your testing is successful if:

✅ All 7 document templates generate correctly
✅ Voice recognition works in Chrome/Edge
✅ Image upload creates enhanced documents
✅ Smart chains suggest next documents
✅ AI learns from document history
✅ Fraud detection returns detailed analysis
✅ Authentication flow works smoothly
✅ Overages track and display correctly
✅ All 4 themes look visually different
✅ Mobile-friendly and responsive
✅ No console errors in normal usage
✅ Performance is smooth and fast

---

## 💡 TIPS

1. **Test with realistic data** - Use real company names, amounts, etc.
2. **Try edge cases** - Empty fields, very long text, special characters
3. **Test on different devices** - Desktop, tablet, mobile
4. **Check accessibility** - Tab navigation, screen reader compatibility
5. **Monitor backend logs** - Helps debug issues quickly

---

**Happy Testing! 🚀**

If you encounter any issues, check the console logs (both browser and backend) for detailed error messages.
