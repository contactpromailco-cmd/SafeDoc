/**
 * Secure Authentication Service
 * Handles user registration, login, JWT tokens, session management
 */

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface User {
  id: string;
  email: string;
  passwordHash: string;
  name: string;
  plan: 'free' | 'pro' | 'business';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  documentsUsed: number;
  documentsLimit: number;
  overageCount: number; // Docs used beyond limit this month
  overageCost: number; // Total overage charges this month
  createdAt: Date;
  lastLogin: Date;
  isVerified: boolean;
  resetToken?: string;
  resetTokenExpiry?: Date;
}

class AuthService {
  private users: Map<string, User> = new Map();
  private sessions: Map<string, { userId: string; expiresAt: Date }> = new Map();
  private JWT_SECRET: string;
  private JWT_EXPIRES_IN = '7d'; // Tokens expire in 7 days

  // Usage-based pricing: overage costs per plan
  private readonly OVERAGE_COSTS = {
    free: 1.00,      // $1.00 per doc over 10
    pro: 0.50,       // $0.50 per doc over 75
    business: 0,     // Unlimited, no overages
  };

  private readonly PLAN_LIMITS = {
    free: 10,
    pro: 75,
    business: 999999, // Unlimited
  };

  constructor() {
    this.JWT_SECRET = process.env.JWT_SECRET || this.generateSecret();
    
    if (!process.env.JWT_SECRET) {
      console.warn('⚠️  JWT_SECRET not set! Using generated secret (not recommended for production)');
    }
    
    console.log('🔐 Auth service initialized');
    console.log('💰 Usage-based pricing enabled:');
    console.log('   - Free: 10 docs + $1.00/doc overage');
    console.log('   - Pro: 75 docs + $0.50/doc overage');
    console.log('   - Business: Unlimited (no overages)');
  }

  private generateSecret(): string {
    return require('crypto').randomBytes(64).toString('hex');
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Hash password securely (bcrypt with salt rounds)
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = 12; // High security
    return bcrypt.hash(password, saltRounds);
  }

  // Verify password
  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  // Generate JWT token
  private generateToken(userId: string, email: string): string {
    return jwt.sign(
      { userId, email },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN } as jwt.SignOptions
    );
  }

  // Verify JWT token
  verifyToken(token: string): { userId: string; email: string } | null {
    try {
      const decoded = jwt.verify(token, this.JWT_SECRET) as { userId: string; email: string };
      return decoded;
    } catch (error) {
      return null;
    }
  }

  // Register new user
  async register(email: string, password: string, name: string): Promise<{ success: boolean; user?: any; token?: string; error?: string }> {
    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return { success: false, error: 'Invalid email format' };
      }

      // Check if user already exists
      for (const user of this.users.values()) {
        if (user.email.toLowerCase() === email.toLowerCase()) {
          return { success: false, error: 'Email already registered' };
        }
      }

      // Validate password strength
      if (password.length < 8) {
        return { success: false, error: 'Password must be at least 8 characters' };
      }

      // Hash password
      const passwordHash = await this.hashPassword(password);

      // Create user
      const userId = this.generateId();
      const user: User = {
        id: userId,
        email: email.toLowerCase(),
        passwordHash,
        name,
        plan: 'free',
        documentsUsed: 0,
        documentsLimit: this.PLAN_LIMITS.free,
        overageCount: 0,
        overageCost: 0,
        createdAt: new Date(),
        lastLogin: new Date(),
        isVerified: false, // Email verification would go here
      };

      this.users.set(userId, user);

      // Generate token
      const token = this.generateToken(userId, email);

      console.log(`✅ User registered: ${email}`);

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          plan: user.plan,
          documentsUsed: user.documentsUsed,
          documentsLimit: user.documentsLimit,
          overageCount: user.overageCount,
          overageCost: user.overageCost,
        },
        token,
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: 'Registration failed' };
    }
  }

  // Login user
  async login(email: string, password: string): Promise<{ success: boolean; user?: any; token?: string; error?: string }> {
    try {
      // Find user by email
      let foundUser: User | undefined;
      for (const user of this.users.values()) {
        if (user.email.toLowerCase() === email.toLowerCase()) {
          foundUser = user;
          break;
        }
      }

      if (!foundUser) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Verify password
      const isValid = await this.verifyPassword(password, foundUser.passwordHash);
      if (!isValid) {
        return { success: false, error: 'Invalid email or password' };
      }

      // Update last login
      foundUser.lastLogin = new Date();

      // Generate token
      const token = this.generateToken(foundUser.id, foundUser.email);

      console.log(`✅ User logged in: ${email}`);

      return {
        success: true,
        user: {
          id: foundUser.id,
          email: foundUser.email,
          name: foundUser.name,
          plan: foundUser.plan,
          documentsUsed: foundUser.documentsUsed,
          documentsLimit: foundUser.documentsLimit,
          overageCount: foundUser.overageCount,
          overageCost: foundUser.overageCost,
          stripeCustomerId: foundUser.stripeCustomerId,
        },
        token,
      };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  }

  // Get user by token
  getUserByToken(token: string): User | null {
    const decoded = this.verifyToken(token);
    if (!decoded) return null;

    return this.users.get(decoded.userId) || null;
  }

  // Update user plan (after Stripe payment)
  updateUserPlan(userId: string, plan: 'free' | 'pro' | 'business', stripeCustomerId?: string, stripeSubscriptionId?: string): boolean {
    const user = this.users.get(userId);
    if (!user) return false;

    user.plan = plan;
    user.documentsLimit = this.PLAN_LIMITS[plan];

    if (stripeCustomerId) user.stripeCustomerId = stripeCustomerId;
    if (stripeSubscriptionId) user.stripeSubscriptionId = stripeSubscriptionId;

    console.log(`✅ User plan updated: ${user.email} → ${plan} (${user.documentsLimit} docs)`);
    return true;
  }

  // Check if user can generate document (with overage support)
  canGenerateDocument(userId: string): { allowed: boolean; isOverage: boolean; overageCost: number } {
    const user = this.users.get(userId);
    if (!user) return { allowed: false, isOverage: false, overageCost: 0 };

    // Business plan is always unlimited
    if (user.plan === 'business') {
      return { allowed: true, isOverage: false, overageCost: 0 };
    }

    // Check if within limit
    if (user.documentsUsed < user.documentsLimit) {
      return { allowed: true, isOverage: false, overageCost: 0 };
    }

    // Over limit - calculate overage cost
    const overageCost = this.OVERAGE_COSTS[user.plan];
    return { allowed: true, isOverage: true, overageCost };
  }

  // Increment document usage (with overage tracking)
  incrementDocumentUsage(userId: string): { success: boolean; isOverage: boolean; overageCost: number; totalOverageCost: number } {
    const user = this.users.get(userId);
    if (!user) return { success: false, isOverage: false, overageCost: 0, totalOverageCost: 0 };

    user.documentsUsed++;

    // Check if this is an overage
    if (user.documentsUsed > user.documentsLimit && user.plan !== 'business') {
      user.overageCount++;
      const overageCost = this.OVERAGE_COSTS[user.plan];
      user.overageCost += overageCost;

      console.log(`💰 Overage charge: ${user.email} - $${overageCost} (Total: $${user.overageCost.toFixed(2)})`);

      return {
        success: true,
        isOverage: true,
        overageCost: overageCost,
        totalOverageCost: user.overageCost,
      };
    }

    return {
      success: true,
      isOverage: false,
      overageCost: 0,
      totalOverageCost: user.overageCost,
    };
  }

  // Get user by ID
  getUser(userId: string): User | null {
    return this.users.get(userId) || null;
  }

  // Reset document usage (monthly cron job would call this)
  resetMonthlyUsage(): void {
    for (const user of this.users.values()) {
      const hadOverages = user.overageCost > 0;
      
      // Reset usage counters
      user.documentsUsed = 0;
      user.overageCount = 0;
      user.overageCost = 0;

      if (hadOverages) {
        console.log(`💰 ${user.email} - Overages billed and reset`);
      }
    }
    console.log('✅ Monthly document usage reset for all users');
  }

  // Get overage info for user
  getOverageInfo(userId: string): { overageCost: number; overageCount: number; overagePricePerDoc: number } | null {
    const user = this.users.get(userId);
    if (!user) return null;

    return {
      overageCost: user.overageCost,
      overageCount: user.overageCount,
      overagePricePerDoc: this.OVERAGE_COSTS[user.plan],
    };
  }

  // Get all users (for billing)
  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  // Get users with overages (for billing)
  getUsersWithOverages(): Array<{
    id: string;
    email: string;
    stripeCustomerId?: string;
    overageCount: number;
    overageCost: number;
    overagePricePerDoc: number;
  }> {
    const usersWithOverages: Array<any> = [];

    for (const user of this.users.values()) {
      if (user.overageCost > 0) {
        usersWithOverages.push({
          id: user.id,
          email: user.email,
          stripeCustomerId: user.stripeCustomerId,
          overageCount: user.overageCount,
          overageCost: user.overageCost,
          overagePricePerDoc: this.OVERAGE_COSTS[user.plan],
        });
      }
    }

    return usersWithOverages;
  }
}

export default AuthService;
