import { NextRequest } from 'next/server';

export interface RateLimitInfo {
  attempts: number;
  resetTime: number;
  isBlocked: boolean;
}

const rateLimitStore = new Map<string, RateLimitInfo>();

export const rateLimit = (
  identifier: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): RateLimitInfo => {
  const now = Date.now();
  const existing = rateLimitStore.get(identifier);

  if (!existing || now > existing.resetTime) {
    const newLimit: RateLimitInfo = {
      attempts: 1,
      resetTime: now + windowMs,
      isBlocked: false
    };
    rateLimitStore.set(identifier, newLimit);
    return newLimit;
  }

  const updatedLimit: RateLimitInfo = {
    attempts: existing.attempts + 1,
    resetTime: existing.resetTime,
    isBlocked: existing.attempts + 1 > maxAttempts
  };

  rateLimitStore.set(identifier, updatedLimit);
  return updatedLimit;
};

export const getClientIP = (request: NextRequest): string => {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIP || request.ip || 'unknown';
  return ip;
};

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export const validateCSRFToken = (token: string, sessionToken: string): boolean => {
  return token === sessionToken;
};

export const headers = {
  'Content-Type': 'application/json',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
};
