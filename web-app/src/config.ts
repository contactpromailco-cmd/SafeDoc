/**
 * Configuration for API endpoints
 * Automatically uses production or local based on environment
 */

// Determine if we're in production or development
const isProduction = import.meta.env.PROD;

// API Base URL
export const API_URL = isProduction
  ? 'https://your-backend-url.railway.app' // TODO: Replace with your Railway/Render URL
  : 'http://localhost:8081';

// Frontend URL (for OAuth callbacks)
export const FRONTEND_URL = isProduction
  ? 'https://doc-tool-2.vercel.app' // Your Vercel URL
  : 'http://localhost:3000';

// OAuth Configuration
export const OAUTH_CONFIG = {
  google: {
    clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com', // TODO: Add your Google Client ID
  },
  github: {
    clientId: 'YOUR_GITHUB_CLIENT_ID', // TODO: Add your GitHub Client ID
    redirectUri: `${FRONTEND_URL}/auth/github/callback`,
  },
};

// Pusher Configuration (from environment or hardcoded)
export const PUSHER_CONFIG = {
  appId: '2177349',
  key: 'ab96fbeb449d4f90ca68',
  cluster: 'eu',
};

console.log('🔧 Environment:', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');
console.log('🌐 API URL:', API_URL);
console.log('🏠 Frontend URL:', FRONTEND_URL);
