/**
 * Role-based Authorization Utilities
 * 
 * This file contains utilities for role-based access control
 * Roles: guest, owner, admin
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from './auth';
import { headers } from 'next/headers';
import { db } from '@/db';
import { user } from '@/db/schema';
import { eq } from 'drizzle-orm';

export type UserRole = 'guest' | 'owner' | 'admin';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  companyName?: string;
}

/**
 * Get the current authenticated user with role information from database
 */
export async function getCurrentUserWithRole(): Promise<AuthenticatedUser | null> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return null;
    }

    // Fetch user from database to get actual role
    const [userProfile] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        companyName: user.companyName,
      })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    if (!userProfile) {
      return null;
    }

    return {
      id: userProfile.id,
      name: userProfile.name,
      email: userProfile.email,
      role: (userProfile.role as UserRole) || 'guest',
      phone: userProfile.phone || undefined,
      companyName: userProfile.companyName || undefined,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

/**
 * Check if user has required role
 */
export function hasRole(user: AuthenticatedUser | null, allowedRoles: UserRole[]): boolean {
  if (!user) return false;
  return allowedRoles.includes(user.role);
}

/**
 * Check if user is admin
 */
export function isAdmin(user: AuthenticatedUser | null): boolean {
  return hasRole(user, ['admin']);
}

/**
 * Check if user is owner
 */
export function isOwner(user: AuthenticatedUser | null): boolean {
  return hasRole(user, ['owner']);
}

/**
 * Check if user is guest
 */
export function isGuest(user: AuthenticatedUser | null): boolean {
  return hasRole(user, ['guest']);
}

/**
 * Check if user can access owner features (owner or admin)
 */
export function canAccessOwnerFeatures(user: AuthenticatedUser | null): boolean {
  return hasRole(user, ['owner', 'admin']);
}

/**
 * Check if user can access admin features
 */
export function canAccessAdminFeatures(user: AuthenticatedUser | null): boolean {
  return hasRole(user, ['admin']);
}

/**
 * Middleware wrapper to require authentication
 */
export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getCurrentUserWithRole();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}

/**
 * Middleware wrapper to require specific roles
 */
export async function requireRole(allowedRoles: UserRole[]): Promise<AuthenticatedUser> {
  const user = await requireAuth();
  
  if (!hasRole(user, allowedRoles)) {
    throw new Error(`Unauthorized. Required roles: ${allowedRoles.join(', ')}`);
  }
  
  return user;
}

/**
 * Create an unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized') {
  return NextResponse.json(
    { error: message, code: 'UNAUTHORIZED' },
    { status: 403 }
  );
}

/**
 * Create an unauthenticated response
 */
export function unauthenticatedResponse(message: string = 'Authentication required') {
  return NextResponse.json(
    { error: message, code: 'UNAUTHENTICATED' },
    { status: 401 }
  );
}

/**
 * API Route Handler wrapper for role-based access
 * Usage:
 * 
 * export const GET = withRoles(['admin'], async (request, user) => {
 *   // Your handler code here
 *   // user is guaranteed to be authenticated with correct role
 * });
 */
export function withRoles(
  allowedRoles: UserRole[],
  handler: (request: NextRequest, user: AuthenticatedUser) => Promise<NextResponse>
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    try {
      const user = await requireRole(allowedRoles);
      return await handler(request, user);
    } catch (error: any) {
      if (error.message === 'Authentication required') {
        return unauthenticatedResponse();
      }
      if (error.message?.includes('Unauthorized')) {
        return unauthorizedResponse(error.message);
      }
      console.error('Role middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error', code: 'SERVER_ERROR' },
        { status: 500 }
      );
    }
  };
}

/**
 * Check if user owns a specific property
 */
export function isPropertyOwner(user: AuthenticatedUser | null, propertyOwnerId: string | null): boolean {
  if (!user || !propertyOwnerId) return false;
  
  // Admin can access all properties
  if (isAdmin(user)) return true;
  
  // Owner can only access their own properties
  if (isOwner(user)) return user.id === propertyOwnerId;
  
  return false;
}
