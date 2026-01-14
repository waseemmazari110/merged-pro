/**
 * RBAC UTILITIES & HELPERS
 * 
 * Comprehensive utilities for role-based access control
 * including role hierarchy, permission checking, and helpers.
 */

import { UserRole } from '@/lib/auth-roles';

/**
 * Role hierarchy - higher level roles inherit lower level permissions
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  guest: 1,
  owner: 2,
  admin: 3,
};

/**
 * Role descriptions for UI/documentation
 */
export const ROLE_DESCRIPTIONS: Record<UserRole, string> = {
  guest: 'Guest - Can browse properties and make bookings',
  owner: 'Owner - Can manage properties and view payments',
  admin: 'Admin - Full system access and management',
};

/**
 * Permissions per role - define what each role can do
 */
export const ROLE_PERMISSIONS: Record<UserRole, Set<string>> = {
  guest: new Set([
    'properties:view',
    'properties:search',
    'bookings:create',
    'bookings:view_own',
    'reviews:view',
  ]),
  owner: new Set([
    'properties:view',
    'properties:view_own',
    'properties:create',
    'properties:edit_own',
    'properties:delete_own',
    'properties:publish',
    'bookings:view_own',
    'bookings:view_property',
    'payments:view_own',
    'payments:download',
    'analytics:view_own',
    'settings:edit_own',
  ]),
  admin: new Set([
    'properties:view',
    'properties:view_own',
    'properties:create',
    'properties:edit',
    'properties:delete',
    'properties:edit_own',
    'properties:delete_own',
    'properties:publish',
    'properties:approve',
    'bookings:view',
    'bookings:view_own',
    'bookings:view_property',
    'bookings:manage',
    'payments:view',
    'payments:view_own',
    'payments:download',
    'users:view',
    'users:manage',
    'analytics:view',
    'analytics:view_own',
    'settings:view',
    'settings:edit',
    'settings:edit_own',
    'logs:view',
  ]),
};

/**
 * Check if a user role can perform a specific action
 */
export function canPerformAction(role: UserRole, action: string): boolean {
  return ROLE_PERMISSIONS[role].has(action);
}

/**
 * Check if a user with one role can manage a user with another role
 * (e.g., can this admin manage that owner?)
 */
export function canManageRole(
  actorRole: UserRole,
  targetRole: UserRole
): boolean {
  // Can only manage roles lower in hierarchy
  return ROLE_HIERARCHY[actorRole] > ROLE_HIERARCHY[targetRole];
}

/**
 * Get all accessible routes for a role
 */
export function getAccessibleRoutes(role: UserRole): string[] {
  const routes: Record<UserRole, string[]> = {
    guest: [
      '/',
      '/properties',
      '/properties/[id]',
      '/bookings',
      '/account/settings',
      '/account/bookings',
    ],
    owner: [
      '/owner/owner-dashboard',
      '/owner/my-properties',
      '/owner/my-properties/[id]',
      '/owner/my-properties/[id]/edit',
      '/owner/my-properties/[id]/availability',
      '/owner/my-bookings',
      '/owner/my-payments',
      '/owner/my-analytics',
      '/owner/account-settings',
      '/owner/subscription',
    ],
    admin: [
      '/admin/admin-dashboard',
      '/admin/all-properties',
      '/admin/all-properties/pending',
      '/admin/all-bookings',
      '/admin/users',
      '/admin/all-payments',
      '/admin/system-analytics',
      '/admin/system-settings',
      '/admin/logs',
    ],
  };
  return routes[role];
}

/**
 * Get the primary dashboard URL for a role
 */
export function getDashboardUrl(role: UserRole): string {
  const dashboards: Record<UserRole, string> = {
    guest: '/properties',
    owner: '/owner/owner-dashboard',
    admin: '/admin/admin-dashboard',
  };
  return dashboards[role];
}

/**
 * Check if user can view a resource
 * @param userRole - The user's role
 * @param resourceOwnerId - The ID of the resource owner
 * @param currentUserId - The current user's ID
 */
export function canViewResource(
  userRole: UserRole,
  resourceOwnerId: string,
  currentUserId: string
): boolean {
  // Admin can view everything
  if (userRole === 'admin') return true;
  
  // Owner can view their own resources
  if (userRole === 'owner') {
    return resourceOwnerId === currentUserId;
  }
  
  // Guest cannot view private resources
  return false;
}

/**
 * Check if user can edit a resource
 */
export function canEditResource(
  userRole: UserRole,
  resourceOwnerId: string,
  currentUserId: string
): boolean {
  // Admin can edit anything
  if (userRole === 'admin') return true;
  
  // Owner can only edit their own
  if (userRole === 'owner') {
    return resourceOwnerId === currentUserId;
  }
  
  // Guest cannot edit
  return false;
}

/**
 * Check if user can delete a resource
 */
export function canDeleteResource(
  userRole: UserRole,
  resourceOwnerId: string,
  currentUserId: string
): boolean {
  return canEditResource(userRole, resourceOwnerId, currentUserId);
}

/**
 * Validate role string - returns true if valid role
 */
export function isValidRole(role: string): role is UserRole {
  return ['guest', 'owner', 'admin'].includes(role);
}

/**
 * Get role badge color for UI
 */
export function getRoleColor(role: UserRole): string {
  const colors: Record<UserRole, string> = {
    guest: 'bg-blue-100 text-blue-800',
    owner: 'bg-purple-100 text-purple-800',
    admin: 'bg-red-100 text-red-800',
  };
  return colors[role];
}

/**
 * Check if multiple roles have a specific permission
 */
export function rolesHavePermission(
  roles: UserRole[],
  action: string
): boolean {
  return roles.some(role => canPerformAction(role, action));
}

/**
 * Get the highest role from a list of roles
 */
export function getHighestRole(roles: UserRole[]): UserRole {
  return roles.reduce((highest, current) => 
    ROLE_HIERARCHY[current] > ROLE_HIERARCHY[highest] ? current : highest
  );
}
