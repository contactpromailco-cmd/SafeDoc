/**
 * Stripe Payment Service
 * Handles subscriptions, payments, webhooks
 */

import Stripe from 'stripe';

class StripeService {
  private stripe: Stripe | null = null;
  private readonly PRICE_IDS = {
    pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_pro_monthly',
    pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY || 'price_pro_yearly',
    business_monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY || 'price_business_monthly',
    business_yearly: process.env.STRIPE_PRICE_BUSINESS_YEARLY || 'price_business_yearly',
  };

  constructor() {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    
    if (apiKey) {
      this.stripe = new Stripe(apiKey, {
        apiVersion: '2026-06-24.dahlia',
      });
      console.log('💳 Stripe service initialized');
    } else {
      console.log('⚠️  Stripe not configured (set STRIPE_SECRET_KEY)');
    }
  }

  isConfigured(): boolean {
    return !!this.stripe;
  }

  // Create checkout session for subscription
  async createCheckoutSession(
    plan: 'pro' | 'business',
    interval: 'monthly' | 'yearly',
    customerEmail: string,
    userId: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<{ sessionId?: string; url?: string; error?: string }> {
    if (!this.stripe) {
      return { error: 'Stripe not configured' };
    }

    try {
      const priceId = interval === 'monthly' 
        ? this.PRICE_IDS[`${plan}_monthly`]
        : this.PRICE_IDS[`${plan}_yearly`];

      const session = await this.stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        customer_email: customerEmail,
        client_reference_id: userId,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId,
          plan,
          interval,
        },
      });

      return {
        sessionId: session.id,
        url: session.url || undefined,
      };
    } catch (error: any) {
      console.error('Stripe checkout error:', error);
      return { error: error.message || 'Failed to create checkout session' };
    }
  }

  // Create customer portal session (manage subscription)
  async createPortalSession(
    customerId: string,
    returnUrl: string
  ): Promise<{ url?: string; error?: string }> {
    if (!this.stripe) {
      return { error: 'Stripe not configured' };
    }

    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      return { url: session.url };
    } catch (error: any) {
      console.error('Stripe portal error:', error);
      return { error: error.message || 'Failed to create portal session' };
    }
  }

  // Handle webhook events
  async handleWebhook(
    payload: string | Buffer,
    signature: string
  ): Promise<{ event?: any; error?: string }> {
    if (!this.stripe) {
      return { error: 'Stripe not configured' };
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return { error: 'Webhook secret not configured' };
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret
      );

      return { event };
    } catch (error: any) {
      console.error('Webhook error:', error);
      return { error: error.message || 'Webhook verification failed' };
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<{ success: boolean; error?: string }> {
    if (!this.stripe) {
      return { success: false, error: 'Stripe not configured' };
    }

    try {
      await this.stripe.subscriptions.cancel(subscriptionId);
      return { success: true };
    } catch (error: any) {
      console.error('Cancel subscription error:', error);
      return { success: false, error: error.message };
    }
  }

  // Get subscription details
  async getSubscription(subscriptionId: string): Promise<{ subscription?: any; error?: string }> {
    if (!this.stripe) {
      return { error: 'Stripe not configured' };
    }

    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      return { subscription };
    } catch (error: any) {
      console.error('Get subscription error:', error);
      return { error: error.message };
    }
  }

  // Bill overage charges for a user
  async billOverages(
    customerId: string,
    overageCount: number,
    overageCost: number,
    pricePerDoc: number,
    userEmail: string
  ): Promise<{ success: boolean; invoiceId?: string; error?: string }> {
    if (!this.stripe) {
      return { success: false, error: 'Stripe not configured' };
    }

    if (overageCost <= 0) {
      return { success: true }; // Nothing to bill
    }

    try {
      // Create invoice item for overages
      await this.stripe.invoiceItems.create({
        customer: customerId,
        amount: Math.round(overageCost * 100), // Convert to cents
        currency: 'usd',
        description: `${overageCount} additional document${overageCount > 1 ? 's' : ''} @ $${pricePerDoc.toFixed(2)} each`,
      });

      // Create and finalize invoice
      const invoice = await this.stripe.invoices.create({
        customer: customerId,
        auto_advance: true, // Auto-finalize and charge
        description: 'SafeDoc - Monthly overage charges',
      });

      // Finalize invoice (triggers payment)
      await this.stripe.invoices.finalizeInvoice(invoice.id);

      console.log(`✅ Billed overage: ${userEmail} - $${overageCost.toFixed(2)} (${overageCount} docs)`);

      return {
        success: true,
        invoiceId: invoice.id,
      };
    } catch (error: any) {
      console.error('Bill overages error:', error);
      return {
        success: false,
        error: error.message || 'Failed to bill overages',
      };
    }
  }

  // Bill all users with overages (run monthly)
  async billAllOverages(users: Array<{
    id: string;
    email: string;
    stripeCustomerId?: string;
    overageCount: number;
    overageCost: number;
    overagePricePerDoc: number;
  }>): Promise<{
    totalBilled: number;
    successCount: number;
    failCount: number;
    results: Array<{ userId: string; success: boolean; error?: string }>;
  }> {
    if (!this.stripe) {
      return {
        totalBilled: 0,
        successCount: 0,
        failCount: 0,
        results: [],
      };
    }

    let totalBilled = 0;
    let successCount = 0;
    let failCount = 0;
    const results: Array<{ userId: string; success: boolean; error?: string }> = [];

    for (const user of users) {
      // Skip users with no overages or no Stripe customer
      if (user.overageCost <= 0 || !user.stripeCustomerId) {
        continue;
      }

      const result = await this.billOverages(
        user.stripeCustomerId,
        user.overageCount,
        user.overageCost,
        user.overagePricePerDoc,
        user.email
      );

      if (result.success) {
        totalBilled += user.overageCost;
        successCount++;
        results.push({ userId: user.id, success: true });
      } else {
        failCount++;
        results.push({ userId: user.id, success: false, error: result.error });
      }
    }

    console.log(`💰 Monthly billing complete: $${totalBilled.toFixed(2)} from ${successCount} users (${failCount} failed)`);

    return {
      totalBilled,
      successCount,
      failCount,
      results,
    };
  }
}

export default StripeService;
