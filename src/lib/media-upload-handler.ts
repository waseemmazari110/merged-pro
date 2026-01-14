/**
 * Media Upload Handler
 * Handles presigned URL generation, validation, and upload orchestration
 * Milestone 7: Photo/Media Upload System
 */

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { nanoid } from 'nanoid';

// ============================================
// TYPES & INTERFACES
// ============================================

export type MediaType = 'image' | 'video' | 'document' | 'audio';
export type ImageFormat = 'jpeg' | 'png' | 'webp' | 'avif' | 'gif';
export type VideoFormat = 'mp4' | 'webm' | 'mov' | 'avi';
export type DocumentFormat = 'pdf' | 'doc' | 'docx' | 'xls' | 'xlsx';
export type AudioFormat = 'mp3' | 'wav' | 'ogg' | 'm4a';

export interface UploadConfig {
  maxFileSize: number;
  allowedMimeTypes: string[];
  generateThumbnail: boolean;
  optimizeImage?: boolean;
  watermark?: boolean;
}

export interface UploadRequest {
  fileName: string;
  fileType: string; // MIME type
  fileSize: number;
  mediaType: MediaType;
  entityType?: 'property' | 'experience' | 'destination' | 'blog' | 'user' | 'general';
  entityId?: string | number;
  folder?: string;
  isPublic?: boolean;
  altText?: string;
  caption?: string;
  tags?: string[];
}

export interface PresignedUpload {
  uploadId: string;
  uploadUrl: string;
  fileKey: string;
  fileName: string;
  expiresIn: number;
  headers: Record<string, string>;
  metadata: {
    mediaType: MediaType;
    mimeType: string;
    fileSize: number;
    entityType?: string;
    entityId?: string | number;
  };
}

export interface UploadValidationResult {
  valid: boolean;
  error?: string;
  sanitizedFileName?: string;
  detectedMimeType?: string;
}

export interface BulkUploadRequest {
  uploads: UploadRequest[];
  maxConcurrent?: number;
}

export interface BulkUploadResponse {
  uploadId: string;
  uploads: PresignedUpload[];
  totalFiles: number;
  expiresIn: number;
}

// ============================================
// CONFIGURATION
// ============================================

const UPLOAD_CONFIGS: Record<MediaType, UploadConfig> = {
  image: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/avif',
      'image/gif',
    ],
    generateThumbnail: true,
    optimizeImage: true,
  },
  video: {
    maxFileSize: 500 * 1024 * 1024, // 500MB
    allowedMimeTypes: [
      'video/mp4',
      'video/webm',
      'video/quicktime',
      'video/x-msvideo',
    ],
    generateThumbnail: true,
  },
  document: {
    maxFileSize: 20 * 1024 * 1024, // 20MB
    allowedMimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ],
    generateThumbnail: true,
  },
  audio: {
    maxFileSize: 50 * 1024 * 1024, // 50MB
    allowedMimeTypes: [
      'audio/mpeg',
      'audio/wav',
      'audio/ogg',
      'audio/mp4',
    ],
    generateThumbnail: false,
  },
};

const S3_CONFIG = {
  region: process.env.AWS_REGION || 'eu-west-2',
  bucket: process.env.AWS_S3_BUCKET || 'escape-houses-media',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.AWS_S3_ENDPOINT, // For custom S3-compatible services
};

const URL_EXPIRY_SECONDS = 3600; // 1 hour
const MAX_BULK_UPLOADS = 50;

// ============================================
// S3 CLIENT
// ============================================

let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (!s3Client) {
    if (!S3_CONFIG.accessKeyId || !S3_CONFIG.secretAccessKey) {
      throw new Error('AWS credentials not configured');
    }

    s3Client = new S3Client({
      region: S3_CONFIG.region,
      credentials: {
        accessKeyId: S3_CONFIG.accessKeyId,
        secretAccessKey: S3_CONFIG.secretAccessKey,
      },
      ...(S3_CONFIG.endpoint && { endpoint: S3_CONFIG.endpoint }),
    });
  }

  return s3Client;
}

// ============================================
// FILE VALIDATION
// ============================================

/**
 * Sanitize filename - remove dangerous characters
 */
export function sanitizeFileName(fileName: string): string {
  // Remove path traversal attempts
  let sanitized = fileName.replace(/\.\./g, '');
  
  // Remove or replace dangerous characters
  sanitized = sanitized
    .replace(/[<>:"|?*]/g, '') // Windows forbidden chars
    .replace(/\\/g, '_') // Backslashes
    .replace(/\//g, '_') // Forward slashes
    .replace(/\s+/g, '_') // Spaces to underscores
    .replace(/_{2,}/g, '_') // Multiple underscores to single
    .replace(/^_|_$/g, ''); // Leading/trailing underscores

  // Ensure filename isn't empty
  if (!sanitized || sanitized === '.') {
    sanitized = `file_${nanoid(8)}`;
  }

  // Ensure extension exists
  if (!sanitized.includes('.')) {
    sanitized = `${sanitized}.bin`;
  }

  return sanitized;
}

/**
 * Validate file extension matches MIME type
 */
function validateMimeType(fileName: string, mimeType: string): boolean {
  const ext = fileName.toLowerCase().split('.').pop() || '';
  
  const mimeExtMap: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/webp': ['webp'],
    'image/avif': ['avif'],
    'image/gif': ['gif'],
    'video/mp4': ['mp4'],
    'video/webm': ['webm'],
    'video/quicktime': ['mov'],
    'video/x-msvideo': ['avi'],
    'application/pdf': ['pdf'],
    'application/msword': ['doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['docx'],
    'application/vnd.ms-excel': ['xls'],
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['xlsx'],
    'audio/mpeg': ['mp3'],
    'audio/wav': ['wav'],
    'audio/ogg': ['ogg'],
    'audio/mp4': ['m4a'],
  };

  const allowedExts = mimeExtMap[mimeType] || [];
  return allowedExts.includes(ext);
}

/**
 * Validate upload request
 */
export function validateUpload(request: UploadRequest): UploadValidationResult {
  // Sanitize filename
  const sanitizedFileName = sanitizeFileName(request.fileName);

  // Get configuration for media type
  const config = UPLOAD_CONFIGS[request.mediaType];
  if (!config) {
    return {
      valid: false,
      error: `Invalid media type: ${request.mediaType}`,
    };
  }

  // Check file size
  if (request.fileSize > config.maxFileSize) {
    const maxSizeMB = (config.maxFileSize / (1024 * 1024)).toFixed(2);
    return {
      valid: false,
      error: `File size exceeds maximum allowed (${maxSizeMB}MB)`,
    };
  }

  if (request.fileSize <= 0) {
    return {
      valid: false,
      error: 'File size must be greater than 0',
    };
  }

  // Check MIME type
  if (!config.allowedMimeTypes.includes(request.fileType)) {
    return {
      valid: false,
      error: `File type ${request.fileType} not allowed for ${request.mediaType}`,
    };
  }

  // Validate extension matches MIME type
  if (!validateMimeType(sanitizedFileName, request.fileType)) {
    return {
      valid: false,
      error: 'File extension does not match MIME type',
    };
  }

  return {
    valid: true,
    sanitizedFileName,
    detectedMimeType: request.fileType,
  };
}

// ============================================
// PRESIGNED URL GENERATION
// ============================================

/**
 * Generate unique file key for S3
 */
function generateFileKey(
  fileName: string,
  mediaType: MediaType,
  folder?: string,
  entityType?: string,
  entityId?: string | number
): string {
  const timestamp = Date.now();
  const uniqueId = nanoid(12);
  const sanitized = sanitizeFileName(fileName);
  
  // Build path: folder/entityType/entityId/timestamp-uniqueId-filename
  const parts: string[] = [];
  
  if (folder) {
    parts.push(folder);
  } else {
    parts.push(mediaType + 's'); // images, videos, documents, audio
  }
  
  if (entityType) {
    parts.push(entityType);
    if (entityId) {
      parts.push(String(entityId));
    }
  }
  
  parts.push(`${timestamp}-${uniqueId}-${sanitized}`);
  
  return parts.join('/');
}

/**
 * Generate presigned upload URL
 */
export async function generatePresignedUpload(
  request: UploadRequest,
  userId: string
): Promise<PresignedUpload> {
  // Validate request
  const validation = validateUpload(request);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Generate unique file key
  const fileKey = generateFileKey(
    validation.sanitizedFileName!,
    request.mediaType,
    request.folder,
    request.entityType,
    request.entityId
  );

  // Get S3 client
  const s3 = getS3Client();

  // Create S3 PUT command
  const command = new PutObjectCommand({
    Bucket: S3_CONFIG.bucket,
    Key: fileKey,
    ContentType: request.fileType,
    ContentLength: request.fileSize,
    Metadata: {
      'original-filename': validation.sanitizedFileName!,
      'media-type': request.mediaType,
      'uploaded-by': userId,
      ...(request.entityType && { 'entity-type': request.entityType }),
      ...(request.entityId && { 'entity-id': String(request.entityId) }),
    },
  });

  // Generate presigned URL
  const uploadUrl = await getSignedUrl(s3, command, {
    expiresIn: URL_EXPIRY_SECONDS,
  });

  // Generate upload ID for tracking
  const uploadId = nanoid(16);

  return {
    uploadId,
    uploadUrl,
    fileKey,
    fileName: validation.sanitizedFileName!,
    expiresIn: URL_EXPIRY_SECONDS,
    headers: {
      'Content-Type': request.fileType,
      'Content-Length': String(request.fileSize),
    },
    metadata: {
      mediaType: request.mediaType,
      mimeType: request.fileType,
      fileSize: request.fileSize,
      entityType: request.entityType,
      entityId: request.entityId,
    },
  };
}

/**
 * Generate bulk presigned uploads
 */
export async function generateBulkPresignedUploads(
  request: BulkUploadRequest,
  userId: string
): Promise<BulkUploadResponse> {
  // Validate bulk request
  if (!request.uploads || request.uploads.length === 0) {
    throw new Error('No uploads provided');
  }

  if (request.uploads.length > MAX_BULK_UPLOADS) {
    throw new Error(`Maximum ${MAX_BULK_UPLOADS} files allowed per bulk upload`);
  }

  // Generate presigned URLs for all uploads
  const uploads: PresignedUpload[] = [];
  const errors: Array<{ index: number; error: string }> = [];

  for (let i = 0; i < request.uploads.length; i++) {
    try {
      const upload = await generatePresignedUpload(request.uploads[i], userId);
      uploads.push(upload);
    } catch (error) {
      errors.push({
        index: i,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  // If any uploads failed, include error details
  if (errors.length > 0) {
    throw new Error(
      `Failed to generate presigned URLs for ${errors.length} files: ` +
      JSON.stringify(errors)
    );
  }

  return {
    uploadId: nanoid(16),
    uploads,
    totalFiles: uploads.length,
    expiresIn: URL_EXPIRY_SECONDS,
  };
}

// ============================================
// UPLOAD UTILITIES
// ============================================

/**
 * Get public URL for uploaded file
 */
export function getPublicUrl(fileKey: string): string {
  if (S3_CONFIG.endpoint) {
    // Custom S3-compatible endpoint
    return `${S3_CONFIG.endpoint}/${S3_CONFIG.bucket}/${fileKey}`;
  }
  
  // Standard AWS S3 URL
  return `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${fileKey}`;
}

/**
 * Parse file key to extract metadata
 */
export function parseFileKey(fileKey: string): {
  folder: string;
  entityType?: string;
  entityId?: string | number;
  timestamp: number;
  uniqueId: string;
  fileName: string;
} {
  const parts = fileKey.split('/');
  const fileName = parts[parts.length - 1];
  const [timestamp, uniqueId, ...nameParts] = fileName.split('-');

  return {
    folder: parts[0],
    entityType: parts.length > 2 ? parts[1] : undefined,
    entityId: parts.length > 3 ? parts[2] : undefined,
    timestamp: parseInt(timestamp, 10),
    uniqueId,
    fileName: nameParts.join('-'),
  };
}

/**
 * Check if media type supports thumbnails
 */
export function supportsThumbnails(mediaType: MediaType): boolean {
  return UPLOAD_CONFIGS[mediaType]?.generateThumbnail || false;
}

/**
 * Get upload configuration for media type
 */
export function getUploadConfig(mediaType: MediaType): UploadConfig | null {
  return UPLOAD_CONFIGS[mediaType] || null;
}

/**
 * Format file size to human readable
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
