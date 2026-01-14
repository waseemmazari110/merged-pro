/**
 * Media Presigned URL System
 * 
 * Generates secure presigned URLs for direct S3/cloud uploads.
 * Supports images, videos, and documents with validation.
 * All operations logged with UK timestamps.
 */

import crypto from 'crypto';
import { nowUKFormatted } from './date-utils';
import { logMediaAction } from './audit-logger';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface PresignedUploadRequest {
  userId: string;
  propertyId: string;
  filename: string;
  fileType: string;
  fileSize: number;
  mediaType: 'image' | 'video' | 'document';
}

export interface PresignedUploadResponse {
  uploadUrl: string;
  fileKey: string;
  publicUrl: string;
  expiresAt: string; // UK timestamp
  maxFileSize: number;
  allowedTypes: string[];
}

export interface MediaValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

// ============================================
// CONFIGURATION
// ============================================

const MEDIA_CONFIG = {
  image: {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp', '.avif'],
  },
  video: {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: ['video/mp4', 'video/webm', 'video/quicktime'],
    allowedExtensions: ['.mp4', '.webm', '.mov'],
  },
  document: {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    allowedExtensions: ['.pdf', '.doc', '.docx'],
  },
};

const PRESIGNED_URL_EXPIRY = 3600; // 1 hour in seconds

// ============================================
// VALIDATION FUNCTIONS
// ============================================

/**
 * Validate media upload request
 */
export function validateMediaUpload(request: PresignedUploadRequest): MediaValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  const config = MEDIA_CONFIG[request.mediaType];
  if (!config) {
    errors.push(`Invalid media type: ${request.mediaType}`);
    return { isValid: false, errors, warnings };
  }

  // Validate file size
  if (request.fileSize > config.maxSize) {
    errors.push(
      `File size ${formatBytes(request.fileSize)} exceeds maximum allowed size of ${formatBytes(config.maxSize)}`
    );
  }

  // Validate file type
  if (!config.allowedTypes.includes(request.fileType)) {
    errors.push(
      `File type ${request.fileType} is not allowed. Allowed types: ${config.allowedTypes.join(', ')}`
    );
  }

  // Validate file extension
  const extension = request.filename.toLowerCase().slice(request.filename.lastIndexOf('.'));
  if (!config.allowedExtensions.includes(extension)) {
    errors.push(
      `File extension ${extension} is not allowed. Allowed extensions: ${config.allowedExtensions.join(', ')}`
    );
  }

  // Validate filename
  if (request.filename.length > 255) {
    errors.push('Filename is too long (max 255 characters)');
  }

  // Check for suspicious characters
  if (/[<>:"|?*]/.test(request.filename)) {
    errors.push('Filename contains invalid characters');
  }

  // Warnings
  if (request.fileSize > config.maxSize * 0.8) {
    warnings.push('File size is close to the maximum limit');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Sanitize filename
 */
export function sanitizeFilename(filename: string): string {
  // Remove path components
  const basename = filename.split(/[/\\]/).pop() || filename;
  
  // Remove invalid characters
  let sanitized = basename.replace(/[^a-zA-Z0-9._-]/g, '_');
  
  // Ensure it doesn't start with a dot
  if (sanitized.startsWith('.')) {
    sanitized = '_' + sanitized;
  }
  
  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.slice(sanitized.lastIndexOf('.'));
    sanitized = sanitized.slice(0, 255 - ext.length) + ext;
  }
  
  return sanitized;
}

// ============================================
// PRESIGNED URL GENERATION
// ============================================

/**
 * Generate presigned upload URL
 */
export async function generatePresignedUpload(
  request: PresignedUploadRequest
): Promise<PresignedUploadResponse> {
  // Validate request
  const validation = validateMediaUpload(request);
  if (!validation.isValid) {
    throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
  }

  // Generate unique file key
  const timestamp = Date.now();
  const randomId = crypto.randomBytes(8).toString('hex');
  const sanitized = sanitizeFilename(request.filename);
  const fileKey = `properties/${request.propertyId}/${request.mediaType}/${timestamp}-${randomId}-${sanitized}`;

  // Calculate expiry
  const expiresAt = new Date(Date.now() + PRESIGNED_URL_EXPIRY * 1000);
  const expiresAtUK = formatDateTimeUK(expiresAt);

  // In production, generate real S3 presigned URL
  // For now, return mock URL
  const uploadUrl = `https://s3.eu-west-2.amazonaws.com/escape-houses-media/${fileKey}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=${PRESIGNED_URL_EXPIRY}`;
  const publicUrl = `https://cdn.escape-houses.com/${fileKey}`;

  const config = MEDIA_CONFIG[request.mediaType];

  return {
    uploadUrl,
    fileKey,
    publicUrl,
    expiresAt: expiresAtUK,
    maxFileSize: config.maxSize,
    allowedTypes: config.allowedTypes,
  };
}

/**
 * Generate presigned download URL
 */
export async function generatePresignedDownload(
  fileKey: string,
  expirySeconds: number = 3600
): Promise<{ downloadUrl: string; expiresAt: string }> {
  const expiresAt = new Date(Date.now() + expirySeconds * 1000);
  const expiresAtUK = formatDateTimeUK(expiresAt);

  // In production, generate real S3 presigned URL
  const downloadUrl = `https://s3.eu-west-2.amazonaws.com/escape-houses-media/${fileKey}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=${expirySeconds}`;

  return {
    downloadUrl,
    expiresAt: expiresAtUK,
  };
}

/**
 * Verify file upload completion
 */
export async function verifyUploadCompletion(fileKey: string): Promise<{
  exists: boolean;
  size?: number;
  contentType?: string;
  uploadedAt?: string;
}> {
  // In production, check S3 for file existence
  // For now, return mock response
  return {
    exists: true,
    size: 1024000,
    contentType: 'image/jpeg',
    uploadedAt: nowUKFormatted(),
  };
}

/**
 * Delete media file
 */
export async function deleteMediaFile(fileKey: string, userId: string): Promise<void> {
  // In production, delete from S3
  console.log(`[${nowUKFormatted()}] Deleting file: ${fileKey}`);

  // Log audit event
  await logMediaAction(
    userId,
    'media.delete',
    fileKey,
    fileKey.split('/').pop() || fileKey,
    { fileKey }
  );
}

// ============================================
// BULK OPERATIONS
// ============================================

/**
 * Generate multiple presigned URLs at once
 */
export async function generateBulkPresignedUploads(
  requests: PresignedUploadRequest[]
): Promise<{
  successful: PresignedUploadResponse[];
  failed: { request: PresignedUploadRequest; error: string }[];
}> {
  const successful: PresignedUploadResponse[] = [];
  const failed: { request: PresignedUploadRequest; error: string }[] = [];

  for (const request of requests) {
    try {
      const result = await generatePresignedUpload(request);
      successful.push(result);
    } catch (error) {
      failed.push({
        request,
        error: (error as Error).message,
      });
    }
  }

  return { successful, failed };
}

/**
 * Reorder media files
 */
export async function reorderMedia(
  propertyId: string,
  userId: string,
  mediaIds: string[]
): Promise<void> {
  const timestamp = nowUKFormatted();
  
  // In production, update media order in database
  console.log(`[${timestamp}] Reordering media for property ${propertyId}`, mediaIds);

  // Log audit event
  await logMediaAction(
    userId,
    'media.reorder',
    propertyId,
    `Property ${propertyId} media`,
    { mediaIds, newOrder: mediaIds.length }
  );
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function formatDateTimeUK(date: Date): string {
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
 * Get media usage statistics
 */
export async function getMediaUsageStats(userId: string): Promise<{
  totalFiles: number;
  totalSize: number;
  byType: Record<string, { count: number; size: number }>;
  lastUploadedAt: string;
}> {
  // In production, query database for actual stats
  return {
    totalFiles: 0,
    totalSize: 0,
    byType: {
      image: { count: 0, size: 0 },
      video: { count: 0, size: 0 },
      document: { count: 0, size: 0 },
    },
    lastUploadedAt: nowUKFormatted(),
  };
}
