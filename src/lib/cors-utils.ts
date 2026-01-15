import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://merged-pro.vercel.app',
  'https://www.groupescapehouses.co.uk',
  'https://groupescapehouses.co.uk',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

export function addCorsHeaders(response: NextResponse, origin?: string): NextResponse {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  response.headers.set('Access-Control-Max-Age', '86400');

  return response;
}

export function handleCorsPreFlight(request: NextRequest): NextResponse | null {
  if (request.method === 'OPTIONS') {
    const response = new NextResponse(null, { status: 200 });
    return addCorsHeaders(response, request.headers.get('origin') || undefined);
  }
  return null;
}
