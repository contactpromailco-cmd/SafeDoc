import { NextRequest, NextResponse } from 'next/server';
import StripeService from '@/services/StripeService';

const stripeService = new StripeService();

export async function POST(request: NextRequest) {
  try {
    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json(
        { error: 'Customer ID required' },
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

    const result = await stripeService.createPortalSession(
      customerId,
      `${frontendUrl}/dashboard`
    );

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      url: result.url,
    });
  } catch (error) {
    console.error('Create portal error:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
