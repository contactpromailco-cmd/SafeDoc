/**
 * Payment Link Service
 * Generates Stripe Payment Links for invoices
 */

import Stripe from 'stripe';

class PaymentLinkService {
  private stripe: Stripe | null = null;

  constructor() {
    const apiKey = process.env.STRIPE_SECRET_KEY;
    
    if (apiKey) {
      this.stripe = new Stripe(apiKey, {
        apiVersion: '2026-06-24.dahlia',
      });
      console.log('💰 Payment Link service initialized');
    } else {
      console.log('⚠️  Stripe not configured (payment links disabled)');
    }
  }

  isConfigured(): boolean {
    return !!this.stripe;
  }

  /**
   * Create payment link for invoice
   */
  async createPaymentLink(params: {
    amount: number;
    currency?: string;
    description: string;
    invoiceId: string;
    customerEmail?: string;
    metadata?: Record<string, string>;
  }): Promise<{ url?: string; error?: string }> {
    if (!this.stripe) {
      return { error: 'Stripe not configured' };
    }

    try {
      const { amount, currency = 'usd', description, invoiceId, customerEmail, metadata } = params;

      // Create a Stripe Payment Link
      const paymentLink = await this.stripe.paymentLinks.create({
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: description,
                description: `Invoice: ${invoiceId}`,
              },
              unit_amount: Math.round(amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        after_completion: {
          type: 'hosted_confirmation',
          hosted_confirmation: {
            custom_message: 'Thank you for your payment! Your receipt has been sent to your email.',
          },
        },
        metadata: {
          invoiceId,
          type: 'invoice_payment',
          ...metadata,
        },
        ...(customerEmail && {
          customer_creation: 'always',
          invoice_creation: {
            enabled: true,
            invoice_data: {
              description,
              metadata: {
                invoiceId,
              },
            },
          },
        }),
      });

      console.log(`✅ Payment link created: ${invoiceId} - $${amount}`);

      return {
        url: paymentLink.url,
      };
    } catch (error: any) {
      console.error('Payment link creation error:', error);
      return {
        error: error.message || 'Failed to create payment link',
      };
    }
  }

  /**
   * Create quick payment link (simplified)
   */
  async createQuickLink(
    amount: number,
    description: string,
    invoiceId: string
  ): Promise<string | null> {
    const result = await this.createPaymentLink({
      amount,
      description,
      invoiceId,
    });

    return result.url || null;
  }

  /**
   * Retrieve payment link status
   */
  async getPaymentLinkStatus(paymentLinkId: string): Promise<{
    active: boolean;
    url: string;
    totalPurchases: number;
  } | null> {
    if (!this.stripe) return null;

    try {
      const paymentLink = await this.stripe.paymentLinks.retrieve(paymentLinkId);

      return {
        active: paymentLink.active,
        url: paymentLink.url,
        totalPurchases: 0, // Note: Stripe doesn't provide this directly
      };
    } catch (error) {
      console.error('Get payment link error:', error);
      return null;
    }
  }

  /**
   * Deactivate payment link
   */
  async deactivatePaymentLink(paymentLinkId: string): Promise<boolean> {
    if (!this.stripe) return false;

    try {
      await this.stripe.paymentLinks.update(paymentLinkId, {
        active: false,
      });

      console.log(`✅ Payment link deactivated: ${paymentLinkId}`);
      return true;
    } catch (error) {
      console.error('Deactivate payment link error:', error);
      return false;
    }
  }

  /**
   * Generate payment button HTML
   */
  generatePaymentButton(paymentUrl: string, amount: number, currency: string = 'USD'): string {
    return `
      <div style="margin: 20px 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; text-align: center;">
        <div style="color: white; font-size: 14px; margin-bottom: 8px; opacity: 0.9;">Total Amount Due</div>
        <div style="color: white; font-size: 32px; font-weight: bold; margin-bottom: 16px;">${currency} $${amount.toFixed(2)}</div>
        <a href="${paymentUrl}" 
           target="_blank"
           style="display: inline-block; background: white; color: #667eea; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
          💳 Pay Now with Stripe
        </a>
        <div style="color: white; font-size: 12px; margin-top: 12px; opacity: 0.8;">
          Secure payment powered by Stripe • All major cards accepted
        </div>
      </div>
    `;
  }

  /**
   * Format payment info for documents
   */
  formatPaymentInfo(paymentUrl: string, amount: number): string {
    return `
═══════════════════════════════════════════════════════════════════════════════
                              💳 PAYMENT INFORMATION
═══════════════════════════════════════════════════════════════════════════════

Total Amount Due: $${amount.toFixed(2)}

Pay securely online:
${paymentUrl}

Or scan this QR code with your phone to pay instantly:
[QR Code would be generated here]

Payment Methods Accepted:
✓ Credit/Debit Cards (Visa, Mastercard, Amex, Discover)
✓ Apple Pay & Google Pay
✓ ACH Bank Transfer
✓ Digital Wallets

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Secure Payment Powered by Stripe | PCI-DSS Compliant | 256-bit SSL Encryption
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Questions about payment? Contact us at: billing@company.com

Payment Terms:
• Payment is due within 30 days of invoice date
• Late payments subject to 1.5% monthly interest
• Please reference invoice number when paying

═══════════════════════════════════════════════════════════════════════════════
`;
  }
}

export default PaymentLinkService;
