# SafeDoc Workspace - Quick Start Guide

Get up and running with SafeDoc in 5 minutes.

## Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- Chrome browser
- Terminal/Command Prompt

## Installation

### Step 1: Install Dependencies

```bash
# Navigate to project directory
cd safedoc-workspace

# Install all dependencies
npm run install:all
```

This installs dependencies for:
- Shared types package
- Backend server
- Web application
- Chrome extension

### Step 2: Start Development Environment

```bash
# Start all services concurrently
npm run dev
```

This command starts:
- **Backend**: http://localhost:8080
- **Web App**: http://localhost:3000  
- **Extension**: Watch mode for hot-reload

Wait for all services to start (typically 10-30 seconds).

### Step 3: Load Chrome Extension

1. Open Chrome
2. Navigate to: `chrome://extensions/`
3. Toggle **Developer mode** ON (top right)
4. Click **Load unpacked**
5. Select folder: `safedoc-workspace/chrome-extension/dist`
6. SafeDoc icon should appear in extensions toolbar

### Step 4: Test the System

#### Test Web App

1. Open browser to: http://localhost:3000
2. You should see the SafeDoc Workspace with dual-pane layout
3. Type `/invoice` in the canvas to generate a sample invoice
4. Click "Canvas" / "Risk Visualizer" toggle to switch views

#### Test Chrome Extension

1. Visit Gmail, Outlook, or any supported site
2. View an email with a PDF attachment or invoice
3. Extension side panel should automatically open
4. See real-time security analysis appear

## Your First Document

### Generate an Invoice

1. In the Web App canvas, type:
```
/invoice $1,500 for web design services to Acme Corp
```

2. Press Enter

3. The system will generate a formatted invoice

### Analyze a Document

1. Document will automatically be analyzed
2. Check the History Panel (left side) for risk score
3. Click "Risk Visualizer" to see detailed analysis
4. Review risk factors and recommendations

## Common Commands

### Canvas Commands

- `/invoice` - Generate an invoice
- `/contract` - Create a contract
- `/nda` - Generate an NDA
- `/sow` - Create Statement of Work
- `/dpa` - Data Protection Rider

Example:
```
/nda between Acme Corp and Widget Inc
```

## Understanding the Interface

### Web App Layout

```
┌─────────────┬───────────────────────────┐
│   History   │      Main Canvas          │
│   Panel     │                           │
│             │  - Document editing       │
│ - Recent    │  - Command input          │
│   docs      │  - Risk visualization     │
│ - Risk      │                           │
│   scores    │                           │
└─────────────┴───────────────────────────┘
```

### Extension Side Panel

```
┌────────────────────────┐
│  SafeDoc               │
├────────────────────────┤
│                        │
│  Security Score: 85%   │
│  ████████████░░░░      │
│                        │
│  Risk Factors:         │
│  • Factor 1            │
│  • Factor 2            │
│                        │
├────────────────────────┤
│  Command Input         │
│  /generate...          │
└────────────────────────┘
```

## What's Happening Behind the Scenes

1. **Extension** monitors pages for documents
2. **Content Script** detects invoices/contracts
3. **Background Worker** manages WebSocket connection
4. **Backend** analyzes documents with 5 forensic checks
5. **Web App** receives real-time updates via WebSocket
6. **State** syncs across all clients instantly

## Troubleshooting

### Backend Not Starting

```bash
# Check if port 8080 is available
netstat -ano | findstr :8080

# Try a different port
PORT=8081 npm run dev --workspace=backend
```

### Extension Not Loading

1. Check Chrome DevTools console for errors
2. Verify `dist` folder exists in `chrome-extension/`
3. Try rebuilding:
```bash
npm run build --workspace=chrome-extension
```

### WebSocket Connection Failed

1. Verify backend is running on port 8080
2. Check browser console for connection errors
3. Ensure no firewall blocking localhost

### Build Errors

```bash
# Clean install
rm -rf node_modules
rm -rf */node_modules
npm run install:all
```

## Next Steps

### Explore Features

- [Features Documentation](FEATURES.md) - Complete feature list
- [Architecture Guide](ARCHITECTURE.md) - System design
- [Deployment Guide](DEPLOYMENT.md) - Production setup

### Customize

1. **Add New Document Types**: Edit `shared/src/types/documents.ts`
2. **Modify UI Theme**: Update Tailwind config colors
3. **Add Analysis Types**: Extend `DocumentAnalyzer` service

### Deploy

When ready for production:

```bash
# Build everything
npm run build

# Deploy backend (PM2, Docker, etc.)
npm run start --workspace=backend

# Deploy web app (Vercel, Netlify, S3)
# Static files in: web-app/dist

# Package extension for Chrome Web Store
# Extension files in: chrome-extension/dist
```

## Getting Help

- Check the [Architecture documentation](ARCHITECTURE.md)
- Review [Deployment guide](DEPLOYMENT.md)
- Examine code comments in source files
- Check browser/terminal console for errors

## Development Tips

### Hot Reload

- Web app automatically reloads on changes
- Backend restarts on file changes (via tsx watch)
- Extension requires manual reload in `chrome://extensions/`

### Debugging

- **Backend**: Check terminal output
- **Web App**: Use React DevTools + Browser Console
- **Extension**: Chrome DevTools (click "service worker" link)

### Code Structure

```
/chrome-extension/src/
  /background/     - Service worker
  /content/        - Page monitoring
  /sidepanel/      - UI components

/web-app/src/
  /components/     - React components
  /pages/          - Main pages
  /store/          - State management

/backend/src/
  /services/       - Business logic
  index.ts         - Server entry

/shared/src/
  /types/          - Shared TypeScript types
  /utils/          - Shared utilities
```

---

**You're all set!** SafeDoc Workspace is now running and ready to analyze documents.
