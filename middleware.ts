import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/api/auth/login'];

  // Allow access to public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // For demo purposes, allow dashboard access without strict token validation
  // In production, implement proper token validation
  if (pathname.startsWith('/dashboard')) {
    // Simple check - in production, validate JWT token properly
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/:path*',
    '/login'
  ]
};
