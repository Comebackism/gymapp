import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Simple validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { message: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    // In a real application, you would:
    // 1. Check if email already exists
    // 2. Hash the password with bcrypt
    // 3. Save the user to the database

    // For this mock demo, we just simulate success
    const newUserId = Math.random().toString(36).substring(2, 9);
    
    // Generate simple token
    const token = Buffer.from(`${newUserId}:${email}:${Date.now()}`).toString('base64');
    
    return NextResponse.json({
      message: 'Signup successful',
      token,
      user: {
        id: newUserId,
        name,
        email
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    
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
