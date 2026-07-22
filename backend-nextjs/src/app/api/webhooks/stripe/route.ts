import { NextRequest, NextResponse } from 'next/server';
import StripeService from '@/services/StripeService';
import AuthService from '@/services/AuthService';

const stripeService = new StripeService();
const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 400 }
      );
    }

    const result = await stripeService.handleWebhook(body, signature);

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    const event = result.event;

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        const userId = session.client_reference_id || session.metadata?.userId;
        const plan = session.metadata?.plan;
        
        if (userId && plan) {
          authService.updateUserPlan(
            userId,
            plan as 'free' | 'pro' | 'business',
            session.customer as string,
            session.subscription as string
          );
          console.log(`✅ Subscription activated: ${userId} → ${plan}`);
        }
        break;

      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        const customerId = subscription.customer;
        
        // Downgrade user to free plan
        const users = authService.getAllUsers();
        const user = users.find(u => u.stripeCustomerId === customerId);
        if (user) {
          authService.updateUserPlan(user.id, 'free');
          console.log(`⬇️ Subscription cancelled: ${user.email} → free`);
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
