# SafeDoc Workspace - Deployment Guide

## Prerequisites

- Node.js 18+ installed
- Chrome browser (for extension)
- npm or yarn package manager

## Installation

### 1. Install Dependencies

```bash
# Install all workspace dependencies
npm run install:all
```

### 2. Build All Packages

```bash
# Build all applications
npm run build
```

## Development Mode

### Start All Services

```bash
# Start backend, web app, and watch extension in parallel
npm run dev
```

This will start:
- **Backend Server**: `http://localhost:8080` (WebSocket: `ws://localhost:8080`)
- **Web App**: `http://localhost:3000`
- **Chrome Extension**: Watch mode for hot reloading

### Individual Services

```bash
# Backend only
npm run dev --workspace=backend

# Web app only
npm run dev --workspace=web-app

# Extension only (watch mode)
npm run dev --workspace=chrome-extension
```

## Chrome Extension Setup

### Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `chrome-extension/dist` folder
5. The SafeDoc icon should appear in your extensions

### Test Extension

1. Visit Gmail, Outlook, or Stripe
2. View an email with an attachment or invoice
3. The side panel should automatically open
4. Check the security analysis dashboard

## Production Deployment

### Backend

```bash
# Build backend
npm run build --workspace=backend

# Start production server
npm run start --workspace=backend
```

For production, consider:
- Using PM2 or similar process manager
- Setting up reverse proxy (nginx)
- Configuring SSL/TLS
- Environment variables via `.env`

### Web App

```bash
# Build for production
npm run build --workspace=web-app
```

Deploy the `web-app/dist` folder to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

### Chrome Extension

```bash
# Build for production
npm run build:extension
```

To publish to Chrome Web Store:
1. Create developer account
2. Package the `chrome-extension/dist` folder
3. Upload to Chrome Web Store dashboard
4. Submit for review

## Environment Configuration

### Backend Environment Variables

Create `backend/.env`:

```env
PORT=8080
NODE_ENV=production
DATABASE_URL=your_production_database
```

### Web App Environment

Update `web-app/src/config.ts` for production WebSocket URL:

```typescript
export const WS_URL = process.env.NODE_ENV === 'production'
  ? 'wss://your-domain.com'
  : 'ws://localhost:8080';
```

## Docker Deployment (Optional)

```dockerfile
# Backend Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY backend/ ./backend/
COPY shared/ ./shared/
RUN npm install
RUN npm run build --workspace=backend
CMD ["npm", "run", "start", "--workspace=backend"]
```

## Monitoring & Logging

For production:
- Set up error tracking (Sentry)
- Configure logging (Winston, Pino)
- Monitor WebSocket connections
- Track document analysis metrics

## Security Checklist

- [ ] Enable HTTPS/WSS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Implement authentication
- [ ] Validate all user inputs
- [ ] Encrypt sensitive data
- [ ] Regular security audits

## Troubleshooting

### Extension Not Loading
- Check manifest.json is valid
- Verify all files are in dist folder
- Check browser console for errors

### WebSocket Connection Failed
- Verify backend is running
- Check firewall settings
- Ensure correct URL in client config

### Build Errors
- Clear node_modules and reinstall
- Check Node.js version (18+)
- Verify TypeScript version compatibility
