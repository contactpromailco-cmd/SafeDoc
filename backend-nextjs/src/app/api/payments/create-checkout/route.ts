import { NextRequest, NextResponse } from 'next/server';
import StripeService from '@/services/StripeService';

const stripeService = new StripeService();

export async function POST(request: NextRequest) {
  try {
    const { plan, interval, userId, email } = await request.json();

    if (!plan || !interval || !userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!stripeService.isConfigured()) {
      return NextResponse.json(
        { error: 'Payment system not configured' },
        { status: 503 }
      );
    }

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    const result = await stripeService.createCheckoutSession(
      plan as 'pro' | 'business',
      interval as 'monthly' | 'yearly',
      email,
      userId,
      `${frontendUrl}/payment-success`,
      `${frontendUrl}/pricing`
    );

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      sessionId: result.sessionId,
      url: result.url,
    });
  } catch (error) {
    console.error('Create checkout error:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
