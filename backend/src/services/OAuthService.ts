/**
 * OAuth Authentication Service
 * Handles Google, Apple, GitHub sign-in
 */

import axios from 'axios';
import jwt from 'jsonwebtoken';

interface OAuthUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
  provider: 'google' | 'apple' | 'github';
}

class OAuthService {
  private JWT_SECRET: string;

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production';
    console.log('🔐 OAuth service initialized');
  }

  /**
   * Verify Google ID Token
   * https://developers.google.com/identity/gsi/web/guides/verify-google-id-token
   */
  async verifyGoogleToken(idToken: string): Promise<OAuthUser | null> {
    try {
      // Verify token with Google
      const response = await axios.get(
        `https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`
      );

      const { sub, email, name, picture, email_verified } = response.data;

      if (!email_verified) {
        console.error('❌ Google email not verified');
        return null;
      }

      return {
        id: `google_${sub}`,
        email: email.toLowerCase(),
        name: name || email.split('@')[0],
        picture,
        provider: 'google',
      };
    } catch (error: any) {
      console.error('Google token verification failed:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Verify Apple ID Token
   * https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api/verifying_a_user
   */
  async verifyAppleToken(idToken: string): Promise<OAuthUser | null> {
    try {
      // Decode JWT (Apple uses RS256)
      const decoded: any = jwt.decode(idToken, { complete: true });
      
      if (!decoded) {
        console.error('❌ Failed to decode Apple token');
        return null;
      }

      const { sub, email, email_verified } = decoded.payload;

      if (email_verified === 'false' || email_verified === false) {
        console.error('❌ Apple email not verified');
        return null;
      }

      // Apple doesn't always provide name in token
      // Name comes from the initial sign-in request on frontend
      return {
        id: `apple_${sub}`,
        email: email?.toLowerCase() || `${sub}@privaterelay.appleid.com`,
        name: email?.split('@')[0] || 'Apple User',
        provider: 'apple',
      };
    } catch (error: any) {
      console.error('Apple token verification failed:', error.message);
      return null;
    }
  }

  /**
   * Verify GitHub Access Token
   * https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/authorizing-oauth-apps
   */
  async verifyGitHubToken(accessToken: string): Promise<OAuthUser | null> {
    try {
      // Get user info from GitHub
      const userResponse = await axios.get('https://api.github.com/user', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      const { id, email, name, avatar_url, login } = userResponse.data;

      // GitHub email might be null if private
      let userEmail = email;
      if (!userEmail) {
        // Fetch primary email
        const emailResponse = await axios.get('https://api.github.com/user/emails', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        });

        const primaryEmail = emailResponse.data.find((e: any) => e.primary && e.verified);
        userEmail = primaryEmail?.email || `${login}@github.local`;
      }

      return {
        id: `github_${id}`,
        email: userEmail.toLowerCase(),
        name: name || login,
        picture: avatar_url,
        provider: 'github',
      };
    } catch (error: any) {
      console.error('GitHub token verification failed:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Exchange GitHub code for access token
   */
  async exchangeGitHubCode(code: string): Promise<string | null> {
    try {
      const response = await axios.post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        {
          headers: {
            Accept: 'application/json',
          },
        }
      );

      return response.data.access_token;
    } catch (error: any) {
      console.error('GitHub code exchange failed:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Generate OAuth login URL for GitHub
   */
  getGitHubAuthUrl(redirectUri: string): string {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const scope = 'user:email';
    return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  }
}

export default OAuthService;
