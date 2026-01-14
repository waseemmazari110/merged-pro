/**
 * Cache Management Utility
 * Handles cache invalidation and revalidation across the application
 */

import { revalidatePath, revalidateTag } from 'next/cache';

/**
 * Cache tags for different data types
 */
export const CacheTags = {
  // Properties
  PROPERTIES: 'properties',
  PROPERTY: (id: string) => `property-${id}`,
  OWNER_PROPERTIES: (userId: string) => `owner-properties-${userId}`,
  
  // Bookings
  BOOKINGS: 'bookings',
  BOOKING: (id: string) => `booking-${id}`,
  OWNER_BOOKINGS: (userId: string) => `owner-bookings-${userId}`,
  PROPERTY_BOOKINGS: (propertyId: string) => `property-bookings-${propertyId}`,
  
  // Payments & Transactions
  PAYMENTS: 'payments',
  TRANSACTIONS: 'transactions',
  OWNER_PAYMENTS: (userId: string) => `owner-payments-${userId}`,
  
  // Subscriptions
  SUBSCRIPTIONS: 'subscriptions',
  USER_SUBSCRIPTION: (userId: string) => `subscription-${userId}`,
  
  // Approvals
  APPROVALS: 'approvals',
  PROPERTY_APPROVAL: (propertyId: string) => `approval-${propertyId}`,
  
  // Availability
  AVAILABILITY: (propertyId: string) => `availability-${propertyId}`,
  
  // Dashboard
  OWNER_DASHBOARD: (userId: string) => `owner-dashboard-${userId}`,
  ADMIN_DASHBOARD: 'admin-dashboard',
} as const;

/**
 * Revalidate owner dashboard and related data
 */
export async function revalidateOwnerDashboard(userId: string) {
  'use server';
  revalidatePath('/owner/dashboard');
  revalidateTag(CacheTags.OWNER_DASHBOARD(userId), {});
  revalidateTag(CacheTags.OWNER_PROPERTIES(userId), {});
  revalidateTag(CacheTags.OWNER_BOOKINGS(userId), {});
  revalidateTag(CacheTags.OWNER_PAYMENTS(userId), {});
}

/**
 * Revalidate admin dashboard and related data
 */
export async function revalidateAdminDashboard() {
  'use server';
  revalidatePath('/admin/dashboard');
  revalidateTag(CacheTags.ADMIN_DASHBOARD, {});
  revalidateTag(CacheTags.PROPERTIES, {});
  revalidateTag(CacheTags.BOOKINGS, {});
  revalidateTag(CacheTags.TRANSACTIONS, {});
  revalidateTag(CacheTags.APPROVALS, {});
}

/**
 * Revalidate property-related cache
 */
export async function revalidateProperty(propertyId: string, ownerId?: string) {
  'use server';
  revalidatePath('/properties');
  revalidatePath(`/properties/${propertyId}`);
  revalidateTag(CacheTags.PROPERTIES, {});
  revalidateTag(CacheTags.PROPERTY(propertyId), {});
  revalidateTag(CacheTags.PROPERTY_BOOKINGS(propertyId), {});
  revalidateTag(CacheTags.PROPERTY_APPROVAL(propertyId), {});
  
  if (ownerId) {
    revalidateTag(CacheTags.OWNER_PROPERTIES(ownerId), {});
    await revalidateOwnerDashboard(ownerId);
  }
}

/**
 * Revalidate booking-related cache
 */
export async function revalidateBooking(bookingId: string, propertyId: string, ownerId?: string) {
  'use server';
  revalidatePath('/bookings');
  revalidateTag(CacheTags.BOOKINGS, {});
  revalidateTag(CacheTags.BOOKING(bookingId), {});
  revalidateTag(CacheTags.PROPERTY_BOOKINGS(propertyId), {});
  revalidateTag(CacheTags.AVAILABILITY(propertyId), {});
  
  if (ownerId) {
    revalidateTag(CacheTags.OWNER_BOOKINGS(ownerId), {});
    await revalidateOwnerDashboard(ownerId);
  }
  
  await revalidateAdminDashboard();
}

/**
 * Revalidate payment/transaction-related cache
 */
export async function revalidatePayment(userId: string) {
  'use server';
  revalidateTag(CacheTags.PAYMENTS, {});
  revalidateTag(CacheTags.TRANSACTIONS, {});
  revalidateTag(CacheTags.OWNER_PAYMENTS(userId), {});
  await revalidateOwnerDashboard(userId);
  await revalidateAdminDashboard();
}

/**
 * Revalidate subscription-related cache
 */
export async function revalidateSubscription(userId: string) {
  'use server';
  revalidateTag(CacheTags.SUBSCRIPTIONS, {});
  revalidateTag(CacheTags.USER_SUBSCRIPTION(userId), {});
  await revalidateOwnerDashboard(userId);
  await revalidateAdminDashboard();
}

/**
 * Revalidate approval-related cache
 */
export async function revalidateApproval(propertyId: string, ownerId?: string) {
  'use server';
  revalidateTag(CacheTags.APPROVALS, {});
  revalidateTag(CacheTags.PROPERTY_APPROVAL(propertyId), {});
  await revalidateProperty(propertyId, ownerId);
  await revalidateAdminDashboard();
}

/**
 * Revalidate availability calendar
 */
export async function revalidateAvailability(propertyId: string, ownerId?: string) {
  'use server';
  revalidateTag(CacheTags.AVAILABILITY(propertyId), {});
  
  if (ownerId) {
    await revalidateOwnerDashboard(ownerId);
  }
}

/**
 * Clear all cache (use sparingly)
 */
export async function revalidateAll() {
  'use server';
  revalidatePath('/', 'layout');
}
