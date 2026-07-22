# Chrome Extension Installation Guide

## ✅ Extension is Built and Ready!

The SafeDoc Chrome Extension has been successfully built. Follow these steps to install it:

## Installation Steps

### 1. Open Chrome Extensions Page

Open Google Chrome and navigate to:
```
chrome://extensions/
```

Or: Click Menu (⋮) → More Tools → Extensions

### 2. Enable Developer Mode

Toggle **"Developer mode"** ON in the top-right corner

### 3. Load the Extension

1. Click **"Load unpacked"** button
2. Navigate to your project folder
3. Select the folder: `chrome-extension/dist`
4. Click "Select Folder"

### 4. Verify Installation

You should now see:
- ✅ SafeDoc Workspace extension card
- ✅ Extension icon in the toolbar
- ✅ No errors

## Testing the Extension

### Test 1: Manual Open
1. Click the SafeDoc icon in your browser toolbar
2. Side panel should open from the right
3. You should see "Waiting for document detection"

### Test 2: Auto-Detection
1. Visit Gmail (https://mail.google.com)
2. Open an email with a PDF attachment
3. Side panel should automatically open
4. Security analysis should appear

### Test 3: Command Input
1. Open the side panel
2. Type a command in the bottom input field
3. Commands like `/generate` should show suggestions

## Supported Sites

The extension monitors these sites:
- ✅ Gmail (mail.google.com)
- ✅ Outlook (outlook.live.com, outlook.office365.com)
- ✅ Stripe Dashboard (dashboard.stripe.com)

## Backend Required

For full functionality, you need the backend server running:

```bash
# In project root
cd backend
npm install
npm run dev
```

The backend runs on `http://localhost:8080`

## Troubleshooting

### Extension Not Loading
- **Error:** Manifest file missing
  - **Solution:** Ensure you selected the `dist` folder, not `chrome-extension`

- **Error:** Service worker failed
  - **Solution:** Check Chrome DevTools console for errors
  - Click "service worker" link in extension card to debug

### Side Panel Not Opening
- Check if you're on a supported site (Gmail, Outlook, Stripe)
- Try clicking the extension icon manually
- Check browser console for errors (F12)

### WebSocket Connection Failed
- Ensure backend server is running on port 8080
- Check firewall settings
- Look for connection errors in console

## Development Mode

While the extension is loaded:
- Changes to code require rebuilding: `npm run build` in `chrome-extension` folder
- After rebuild, click the refresh icon in the extension card
- Or use the keyboard shortcut: Ctrl+R (Cmd+R on Mac) while focused on the extension card

## Production Build

For production/distribution:
1. Build with production settings
2. Test thoroughly
3. Package the `dist` folder
4. Submit to Chrome Web Store

## Uninstalling

To remove the extension:
1. Go to `chrome://extensions/`
2. Find SafeDoc Workspace
3. Click "Remove"
4. Confirm removal

---

**Status:** ✅ Ready to use!
**Location:** `chrome-extension/dist`
**Manifest:** v3
**Build:** Complete
