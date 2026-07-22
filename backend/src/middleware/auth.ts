/**
 * Authentication Middleware
 * Protects routes, validates tokens, prevents unauthorized access
 */

import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/AuthService.js';

const authService = new AuthService();

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        plan: string;
      };
    }
  }
}

// Middleware to verify JWT token
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const user = authService.getUserByToken(token);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Attach user to request
    req.user = {
      id: user.id,
      email: user.email,
      plan: user.plan,
    };

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Authentication failed' });
  }
};

// Middleware to check if user can generate documents (supports overage)
export const checkDocumentLimit = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const result = authService.canGenerateDocument(req.user.id);
    
    if (!result.allowed) {
      return res.status(403).json({ 
        error: 'Cannot generate document',
        message: 'An error occurred' 
      });
    }

    // Attach overage info to request for later use
    (req as any).isOverage = result.isOverage;
    (req as any).overageCost = result.overageCost;

    next();
  } catch (error) {
    console.error('Document limit check error:', error);
    return res.status(500).json({ error: 'Failed to check document limit' });
  }
};

// Middleware to check plan access
export const requirePlan = (requiredPlan: 'pro' | 'business') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const planLevels = { free: 0, pro: 1, business: 2 };
    const userLevel = planLevels[req.user.plan as keyof typeof planLevels] || 0;
    const requiredLevel = planLevels[requiredPlan];

    if (userLevel < requiredLevel) {
      return res.status(403).json({ 
        error: 'Upgrade required',
        message: `This feature requires ${requiredPlan} plan` 
      });
    }

    next();
  };
};

export { authService };
