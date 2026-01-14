/**
 * Audit Logging System
 * 
 * Tracks all owner actions with UK timestamps for compliance and security.
 * All timestamps are in DD/MM/YYYY HH:mm:ss format (Europe/London).
 */

import { db } from '@/db';
import { eq, and, desc, sql } from 'drizzle-orm';
import { nowUKFormatted } from './date-utils';

// ============================================
// TYPES & INTERFACES
// ============================================

export type AuditActionType = 
  | 'property.create'
  | 'property.update'
  | 'property.delete'
  | 'property.publish'
  | 'property.unpublish'
  | 'media.upload'
  | 'media.delete'
  | 'media.reorder'
  | 'enquiry.view'
  | 'enquiry.respond'
  | 'subscription.create'
  | 'subscription.cancel'
  | 'subscription.upgrade'
  | 'subscription.downgrade'
  | 'settings.update'
  | 'profile.update'
  | 'user.delete'
  | 'user.update'
  | 'user.create';

export interface AuditLogEntry {
  id: string;
  userId: string;
  userEmail?: string;
  userName?: string;
  action: AuditActionType;
  resourceType: string;
  resourceId?: string;
  resourceName?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string; // UK format: DD/MM/YYYY HH:mm:ss
  status: 'success' | 'failure';
  errorMessage?: string;
}

export interface AuditLogFilter {
  userId?: string;
  action?: AuditActionType;
  resourceType?: string;
  resourceId?: string;
  startDate?: string; // DD/MM/YYYY
  endDate?: string; // DD/MM/YYYY
  status?: 'success' | 'failure';
  limit?: number;
  offset?: number;
}

export interface AuditLogSummary {
  totalActions: number;
  successfulActions: number;
  failedActions: number;
  actionsByType: Record<AuditActionType, number>;
  recentActions: AuditLogEntry[];
  periodStart: string;
  periodEnd: string;
}

// ============================================
// AUDIT LOGGING FUNCTIONS
// ============================================

/**
 * Log an audit event
 */
export async function logAuditEvent(data: {
  userId: string;
  action: AuditActionType;
  resourceType: string;
  resourceId?: string;
  resourceName?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status?: 'success' | 'failure';
  errorMessage?: string;
}): Promise<AuditLogEntry> {
  const timestamp = nowUKFormatted();
  const id = `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const logEntry: AuditLogEntry = {
    id,
    userId: data.userId,
    action: data.action,
    resourceType: data.resourceType,
    resourceId: data.resourceId,
    resourceName: data.resourceName,
    details: data.details,
    ipAddress: data.ipAddress,
    userAgent: data.userAgent,
    timestamp,
    status: data.status || 'success',
    errorMessage: data.errorMessage,
  };

  // In production, this would insert into audit_logs table
  // For now, we'll log to console and return the entry
  console.log(`[AUDIT LOG] ${timestamp} - ${data.action}`, logEntry);

  return logEntry;
}

/**
 * Log successful property action
 */
export async function logPropertyAction(
  userId: string,
  action: Extract<AuditActionType, 'property.create' | 'property.update' | 'property.delete' | 'property.publish' | 'property.unpublish'>,
  propertyId: string,
  propertyName: string,
  changes?: Record<string, any>
): Promise<AuditLogEntry> {
  return logAuditEvent({
    userId,
    action,
    resourceType: 'property',
    resourceId: propertyId,
    resourceName: propertyName,
    details: { changes },
    status: 'success',
  });
}

/**
 * Log media action
 */
export async function logMediaAction(
  userId: string,
  action: Extract<AuditActionType, 'media.upload' | 'media.delete' | 'media.reorder'>,
  mediaId: string,
  mediaName: string,
  details?: Record<string, any>
): Promise<AuditLogEntry> {
  return logAuditEvent({
    userId,
    action,
    resourceType: 'media',
    resourceId: mediaId,
    resourceName: mediaName,
    details,
    status: 'success',
  });
}

/**
 * Log enquiry action
 */
export async function logEnquiryAction(
  userId: string,
  action: Extract<AuditActionType, 'enquiry.view' | 'enquiry.respond'>,
  enquiryId: string,
  details?: Record<string, any>
): Promise<AuditLogEntry> {
  return logAuditEvent({
    userId,
    action,
    resourceType: 'enquiry',
    resourceId: enquiryId,
    details,
    status: 'success',
  });
}

/**
 * Log subscription action
 */
export async function logSubscriptionAction(
  userId: string,
  action: Extract<AuditActionType, 'subscription.create' | 'subscription.cancel' | 'subscription.upgrade' | 'subscription.downgrade'>,
  subscriptionId: string,
  details?: Record<string, any>
): Promise<AuditLogEntry> {
  return logAuditEvent({
    userId,
    action,
    resourceType: 'subscription',
    resourceId: subscriptionId,
    details,
    status: 'success',
  });
}

/**
 * Get audit logs with filters
 */
export async function getAuditLogs(filter: AuditLogFilter): Promise<{
  logs: AuditLogEntry[];
  total: number;
  hasMore: boolean;
}> {
  // In production, this would query audit_logs table
  // For now, return mock data
  const mockLogs: AuditLogEntry[] = [];
  
  return {
    logs: mockLogs,
    total: 0,
    hasMore: false,
  };
}

/**
 * Get audit log summary for a user
 */
export async function getAuditLogSummary(
  userId: string,
  periodDays: number = 30
): Promise<AuditLogSummary> {
  const now = new Date();
  const periodStart = new Date(now.getTime() - periodDays * 24 * 60 * 60 * 1000);
  
  // In production, this would query audit_logs table
  const summary: AuditLogSummary = {
    totalActions: 0,
    successfulActions: 0,
    failedActions: 0,
    actionsByType: {} as Record<AuditActionType, number>,
    recentActions: [],
    periodStart: formatDateUK(periodStart),
    periodEnd: nowUKFormatted(),
  };

  return summary;
}

/**
 * Get recent activity for dashboard
 */
export async function getRecentActivity(
  userId: string,
  limit: number = 10
): Promise<AuditLogEntry[]> {
  // In production, this would query audit_logs table
  return [];
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatDateUK(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/London',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date).replace(', ', ' ');
}

/**
 * Export audit logs to CSV
 */
export function exportAuditLogsToCSV(logs: AuditLogEntry[]): string {
  const headers = [
    'Timestamp',
    'User ID',
    'Action',
    'Resource Type',
    'Resource ID',
    'Resource Name',
    'Status',
    'Error Message',
  ];

  const rows = logs.map(log => [
    log.timestamp,
    log.userId,
    log.action,
    log.resourceType,
    log.resourceId || '',
    log.resourceName || '',
    log.status,
    log.errorMessage || '',
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n');

  return csvContent;
}

/**
 * Middleware to capture request details for audit logging
 */
export function captureRequestDetails(request: Request): {
  ipAddress?: string;
  userAgent?: string;
} {
  return {
    ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
    userAgent: request.headers.get('user-agent') || undefined,
  };
}
