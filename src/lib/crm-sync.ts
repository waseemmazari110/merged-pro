/**
 * Milestone 5: CRM Sync - Membership Status Synchronization
 * Sync subscription status with user roles and CRM
 * All timestamps in DD/MM/YYYY HH:mm:ss UK time format
 */

import { db } from '@/db';
import { user, subscriptions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { nowUKFormatted } from '@/lib/date-utils';

// ============================================
// TYPES
// ============================================

export type MembershipStatus = 
  | 'free'           // No subscription
  | 'trial'          // In trial period
  | 'active'         // Active paid subscription
  | 'past_due'       // Payment failed, in retry
  | 'suspended'      // Account suspended
  | 'cancelled'      // Subscription cancelled
  | 'expired';       // Subscription expired

export type UserRole = 'guest' | 'owner' | 'admin';

export interface MembershipData {
  userId: string;
  status: MembershipStatus;
  role: UserRole;
  tier: 'free' | 'basic' | 'premium' | 'enterprise';
  planName: string | null;
  subscriptionId: string | null;
  
  // Dates
  subscriptionStart: string | null; // DD/MM/YYYY
  subscriptionEnd: string | null; // DD/MM/YYYY
  trialEnd: string | null; // DD/MM/YYYY
  
  // Limits
  maxProperties: number;
  maxPhotos: number;
  featuredListings: boolean;
  
  // Features
  hasAnalytics: boolean;
  hasPrioritySupport: boolean;
  hasApiAccess: boolean;
  hasCustomDomain: boolean;
  
  // Metadata
  lastSyncedAt: string; // DD/MM/YYYY HH:mm:ss
}

export interface CRMSyncResult {
  success: boolean;
  userId: string;
  previousStatus: MembershipStatus;
  newStatus: MembershipStatus;
  previousRole: UserRole;
  newRole: UserRole;
  changes: string[];
  syncedAt: string; // DD/MM/YYYY HH:mm:ss
}

// ============================================
// LOGGING
// ============================================

function logCRMSync(action: string, details?: any) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] CRM Sync: ${action}`, details || '');
}

// ============================================
// PLAN LIMITS
// ============================================

const PLAN_LIMITS = {
  free: {
    maxProperties: 1,
    maxPhotos: 10,
    featuredListings: false,
    hasAnalytics: false,
    hasPrioritySupport: false,
    hasApiAccess: false,
    hasCustomDomain: false,
  },
  basic: {
    maxProperties: 5,
    maxPhotos: 20,
    featuredListings: false,
    hasAnalytics: true,
    hasPrioritySupport: false,
    hasApiAccess: false,
    hasCustomDomain: false,
  },
  premium: {
    maxProperties: 25,
    maxPhotos: 50,
    featuredListings: true,
    hasAnalytics: true,
    hasPrioritySupport: true,
    hasApiAccess: false,
    hasCustomDomain: false,
  },
  enterprise: {
    maxProperties: -1, // unlimited
    maxPhotos: -1, // unlimited
    featuredListings: true,
    hasAnalytics: true,
    hasPrioritySupport: true,
    hasApiAccess: true,
    hasCustomDomain: true,
  },
};

// ============================================
// MEMBERSHIP STATUS FUNCTIONS
// ============================================

/**
 * Determine membership status from subscription
 */
function determineMembershipStatus(subscription: any): MembershipStatus {
  if (!subscription) {
    return 'free';
  }

  // Check trial
  if (subscription.trialEnd) {
    const trialEndParts = subscription.trialEnd.split('/');
    const trialEndDate = new Date(
      parseInt(trialEndParts[2]),
      parseInt(trialEndParts[1]) - 1,
      parseInt(trialEndParts[0])
    );
    const now = new Date();
    
    if (now < trialEndDate) {
      return 'trial';
    }
  }

  // Map subscription status
  switch (subscription.status) {
    case 'active':
      return 'active';
    case 'past_due':
      return 'past_due';
    case 'suspended':
      return 'suspended';
    case 'cancelled':
    case 'canceled':
      return 'cancelled';
    case 'incomplete':
    case 'incomplete_expired':
      return 'expired';
    default:
      return 'free';
  }
}

/**
 * Determine user role from membership status
 */
function determineUserRole(status: MembershipStatus, currentRole: UserRole): UserRole {
  // Admins always remain admins
  if (currentRole === 'admin') {
    return 'admin';
  }

  // Suspended or cancelled users become guests
  if (status === 'suspended' || status === 'cancelled' || status === 'expired') {
    return 'guest';
  }

  // Active, trial, or past_due users are owners
  if (status === 'active' || status === 'trial' || status === 'past_due') {
    return 'owner';
  }

  // Free users remain guests
  return 'guest';
}

/**
 * Extract tier from plan name
 */
function extractTier(planName: string | null): 'free' | 'basic' | 'premium' | 'enterprise' {
  if (!planName) return 'free';
  
  const lowerName = planName.toLowerCase();
  
  if (lowerName.includes('enterprise')) return 'enterprise';
  if (lowerName.includes('premium')) return 'premium';
  if (lowerName.includes('basic')) return 'basic';
  
  return 'free';
}

// ============================================
// SYNC FUNCTIONS
// ============================================

/**
 * Get current membership data for user
 */
export async function getMembershipData(userId: string): Promise<MembershipData | null> {
  try {
    logCRMSync('Fetching membership data', { userId });

    // Get user
    const [userData] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!userData) {
      logCRMSync('User not found', { userId });
      return null;
    }

    // Get subscription
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    const status = determineMembershipStatus(subscription);
    const role = userData.role as UserRole;
    const tier = subscription ? extractTier(subscription.planName) : 'free';
    const limits = PLAN_LIMITS[tier];

    const membershipData: MembershipData = {
      userId,
      status,
      role,
      tier,
      planName: subscription?.planName || null,
      subscriptionId: subscription?.id ? subscription.id.toString() : null,
      
      subscriptionStart: subscription?.currentPeriodStart || null,
      subscriptionEnd: subscription?.currentPeriodEnd || null,
      trialEnd: subscription?.trialEnd || null,
      
      maxProperties: limits.maxProperties,
      maxPhotos: limits.maxPhotos,
      featuredListings: limits.featuredListings,
      
      hasAnalytics: limits.hasAnalytics,
      hasPrioritySupport: limits.hasPrioritySupport,
      hasApiAccess: limits.hasApiAccess,
      hasCustomDomain: limits.hasCustomDomain,
      
      lastSyncedAt: nowUKFormatted(),
    };

    logCRMSync('Membership data retrieved', {
      userId,
      status,
      tier,
    });

    return membershipData;

  } catch (error) {
    logCRMSync('Failed to get membership data', {
      userId,
      error: (error as Error).message,
    });
    return null;
  }
}

/**
 * Sync membership status for user
 */
export async function syncMembershipStatus(userId: string): Promise<CRMSyncResult> {
  try {
    logCRMSync('Starting membership sync', { userId });

    // Get current user data
    const [currentUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!currentUser) {
      throw new Error('User not found');
    }

    const previousRole = currentUser.role as UserRole;

    // Get subscription
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    // Determine new status
    const newStatus = determineMembershipStatus(subscription);
    const newRole = determineUserRole(newStatus, previousRole);

    // Track changes
    const changes: string[] = [];
    const previousStatus = subscription?.status as MembershipStatus || 'free';

    // Update user role if changed
    if (newRole !== previousRole) {
      await db
        .update(user)
        .set({ role: newRole })
        .where(eq(user.id, userId));

      changes.push(`Role updated: ${previousRole} → ${newRole}`);
    }

    // Log status change
    if (newStatus !== previousStatus) {
      changes.push(`Status updated: ${previousStatus} → ${newStatus}`);
    }

    const result: CRMSyncResult = {
      success: true,
      userId,
      previousStatus,
      newStatus,
      previousRole,
      newRole,
      changes,
      syncedAt: nowUKFormatted(),
    };

    logCRMSync('Membership sync completed', {
      userId,
      changes: changes.length,
    });

    return result;

  } catch (error) {
    logCRMSync('Membership sync failed', {
      userId,
      error: (error as Error).message,
    });

    throw error;
  }
}

/**
 * Sync all users' membership status
 */
export async function syncAllMemberships(): Promise<{
  total: number;
  succeeded: number;
  failed: number;
  results: CRMSyncResult[];
}> {
  try {
    logCRMSync('Starting bulk membership sync');

    const allUsers = await db.select().from(user);
    const results: CRMSyncResult[] = [];
    let succeeded = 0;
    let failed = 0;

    for (const userData of allUsers) {
      try {
        const result = await syncMembershipStatus(userData.id);
        results.push(result);
        succeeded++;
      } catch (error) {
        failed++;
        logCRMSync('Failed to sync user', {
          userId: userData.id,
          error: (error as Error).message,
        });
      }
    }

    logCRMSync('Bulk sync completed', {
      total: allUsers.length,
      succeeded,
      failed,
    });

    return {
      total: allUsers.length,
      succeeded,
      failed,
      results,
    };

  } catch (error) {
    logCRMSync('Bulk sync failed', {
      error: (error as Error).message,
    });
    throw error;
  }
}

/**
 * Update membership status after payment event
 */
export async function updateMembershipAfterPayment(
  userId: string,
  paymentSuccess: boolean
): Promise<CRMSyncResult> {
  try {
    logCRMSync('Updating membership after payment', {
      userId,
      paymentSuccess,
    });

    if (paymentSuccess) {
      // Payment succeeded - ensure user is owner with active status
      const [userData] = await db
        .select()
        .from(user)
        .where(eq(user.id, userId))
        .limit(1);

      const previousRole = userData?.role as UserRole;

      if (previousRole !== 'admin' && previousRole !== 'owner') {
        await db
          .update(user)
          .set({ role: 'owner' })
          .where(eq(user.id, userId));
      }
    }

    // Sync full membership status
    const result = await syncMembershipStatus(userId);

    logCRMSync('Membership updated after payment', {
      userId,
      newStatus: result.newStatus,
    });

    return result;

  } catch (error) {
    logCRMSync('Failed to update membership after payment', {
      userId,
      error: (error as Error).message,
    });
    throw error;
  }
}

/**
 * Downgrade user after subscription cancellation
 */
export async function downgradeAfterCancellation(userId: string): Promise<CRMSyncResult> {
  try {
    logCRMSync('Downgrading user after cancellation', { userId });

    // Update user role to guest
    await db
      .update(user)
      .set({ role: 'guest' })
      .where(eq(user.id, userId));

    // Sync membership status
    const result = await syncMembershipStatus(userId);

    logCRMSync('User downgraded after cancellation', {
      userId,
      newRole: result.newRole,
    });

    return result;

  } catch (error) {
    logCRMSync('Failed to downgrade user', {
      userId,
      error: (error as Error).message,
    });
    throw error;
  }
}

// ============================================
// FEATURE ACCESS CHECKS
// ============================================

/**
 * Check if user can access feature
 */
export async function canAccessFeature(
  userId: string,
  feature: keyof typeof PLAN_LIMITS.free
): Promise<boolean> {
  try {
    const membership = await getMembershipData(userId);
    if (!membership) return false;

    const limits = PLAN_LIMITS[membership.tier];
    return limits[feature] as boolean;

  } catch (error) {
    logCRMSync('Failed to check feature access', {
      userId,
      feature,
      error: (error as Error).message,
    });
    return false;
  }
}

/**
 * Check if user can add property
 */
export async function canAddProperty(userId: string, currentCount: number): Promise<boolean> {
  try {
    const membership = await getMembershipData(userId);
    if (!membership) return false;

    // Unlimited
    if (membership.maxProperties === -1) return true;

    return currentCount < membership.maxProperties;

  } catch (error) {
    logCRMSync('Failed to check property limit', {
      userId,
      error: (error as Error).message,
    });
    return false;
  }
}

/**
 * Get membership summary for dashboard
 */
export async function getMembershipSummary() {
  try {
    const allUsers = await db.select().from(user);
    const allSubscriptions = await db.select().from(subscriptions);

    const summary = {
      total: allUsers.length,
      byRole: {
        guest: allUsers.filter(u => u.role === 'guest').length,
        owner: allUsers.filter(u => u.role === 'owner').length,
        admin: allUsers.filter(u => u.role === 'admin').length,
      },
      byTier: {
        free: 0,
        basic: 0,
        premium: 0,
        enterprise: 0,
      },
      byStatus: {
        free: 0,
        trial: 0,
        active: 0,
        past_due: 0,
        suspended: 0,
        cancelled: 0,
        expired: 0,
      },
      generatedAt: nowUKFormatted(),
    };

    // Count by tier and status
    for (const sub of allSubscriptions) {
      const tier = extractTier(sub.planName);
      summary.byTier[tier]++;

      const status = determineMembershipStatus(sub);
      summary.byStatus[status]++;
    }

    // Count free users (no subscription)
    summary.byTier.free = allUsers.length - allSubscriptions.length;
    summary.byStatus.free = allUsers.length - allSubscriptions.length;

    return summary;

  } catch (error) {
    logCRMSync('Failed to get membership summary', {
      error: (error as Error).message,
    });
    return null;
  }
}

// ============================================
// STEP 5: CRM SYNC FOR PAYMENT EVENTS
// ============================================

/**
 * Sync subscription status to CRM on payment events
 * Triggered by: payment success, payment failure, subscription cancellation
 */
export async function syncSubscriptionStatusToCRM(
  userId: string,
  eventType: 'payment_success' | 'payment_failure' | 'subscription_cancelled' | 'subscription_renewed',
  metadata?: {
    amount?: number;
    currency?: string;
    subscriptionId?: number;
    planName?: string;
    failureReason?: string;
  }
): Promise<{ success: boolean; syncedData: any }> {
  const timestamp = nowUKFormatted();
  
  try {
    logCRMSync(`Syncing ${eventType} to CRM`, { userId, metadata });

    // 1. Get user's current subscription and membership data
    const membership = await getMembershipData(userId);
    if (!membership) {
      throw new Error(`No membership data found for user ${userId}`);
    }

    // 2. Update CRM owner profile based on event
    const { crmOwnerProfiles, crmActivityLog, crmNotes, user: userTable } = await import('@/db/schema');
    
    // Check if CRM profile exists, create if not
    const existingProfile = await db
      .select()
      .from(crmOwnerProfiles)
      .where(eq(crmOwnerProfiles.userId, userId))
      .limit(1);

    if (!existingProfile || existingProfile.length === 0) {
      // Create CRM profile
      const userData = await db
        .select()
        .from(userTable)
        .where(eq(userTable.id, userId))
        .limit(1);

      if (userData && userData.length > 0) {
        await db.insert(crmOwnerProfiles).values({
          userId,
          businessName: userData[0].companyName || null,
          address: null,
          city: null,
          state: null,
          postalCode: null,
          country: 'UK',
          alternatePhone: userData[0].phone || null,
          alternateEmail: null,
          preferredContactMethod: 'email',
          notes: `CRM profile auto-created on ${timestamp}`,
          tags: JSON.stringify(['owner', 'auto-created']),
          source: 'website',
          status: 'active',
          createdAt: timestamp,
          updatedAt: timestamp,
        });

        logCRMSync('Created CRM profile', { userId });
      }
    }

    // 3. Update CRM profile status based on event
    const profileStatus = 
      eventType === 'payment_success' || eventType === 'subscription_renewed' ? 'active' :
      eventType === 'payment_failure' ? 'suspended' :
      eventType === 'subscription_cancelled' ? 'inactive' : 'active';

    await db
      .update(crmOwnerProfiles)
      .set({
        status: profileStatus,
        updatedAt: timestamp,
      })
      .where(eq(crmOwnerProfiles.userId, userId));

    logCRMSync('Updated CRM profile status', { userId, profileStatus });

    // 4. Log activity in CRM
    const activityTitle = 
      eventType === 'payment_success' ? `Payment received: ${metadata?.currency} ${metadata?.amount}` :
      eventType === 'payment_failure' ? `Payment failed: ${metadata?.currency} ${metadata?.amount}` :
      eventType === 'subscription_cancelled' ? `Subscription cancelled: ${metadata?.planName}` :
      eventType === 'subscription_renewed' ? `Subscription renewed: ${metadata?.planName}` :
      'Subscription event';

    await db.insert(crmActivityLog).values({
      entityType: 'owner',
      entityId: userId,
      activityType: eventType === 'payment_success' || eventType === 'subscription_renewed' ? 'payment' : 'status_change',
      title: activityTitle,
      description: `${eventType.replace(/_/g, ' ')} event. Status: ${membership.status}, Tier: ${membership.tier}`,
      outcome: eventType === 'payment_success' || eventType === 'subscription_renewed' ? 'success' : eventType,
      performedBy: 'system',
      metadata: JSON.stringify({
        ...metadata,
        membershipStatus: membership.status,
        membershipTier: membership.tier,
        subscriptionEnd: membership.subscriptionEnd,
      }),
      createdAt: timestamp,
    });

    logCRMSync('Logged CRM activity', { userId, eventType });

    // 5. Create high-priority note for failures or cancellations
    if (eventType === 'payment_failure' || eventType === 'subscription_cancelled') {
      const noteTitle = eventType === 'payment_failure' 
        ? 'URGENT: Subscription payment failed'
        : 'Subscription cancelled';
      
      const noteContent = eventType === 'payment_failure'
        ? `Subscription payment of ${metadata?.currency} ${metadata?.amount} failed. Reason: ${metadata?.failureReason || 'Unknown'}. Immediate follow-up required.`
        : `Subscription cancelled on ${timestamp}. Plan: ${metadata?.planName}. Follow up to understand reason and potential retention.`;

      await db.insert(crmNotes).values({
        entityType: 'owner',
        entityId: userId,
        noteType: 'reminder',
        title: noteTitle,
        content: noteContent,
        priority: eventType === 'payment_failure' ? 'high' : 'normal',
        dueDate: timestamp,
        isCompleted: false,
        createdBy: 'system',
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      logCRMSync('Created CRM note', { userId, eventType, priority: eventType === 'payment_failure' ? 'high' : 'normal' });
    }

    return {
      success: true,
      syncedData: {
        userId,
        eventType,
        membershipStatus: membership.status,
        crmStatus: profileStatus,
        timestamp,
      },
    };

  } catch (error) {
    logCRMSync('Failed to sync to CRM', {
      userId,
      eventType,
      error: (error as Error).message,
    });
    
    return {
      success: false,
      syncedData: {
        userId,
        eventType,
        error: (error as Error).message,
        timestamp,
      },
    };
  }
}

/**
 * Sync multiple properties to CRM
 * Triggered when subscription status changes or properties are updated
 */
export async function syncPropertiesToCRM(
  ownerId: string
): Promise<{ success: boolean; propertySyncCount: number }> {
  const timestamp = nowUKFormatted();
  
  try {
    logCRMSync('Syncing properties to CRM', { ownerId });

    // Get all properties owned by this user
    const { properties, crmPropertyLinks } = await import('@/db/schema');
    
    const ownerProperties = await db
      .select()
      .from(properties)
      .where(eq(properties.ownerId, ownerId));

    if (ownerProperties.length === 0) {
      logCRMSync('No properties to sync', { ownerId });
      return { success: true, propertySyncCount: 0 };
    }

    let syncedCount = 0;

    // Sync each property
    for (const property of ownerProperties) {
      try {
        // Check if property link exists
        const existingLink = await db
          .select()
          .from(crmPropertyLinks)
          .where(
            and(
              eq(crmPropertyLinks.ownerId, ownerId),
              eq(crmPropertyLinks.propertyId, property.id)
            )
          )
          .limit(1);

        const linkStatus = property.status === 'approved' ? 'active' : 'pending';

        if (existingLink && existingLink.length > 0) {
          // Update existing link
          await db
            .update(crmPropertyLinks)
            .set({
              linkStatus,
              updatedAt: timestamp,
            })
            .where(
              and(
                eq(crmPropertyLinks.ownerId, ownerId),
                eq(crmPropertyLinks.propertyId, property.id)
              )
            );
        } else {
          // Create new link
          await db.insert(crmPropertyLinks).values({
            ownerId,
            propertyId: property.id,
            linkStatus,
            ownershipType: 'full',
            commissionRate: null,
            contractStartDate: timestamp,
            contractEndDate: null,
            notes: `Property: ${property.title}. Status: ${property.status}`,
            createdAt: timestamp,
            updatedAt: timestamp,
          });
        }

        syncedCount++;
      } catch (propError) {
        logCRMSync('Error syncing property', {
          propertyId: property.id,
          error: (propError as Error).message,
        });
      }
    }

    logCRMSync('Properties synced to CRM', { ownerId, syncedCount });

    return {
      success: true,
      propertySyncCount: syncedCount,
    };

  } catch (error) {
    logCRMSync('Failed to sync properties to CRM', {
      ownerId,
      error: (error as Error).message,
    });
    
    return {
      success: false,
      propertySyncCount: 0,
    };
  }
}

/**
 * Full owner sync to CRM
 * Syncs subscription status, membership state, and all properties
 */
export async function fullOwnerSyncToCRM(
  userId: string,
  eventType: 'payment_success' | 'payment_failure' | 'subscription_cancelled' | 'subscription_renewed' = 'subscription_renewed',
  metadata?: any
): Promise<{ success: boolean; syncDetails: any }> {
  const timestamp = nowUKFormatted();
  
  try {
    logCRMSync('Starting full owner sync to CRM', { userId });

    // 1. Sync subscription status
    const subscriptionSync = await syncSubscriptionStatusToCRM(userId, eventType, metadata);

    // 2. Sync all properties
    const propertySync = await syncPropertiesToCRM(userId);

    // 3. Log full sync activity
    const { crmActivityLog } = await import('@/db/schema');
    await db.insert(crmActivityLog).values({
      entityType: 'owner',
      entityId: userId,
      activityType: 'note',
      title: 'Full CRM sync completed',
      description: `Complete owner data synced to CRM. Event: ${eventType}. Properties synced: ${propertySync.propertySyncCount}`,
      outcome: subscriptionSync.success && propertySync.success ? 'success' : 'partial',
      performedBy: 'system',
      metadata: JSON.stringify({
        subscriptionSync: subscriptionSync.syncedData,
        propertySyncCount: propertySync.propertySyncCount,
      }),
      createdAt: timestamp,
    });

    logCRMSync('Full owner sync completed', {
      userId,
      subscriptionSyncSuccess: subscriptionSync.success,
      propertySyncCount: propertySync.propertySyncCount,
    });

    return {
      success: subscriptionSync.success && propertySync.success,
      syncDetails: {
        subscriptionSync: subscriptionSync.syncedData,
        propertySync: {
          success: propertySync.success,
          propertySyncCount: propertySync.propertySyncCount,
        },
        timestamp,
      },
    };

  } catch (error) {
    logCRMSync('Failed full owner sync', {
      userId,
      error: (error as Error).message,
    });
    
    return {
      success: false,
      syncDetails: {
        error: (error as Error).message,
        timestamp,
      },
    };
  }
}
