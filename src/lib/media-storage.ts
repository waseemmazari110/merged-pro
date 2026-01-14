/**
 * Media Storage System
 * Handles database operations for media records
 * Milestone 7: Photo/Media Upload System
 */

import { db } from '@/db';
import { media } from '@/db/schema';
import { eq, and, desc, asc, sql, or, inArray } from 'drizzle-orm';
import { nowUKFormatted } from '@/lib/date-utils';
import { logAuditEvent } from '@/lib/audit-logger';
import type { MediaType } from './media-upload-handler';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface MediaRecord {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: MediaType;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  duration?: number;
  altText?: string;
  caption?: string;
  description?: string;
  title?: string;
  entityType?: string;
  entityId?: string;
  uploadedBy?: string;
  folder: string;
  tags?: string[];
  isPublic: boolean;
  thumbnailUrl?: string;
  metadata?: Record<string, any>;
  storageProvider: string;
  storageKey: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMediaInput {
  fileName: string;
  fileUrl: string;
  fileType: MediaType;
  mimeType: string;
  fileSize: number;
  width?: number;
  height?: number;
  duration?: number;
  altText?: string;
  caption?: string;
  description?: string;
  title?: string;
  entityType?: 'property' | 'experience' | 'destination' | 'blog' | 'user' | 'general';
  entityId?: string | number;
  uploadedBy: string;
  folder?: string;
  tags?: string[];
  isPublic?: boolean;
  thumbnailUrl?: string;
  metadata?: Record<string, any>;
  storageProvider?: string;
  storageKey: string;
}

export interface UpdateMediaInput {
  altText?: string;
  caption?: string;
  description?: string;
  title?: string;
  tags?: string[];
  isPublic?: boolean;
  entityType?: string;
  entityId?: string | number;
  folder?: string;
}

export interface MediaFilters {
  fileType?: MediaType | MediaType[];
  entityType?: string;
  entityId?: string | number;
  uploadedBy?: string;
  folder?: string;
  tags?: string[];
  isPublic?: boolean;
  searchTerm?: string;
}

export interface MediaListOptions {
  filters?: MediaFilters;
  sortBy?: 'createdAt' | 'fileSize' | 'fileName';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface MediaStats {
  totalFiles: number;
  totalSize: number;
  byType: Record<MediaType, { count: number; size: number }>;
  byFolder: Record<string, { count: number; size: number }>;
  recentUploads: number; // Last 24 hours
}

// ============================================
// CREATE OPERATIONS
// ============================================

/**
 * Create media record in database
 */
export async function createMediaRecord(
  input: CreateMediaInput,
  userId: string,
  ipAddress?: string
): Promise<MediaRecord> {
  const now = nowUKFormatted();

  // Insert media record
  const [record] = await db.insert(media).values({
    fileName: input.fileName,
    fileUrl: input.fileUrl,
    fileType: input.fileType,
    mimeType: input.mimeType,
    fileSize: input.fileSize,
    width: input.width,
    height: input.height,
    duration: input.duration,
    altText: input.altText,
    caption: input.caption,
    description: input.description,
    title: input.title,
    entityType: input.entityType || 'general',
    entityId: input.entityId ? String(input.entityId) : null,
    uploadedBy: input.uploadedBy,
    folder: input.folder || 'general',
    tags: input.tags ? JSON.stringify(input.tags) : null,
    isPublic: input.isPublic !== undefined ? input.isPublic : true,
    thumbnailUrl: input.thumbnailUrl,
    metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    storageProvider: input.storageProvider || 's3',
    storageKey: input.storageKey,
    createdAt: now,
    updatedAt: now,
  }).returning();

  // Log audit event
  await logAuditEvent({
    userId,
    action: 'media.upload',
    resourceType: 'media',
    resourceId: record.id.toString(),
    details: {
      fileName: input.fileName,
      fileType: input.fileType,
      fileSize: input.fileSize,
      entityType: input.entityType,
      entityId: input.entityId,
    },
    ipAddress,
  });

  return formatMediaRecord(record);
}

/**
 * Create multiple media records (bulk upload)
 */
export async function createMediaRecords(
  inputs: CreateMediaInput[],
  userId: string,
  ipAddress?: string
): Promise<MediaRecord[]> {
  const now = nowUKFormatted();

  // Insert all records
  const records = await db.insert(media).values(
    inputs.map(input => ({
      fileName: input.fileName,
      fileUrl: input.fileUrl,
      fileType: input.fileType,
      mimeType: input.mimeType,
      fileSize: input.fileSize,
      width: input.width,
      height: input.height,
      duration: input.duration,
      altText: input.altText,
      caption: input.caption,
      description: input.description,
      title: input.title,
      entityType: input.entityType || 'general',
      entityId: input.entityId ? String(input.entityId) : null,
      uploadedBy: input.uploadedBy,
      folder: input.folder || 'general',
      tags: input.tags ? JSON.stringify(input.tags) : null,
      isPublic: input.isPublic !== undefined ? input.isPublic : true,
      thumbnailUrl: input.thumbnailUrl,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      storageProvider: input.storageProvider || 's3',
      storageKey: input.storageKey,
      createdAt: now,
      updatedAt: now,
    }))
  ).returning();

  // Log audit event
  await logAuditEvent({
    userId,
    action: 'media.upload',
    resourceType: 'media',
    resourceId: 'bulk',
    details: {
      totalFiles: records.length,
      fileTypes: inputs.map(i => i.fileType),
      totalSize: inputs.reduce((sum, i) => sum + i.fileSize, 0),
    },
    ipAddress,
  });

  return records.map(formatMediaRecord);
}

// ============================================
// READ OPERATIONS
// ============================================

/**
 * Get media record by ID
 */
export async function getMediaById(id: number): Promise<MediaRecord | null> {
  const [record] = await db.select().from(media).where(eq(media.id, id));
  return record ? formatMediaRecord(record) : null;
}

/**
 * Get media record by storage key
 */
export async function getMediaByStorageKey(storageKey: string): Promise<MediaRecord | null> {
  const [record] = await db.select().from(media).where(eq(media.storageKey, storageKey));
  return record ? formatMediaRecord(record) : null;
}

/**
 * Get media record by file URL
 */
export async function getMediaByUrl(fileUrl: string): Promise<MediaRecord | null> {
  const [record] = await db.select().from(media).where(eq(media.fileUrl, fileUrl));
  return record ? formatMediaRecord(record) : null;
}

/**
 * List media with filters and pagination
 */
export async function listMedia(options: MediaListOptions = {}): Promise<{
  media: MediaRecord[];
  total: number;
}> {
  const {
    filters = {},
    sortBy = 'createdAt',
    sortOrder = 'desc',
    limit = 50,
    offset = 0,
  } = options;

  // Build where conditions
  const conditions = [];

  if (filters.fileType) {
    if (Array.isArray(filters.fileType)) {
      conditions.push(inArray(media.fileType, filters.fileType));
    } else {
      conditions.push(eq(media.fileType, filters.fileType));
    }
  }

  if (filters.entityType) {
    conditions.push(eq(media.entityType, filters.entityType));
  }

  if (filters.entityId) {
    conditions.push(eq(media.entityId, String(filters.entityId)));
  }

  if (filters.uploadedBy) {
    conditions.push(eq(media.uploadedBy, filters.uploadedBy));
  }

  if (filters.folder) {
    conditions.push(eq(media.folder, filters.folder));
  }

  if (filters.isPublic !== undefined) {
    conditions.push(eq(media.isPublic, filters.isPublic));
  }

  if (filters.searchTerm) {
    conditions.push(
      or(
        sql`${media.fileName} LIKE ${`%${filters.searchTerm}%`}`,
        sql`${media.altText} LIKE ${`%${filters.searchTerm}%`}`,
        sql`${media.caption} LIKE ${`%${filters.searchTerm}%`}`,
        sql`${media.description} LIKE ${`%${filters.searchTerm}%`}`
      )!
    );
  }

  // Query with filters
  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // Get total count
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(media)
    .where(whereClause);

  // Get records with sorting and pagination
  const orderByColumn = sortBy === 'createdAt' ? media.createdAt :
                        sortBy === 'fileSize' ? media.fileSize :
                        media.fileName;
  
  const orderBy = sortOrder === 'desc' ? desc(orderByColumn) : asc(orderByColumn);

  const records = await db
    .select()
    .from(media)
    .where(whereClause)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  return {
    media: records.map(formatMediaRecord),
    total: count,
  };
}

/**
 * Get media for specific entity
 */
export async function getEntityMedia(
  entityType: string,
  entityId: string | number
): Promise<MediaRecord[]> {
  const records = await db
    .select()
    .from(media)
    .where(
      and(
        eq(media.entityType, entityType),
        eq(media.entityId, String(entityId))
      )
    )
    .orderBy(desc(media.createdAt));

  return records.map(formatMediaRecord);
}

/**
 * Get user's uploaded media
 */
export async function getUserMedia(
  userId: string,
  options: { limit?: number; offset?: number } = {}
): Promise<{ media: MediaRecord[]; total: number }> {
  const { limit = 50, offset = 0 } = options;

  // Get total count
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(media)
    .where(eq(media.uploadedBy, userId));

  // Get records
  const records = await db
    .select()
    .from(media)
    .where(eq(media.uploadedBy, userId))
    .orderBy(desc(media.createdAt))
    .limit(limit)
    .offset(offset);

  return {
    media: records.map(formatMediaRecord),
    total: count,
  };
}

// ============================================
// UPDATE OPERATIONS
// ============================================

/**
 * Update media record
 */
export async function updateMediaRecord(
  id: number,
  updates: UpdateMediaInput,
  userId: string,
  ipAddress?: string
): Promise<MediaRecord> {
  const now = nowUKFormatted();

  // Get existing record
  const existing = await getMediaById(id);
  if (!existing) {
    throw new Error('Media not found');
  }

  // Build update object
  const updateData: any = {
    updatedAt: now,
  };

  if (updates.altText !== undefined) updateData.altText = updates.altText;
  if (updates.caption !== undefined) updateData.caption = updates.caption;
  if (updates.description !== undefined) updateData.description = updates.description;
  if (updates.title !== undefined) updateData.title = updates.title;
  if (updates.folder !== undefined) updateData.folder = updates.folder;
  if (updates.entityType !== undefined) updateData.entityType = updates.entityType;
  if (updates.entityId !== undefined) updateData.entityId = String(updates.entityId);
  if (updates.isPublic !== undefined) updateData.isPublic = updates.isPublic ? 1 : 0;
  if (updates.tags !== undefined) updateData.tags = JSON.stringify(updates.tags);

  // Update record
  const [updated] = await db
    .update(media)
    .set(updateData)
    .where(eq(media.id, id))
    .returning();

  // Log audit event
  await logAuditEvent({
    userId,
    action: 'settings.update',
    resourceType: 'media',
    resourceId: id.toString(),
    details: {
      fileName: existing.fileName,
      updates,
    },
    ipAddress,
  });

  return formatMediaRecord(updated);
}

/**
 * Update thumbnail URL
 */
export async function updateThumbnailUrl(
  id: number,
  thumbnailUrl: string
): Promise<void> {
  await db
    .update(media)
    .set({
      thumbnailUrl,
      updatedAt: nowUKFormatted(),
    })
    .where(eq(media.id, id));
}

/**
 * Update media dimensions
 */
export async function updateMediaDimensions(
  id: number,
  width: number,
  height: number,
  duration?: number
): Promise<void> {
  const updateData: any = {
    width,
    height,
    updatedAt: nowUKFormatted(),
  };

  if (duration !== undefined) {
    updateData.duration = duration;
  }

  await db
    .update(media)
    .set(updateData)
    .where(eq(media.id, id));
}

// ============================================
// DELETE OPERATIONS
// ============================================

/**
 * Delete media record
 */
export async function deleteMediaRecord(
  id: number,
  userId: string,
  ipAddress?: string
): Promise<void> {
  // Get existing record
  const existing = await getMediaById(id);
  if (!existing) {
    throw new Error('Media not found');
  }

  // Delete record
  await db.delete(media).where(eq(media.id, id));

  // Log audit event
  await logAuditEvent({
    userId,
    action: 'media.delete',
    resourceType: 'media',
    resourceId: id.toString(),
    details: {
      fileName: existing.fileName,
      fileUrl: existing.fileUrl,
      storageKey: existing.storageKey,
    },
    ipAddress,
  });
}

/**
 * Delete multiple media records
 */
export async function deleteMediaRecords(
  ids: number[],
  userId: string,
  ipAddress?: string
): Promise<void> {
  // Get existing records
  const existing = await db
    .select()
    .from(media)
    .where(inArray(media.id, ids));

  // Delete records
  await db.delete(media).where(inArray(media.id, ids));

  // Log audit event
  await logAuditEvent({
    userId,
    action: 'media.delete',
    resourceType: 'media',
    resourceId: 'bulk',
    details: {
      totalDeleted: existing.length,
      fileNames: existing.map(r => r.fileName),
    },
    ipAddress,
  });
}

// ============================================
// STATISTICS
// ============================================

/**
 * Get media statistics
 */
export async function getMediaStats(userId?: string): Promise<MediaStats> {
  const whereClause = userId ? eq(media.uploadedBy, userId) : undefined;

  // Get all records for stats
  const records = await db
    .select({
      fileType: media.fileType,
      fileSize: media.fileSize,
      folder: media.folder,
      createdAt: media.createdAt,
    })
    .from(media)
    .where(whereClause);

  // Calculate stats
  const stats: MediaStats = {
    totalFiles: records.length,
    totalSize: records.reduce((sum, r) => sum + r.fileSize, 0),
    byType: {
      image: { count: 0, size: 0 },
      video: { count: 0, size: 0 },
      document: { count: 0, size: 0 },
      audio: { count: 0, size: 0 },
    },
    byFolder: {},
    recentUploads: 0,
  };

  // Calculate by type and folder
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  for (const record of records) {
    // By type
    if (stats.byType[record.fileType as MediaType]) {
      stats.byType[record.fileType as MediaType].count++;
      stats.byType[record.fileType as MediaType].size += record.fileSize;
    }

    // By folder
    const folder = record.folder || 'general';
    if (!stats.byFolder[folder]) {
      stats.byFolder[folder] = { count: 0, size: 0 };
    }
    stats.byFolder[folder].count++;
    stats.byFolder[folder].size += record.fileSize;

    // Recent uploads (last 24 hours)
    const createdDate = parseUKDate(record.createdAt);
    if (createdDate >= oneDayAgo) {
      stats.recentUploads++;
    }
  }

  return stats;
}

// ============================================
// UTILITIES
// ============================================

/**
 * Format media record from database
 */
function formatMediaRecord(record: any): MediaRecord {
  return {
    id: record.id,
    fileName: record.fileName,
    fileUrl: record.fileUrl,
    fileType: record.fileType as MediaType,
    mimeType: record.mimeType,
    fileSize: record.fileSize,
    width: record.width,
    height: record.height,
    duration: record.duration,
    altText: record.altText,
    caption: record.caption,
    description: record.description,
    title: record.title,
    entityType: record.entityType,
    entityId: record.entityId,
    uploadedBy: record.uploadedBy,
    folder: record.folder,
    tags: Array.isArray(record.tags) ? record.tags : (record.tags ? [] : []),
    isPublic: record.isPublic === 1,
    thumbnailUrl: record.thumbnailUrl,
    metadata: typeof record.metadata === 'object' ? record.metadata : null,
    storageProvider: record.storageProvider,
    storageKey: record.storageKey,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

/**
 * Parse UK date format to Date object
 */
function parseUKDate(dateStr: string): Date {
  // Format: DD/MM/YYYY HH:mm:ss
  const [datePart, timePart] = dateStr.split(' ');
  const [day, month, year] = datePart.split('/').map(Number);
  const [hours, minutes, seconds] = timePart.split(':').map(Number);
  
  return new Date(year, month - 1, day, hours, minutes, seconds);
}

/**
 * Check if user owns media
 */
export async function userOwnsMedia(mediaId: number, userId: string): Promise<boolean> {
  const record = await getMediaById(mediaId);
  return record?.uploadedBy === userId;
}

/**
 * Search media by tags
 */
export async function searchMediaByTags(tags: string[]): Promise<MediaRecord[]> {
  // SQLite doesn't have native JSON array search, so we use LIKE
  const records = await db.select().from(media);
  
  return records
    .filter(record => {
      if (!record.tags) return false;
      const recordTags = Array.isArray(record.tags) ? record.tags : [];
      return tags.some(tag => recordTags.includes(tag));
    })
    .map(formatMediaRecord);
}
