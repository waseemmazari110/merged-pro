/**
 * Rate Limiting Middleware for Public APIs
 * 
 * Protects public endpoints from abuse with:
 * - IP-based rate limiting
 * - API key validation
 * - Request counting and windowing
 * - Automatic cleanup of old entries
 */

import { NextRequest, NextResponse } from 'next/server';

// ============================================
// CONFIGURATION
// ============================================

const RATE_LIMITS = {
  // Public endpoints (no API key)
  public: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30, // 30 requests per minute
  },
  // Authenticated endpoints (with API key)
  authenticated: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
  },
  // Premium tier (for Orchards website)
  premium: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 300, // 300 requests per minute
  },
};

// ============================================
// IN-MEMORY STORAGE
// ============================================

interface RateLimitRecord {
  count: number;
  resetTime: number;
  tier: 'public' | 'authenticated' | 'premium';
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

// ============================================
// API KEY MANAGEMENT
// ============================================

// In production, store these in environment variables or database
const API_KEYS = new Map<string, { name: string; tier: 'authenticated' | 'premium' }>([
  ['orchards_live_key_2025', { name: 'Orchards Website', tier: 'premium' }],
  ['demo_api_key_standard', { name: 'Demo Standard', tier: 'authenticated' }],
]);

/**
 * Validate API key and return tier
 */
export function validateApiKey(apiKey: string | null): { valid: boolean; tier: 'public' | 'authenticated' | 'premium'; name?: string } {
  if (!apiKey) {
    return { valid: true, tier: 'public' };
  }

  const keyInfo = API_KEYS.get(apiKey);
  if (!keyInfo) {
    return { valid: false, tier: 'public' };
  }

  return { valid: true, tier: keyInfo.tier, name: keyInfo.name };
}

// ============================================
// RATE LIMITING LOGIC
// ============================================

/**
 * Get client identifier (IP address)
 */
function getClientIdentifier(request: NextRequest): string {
  // Check for real IP in various headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  
  const ip = forwardedFor?.split(',')[0].trim() 
    || realIp 
    || cfConnectingIp 
    || 'unknown';
  
  return ip;
}

/**
 * Check if request is rate limited
 */
export function checkRateLimit(
  request: NextRequest,
  tier: 'public' | 'authenticated' | 'premium'
): { allowed: boolean; limit: number; remaining: number; resetTime: number } {
  const clientId = getClientIdentifier(request);
  const now = Date.now();
  
  // Get rate limit config for tier
  const config = RATE_LIMITS[tier];
  
  // Get or create record
  let record = rateLimitStore.get(clientId);
  
  if (!record || now > record.resetTime) {
    // Create new record
    record = {
      count: 0,
      resetTime: now + config.windowMs,
      tier,
    };
    rateLimitStore.set(clientId, record);
  }
  
  // Check if limit exceeded
  if (record.count >= config.maxRequests) {
    return {
      allowed: false,
      limit: config.maxRequests,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }
  
  // Increment counter
  record.count++;
  
  return {
    allowed: true,
    limit: config.maxRequests,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Apply rate limiting to a request
 */
export function rateLimit(
  request: NextRequest,
  options: { requireApiKey?: boolean } = {}
): { success: true; tier: 'public' | 'authenticated' | 'premium'; name?: string } | { success: false; error: NextResponse } {
  // Check API key
  const apiKey = request.headers.get('x-api-key') || request.nextUrl.searchParams.get('apiKey');
  const keyValidation = validateApiKey(apiKey);
  
  if (options.requireApiKey && !apiKey) {
    return {
      success: false,
      error: NextResponse.json(
        {
          error: 'API key required',
          message: 'This endpoint requires an API key. Include it in the X-API-Key header or apiKey query parameter.',
        },
        { status: 401 }
      ),
    };
  }
  
  if (apiKey && !keyValidation.valid) {
    return {
      success: false,
      error: NextResponse.json(
        {
          error: 'Invalid API key',
          message: 'The provided API key is invalid or expired.',
        },
        { status: 401 }
      ),
    };
  }
  
  // Check rate limit
  const rateLimitResult = checkRateLimit(request, keyValidation.tier);
  
  if (!rateLimitResult.allowed) {
    const retryAfter = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000);
    
    return {
      success: false,
      error: NextResponse.json(
        {
          error: 'Rate limit exceeded',
          message: `Too many requests. Rate limit: ${rateLimitResult.limit} requests per minute.`,
          limit: rateLimitResult.limit,
          remaining: 0,
          resetTime: rateLimitResult.resetTime,
          retryAfter,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString(),
            'Retry-After': retryAfter.toString(),
          },
        }
      ),
    };
  }
  
  return {
    success: true,
    tier: keyValidation.tier,
    name: keyValidation.name,
  };
}

/**
 * Add rate limit headers to response
 */
export function addRateLimitHeaders(
  response: NextResponse,
  request: NextRequest,
  tier: 'public' | 'authenticated' | 'premium'
): NextResponse {
  const clientId = getClientIdentifier(request);
  const record = rateLimitStore.get(clientId);
  const config = RATE_LIMITS[tier];
  
  if (record) {
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', Math.max(0, config.maxRequests - record.count).toString());
    response.headers.set('X-RateLimit-Reset', record.resetTime.toString());
  }
  
  return response;
}

// ============================================
// STATISTICS & MONITORING
// ============================================

/**
 * Get rate limit statistics
 */
export function getRateLimitStats(): {
  totalClients: number;
  tierBreakdown: Record<string, number>;
  topClients: Array<{ ip: string; count: number; tier: string }>;
} {
  const tierCounts: Record<string, number> = { public: 0, authenticated: 0, premium: 0 };
  const clientData: Array<{ ip: string; count: number; tier: string }> = [];
  
  for (const [ip, record] of rateLimitStore.entries()) {
    tierCounts[record.tier]++;
    clientData.push({ ip, count: record.count, tier: record.tier });
  }
  
  // Sort by request count
  clientData.sort((a, b) => b.count - a.count);
  
  return {
    totalClients: rateLimitStore.size,
    tierBreakdown: tierCounts,
    topClients: clientData.slice(0, 10),
  };
}

/**
 * Clear rate limit for specific IP (admin function)
 */
export function clearRateLimit(ip: string): boolean {
  return rateLimitStore.delete(ip);
}

/**
 * Clear all rate limits (admin function)
 */
export function clearAllRateLimits(): void {
  rateLimitStore.clear();
}
