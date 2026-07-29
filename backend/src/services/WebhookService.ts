/**
 * Webhook Service
 * Event-driven webhooks for document lifecycle events
 */

import crypto from 'crypto';

interface Webhook {
  id: string;
  userId: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  active: boolean;
  createdAt: Date;
  lastTriggered?: Date;
  successCount: number;
  failureCount: number;
  metadata: Record<string, any>;
}

type WebhookEvent =
  | 'document.created'
  | 'document.updated'
  | 'document.deleted'
  | 'signature.requested'
  | 'signature.signed'
  | 'signature.completed'
  | 'signature.declined'
  | 'payment.created'
  | 'payment.completed'
  | 'payment.failed'
  | 'compliance.checked'
  | 'template.used'
  | 'translation.completed';

interface WebhookPayload {
  event: WebhookEvent;
  timestamp: Date;
  data: any;
  webhookId: string;
  signature: string;
}

interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: WebhookEvent;
  payload: WebhookPayload;
  status: 'pending' | 'success' | 'failed' | 'retrying';
  attempt: number;
  maxAttempts: number;
  response?: {
    statusCode: number;
    body: string;
  };
  error?: string;
  createdAt: Date;
  deliveredAt?: Date;
}

class WebhookService {
  private webhooks: Map<string, Webhook> = new Map();
  private deliveries: Map<string, WebhookDelivery> = new Map();
  private retryQueue: WebhookDelivery[] = [];

  constructor() {
    console.log('🪝 Webhook service initialized');
    
    // Start retry processor
    this.startRetryProcessor();
  }

  /**
   * Create webhook
   */
  createWebhook(params: {
    userId: string;
    url: string;
    events: WebhookEvent[];
    metadata?: Record<string, any>;
  }): Webhook {
    const webhookId = this.generateId();
    const secret = this.generateSecret();

    const webhook: Webhook = {
      id: webhookId,
      userId: params.userId,
      url: params.url,
      events: params.events,
      secret,
      active: true,
      createdAt: new Date(),
      successCount: 0,
      failureCount: 0,
      metadata: params.metadata || {},
    };

    this.webhooks.set(webhookId, webhook);

    console.log(`🪝 Webhook created: ${webhookId} (${params.events.length} events)`);

    return webhook;
  }

  /**
   * Update webhook
   */
  updateWebhook(
    webhookId: string,
    updates: {
      url?: string;
      events?: WebhookEvent[];
      active?: boolean;
      metadata?: Record<string, any>;
    }
  ): Webhook | null {
    const webhook = this.webhooks.get(webhookId);

    if (!webhook) {
      return null;
    }

    if (updates.url) webhook.url = updates.url;
    if (updates.events) webhook.events = updates.events;
    if (updates.active !== undefined) webhook.active = updates.active;
    if (updates.metadata) webhook.metadata = { ...webhook.metadata, ...updates.metadata };

    console.log(`🪝 Webhook updated: ${webhookId}`);

    return webhook;
  }

  /**
   * Delete webhook
   */
  deleteWebhook(webhookId: string): boolean {
    const deleted = this.webhooks.delete(webhookId);
    
    if (deleted) {
      console.log(`🗑️ Webhook deleted: ${webhookId}`);
    }

    return deleted;
  }

  /**
   * Get user webhooks
   */
  getUserWebhooks(userId: string): Webhook[] {
    return Array.from(this.webhooks.values()).filter(w => w.userId === userId);
  }

  /**
   * Get webhook by ID
   */
  getWebhook(webhookId: string): Webhook | null {
    return this.webhooks.get(webhookId) || null;
  }

  /**
   * Trigger webhook event
   */
  async triggerEvent(params: {
    userId: string;
    event: WebhookEvent;
    data: any;
  }): Promise<void> {
    const userWebhooks = Array.from(this.webhooks.values()).filter(
      w => w.userId === params.userId && w.active && w.events.includes(params.event)
    );

    if (userWebhooks.length === 0) {
      return;
    }

    console.log(`🚀 Triggering ${params.event} for ${userWebhooks.length} webhooks`);

    for (const webhook of userWebhooks) {
      const payload: WebhookPayload = {
        event: params.event,
        timestamp: new Date(),
        data: params.data,
        webhookId: webhook.id,
        signature: this.generateSignature(webhook.secret, params.data),
      };

      const delivery: WebhookDelivery = {
        id: this.generateId(),
        webhookId: webhook.id,
        event: params.event,
        payload,
        status: 'pending',
        attempt: 1,
        maxAttempts: 3,
        createdAt: new Date(),
      };

      this.deliveries.set(delivery.id, delivery);

      // Attempt delivery
      await this.deliverWebhook(delivery);
    }
  }

  /**
   * Deliver webhook
   */
  private async deliverWebhook(delivery: WebhookDelivery): Promise<void> {
    const webhook = this.webhooks.get(delivery.webhookId);

    if (!webhook) {
      delivery.status = 'failed';
      delivery.error = 'Webhook not found';
      return;
    }

    try {
      console.log(`📤 Delivering webhook ${delivery.webhookId} (attempt ${delivery.attempt})`);

      // In production, use fetch or axios
      // const response = await fetch(webhook.url, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'X-Webhook-Signature': delivery.payload.signature,
      //     'X-Webhook-ID': webhook.id,
      //   },
      //   body: JSON.stringify(delivery.payload),
      // });

      // Simulate successful delivery
      const success = Math.random() > 0.1; // 90% success rate

      if (success) {
        delivery.status = 'success';
        delivery.deliveredAt = new Date();
        delivery.response = {
          statusCode: 200,
          body: 'OK',
        };

        webhook.successCount++;
        webhook.lastTriggered = new Date();

        console.log(`✅ Webhook delivered successfully: ${webhook.id}`);
      } else {
        throw new Error('Delivery failed');
      }
    } catch (error: any) {
      console.error(`❌ Webhook delivery failed (${delivery.attempt}/${delivery.maxAttempts}):`, error.message);

      delivery.error = error.message;
      webhook.failureCount++;

      // Retry logic
      if (delivery.attempt < delivery.maxAttempts) {
        delivery.status = 'retrying';
        delivery.attempt++;
        this.retryQueue.push(delivery);
      } else {
        delivery.status = 'failed';
        console.log(`❌ Webhook permanently failed after ${delivery.maxAttempts} attempts`);
      }
    }
  }

  /**
   * Start retry processor
   */
  private startRetryProcessor(): void {
    setInterval(() => {
      if (this.retryQueue.length === 0) return;

      console.log(`🔄 Processing ${this.retryQueue.length} webhook retries`);

      const toRetry = this.retryQueue.splice(0, 10); // Process 10 at a time

      toRetry.forEach(delivery => {
        // Exponential backoff: 1min, 5min, 15min
        const backoffMinutes = Math.pow(3, delivery.attempt - 1);
        const timeSinceCreation = Date.now() - delivery.createdAt.getTime();
        const shouldRetry = timeSinceCreation > backoffMinutes * 60 * 1000;

        if (shouldRetry) {
          this.deliverWebhook(delivery);
        } else {
          // Put back in queue
          this.retryQueue.push(delivery);
        }
      });
    }, 60 * 1000); // Check every minute
  }

  /**
   * Get webhook deliveries
   */
  getWebhookDeliveries(webhookId: string, limit: number = 50): WebhookDelivery[] {
    return Array.from(this.deliveries.values())
      .filter(d => d.webhookId === webhookId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  /**
   * Verify webhook signature
   */
  verifySignature(payload: any, signature: string, secret: string): boolean {
    const expectedSignature = this.generateSignature(secret, payload);
    return signature === expectedSignature;
  }

  /**
   * Generate webhook signature
   */
  private generateSignature(secret: string, data: any): string {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(data));
    return hmac.digest('hex');
  }

  /**
   * Generate webhook secret
   */
  private generateSecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Rotate webhook secret
   */
  rotateSecret(webhookId: string): { secret: string } | null {
    const webhook = this.webhooks.get(webhookId);

    if (!webhook) {
      return null;
    }

    webhook.secret = this.generateSecret();

    console.log(`🔄 Webhook secret rotated: ${webhookId}`);

    return { secret: webhook.secret };
  }

  /**
   * Get webhook statistics
   */
  getStatistics(webhookId: string): {
    totalDeliveries: number;
    successRate: number;
    avgResponseTime: number;
    recentDeliveries: WebhookDelivery[];
  } | null {
    const webhook = this.webhooks.get(webhookId);

    if (!webhook) {
      return null;
    }

    const deliveries = this.getWebhookDeliveries(webhookId);
    const totalDeliveries = webhook.successCount + webhook.failureCount;
    const successRate =
      totalDeliveries > 0 ? (webhook.successCount / totalDeliveries) * 100 : 0;

    return {
      totalDeliveries,
      successRate,
      avgResponseTime: 150, // Simulated
      recentDeliveries: deliveries.slice(0, 10),
    };
  }

  /**
   * Get all supported events
   */
  getSupportedEvents(): Array<{
    event: WebhookEvent;
    description: string;
    example: any;
  }> {
    return [
      {
        event: 'document.created',
        description: 'Triggered when a new document is created',
        example: {
          documentId: 'doc_123',
          title: 'Contract.pdf',
          type: 'contract',
          userId: 'user_456',
        },
      },
      {
        event: 'document.updated',
        description: 'Triggered when a document is updated',
        example: {
          documentId: 'doc_123',
          changes: ['content', 'metadata'],
        },
      },
      {
        event: 'signature.requested',
        description: 'Triggered when a signature is requested',
        example: {
          requestId: 'sig_789',
          documentId: 'doc_123',
          signers: ['john@example.com'],
        },
      },
      {
        event: 'signature.completed',
        description: 'Triggered when all signatures are collected',
        example: {
          requestId: 'sig_789',
          documentId: 'doc_123',
          completedAt: new Date(),
        },
      },
      {
        event: 'payment.completed',
        description: 'Triggered when a payment is completed',
        example: {
          paymentId: 'pay_123',
          amount: 1500,
          invoiceId: 'inv_456',
        },
      },
      {
        event: 'compliance.checked',
        description: 'Triggered when compliance check completes',
        example: {
          documentId: 'doc_123',
          score: 85,
          standards: ['GDPR', 'CCPA'],
        },
      },
    ];
  }

  /**
   * Test webhook
   */
  async testWebhook(webhookId: string): Promise<{ success: boolean; error?: string }> {
    const webhook = this.webhooks.get(webhookId);

    if (!webhook) {
      return { success: false, error: 'Webhook not found' };
    }

    const testPayload = {
      event: 'document.created' as WebhookEvent,
      timestamp: new Date(),
      data: {
        test: true,
        documentId: 'test_doc_123',
        title: 'Test Document',
      },
      webhookId: webhook.id,
      signature: this.generateSignature(webhook.secret, { test: true }),
    };

    console.log(`🧪 Testing webhook: ${webhookId}`);

    try {
      // In production: make actual HTTP request
      // For now, simulate success
      const success = Math.random() > 0.2; // 80% success rate

      if (success) {
        console.log(`✅ Webhook test successful: ${webhookId}`);
        return { success: true };
      } else {
        throw new Error('Test delivery failed');
      }
    } catch (error: any) {
      console.error(`❌ Webhook test failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  /**
   * Generate ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default WebhookService;
