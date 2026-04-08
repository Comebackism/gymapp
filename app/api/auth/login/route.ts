import { NextRequest, NextResponse } from 'next/server';

// Mock user database - in production, this would be a real database
const users = [
  {
    id: '1',
    email: 'admin@gymapp.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJflHQrxG' // 'SecurePass123!'
  },
  {
    id: '2', 
    email: 'user@gymapp.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj3QJflHQrxG' // 'SecurePass123!'
  }
];

// Simple rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Simple validation
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = users.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // For demo, accept the specific password
    if (password === 'SecurePass123!') {
      // Generate simple token (in production, use proper JWT)
      const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');
      
      return NextResponse.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          email: user.email
        }
      });
    }

    return NextResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Login error:', error);
    
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
