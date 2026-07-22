import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/services/AuthService';

const authService = new AuthService();

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ 
        error: 'Name, email, and password are required' 
      }, { status: 400 });
    }

    const result = await authService.register(name, email, password);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      token: result.token,
      user: result.user
    });

  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      error: 'Registration failed',
      details: error.message 
    }, { status: 500 });
  }
}
