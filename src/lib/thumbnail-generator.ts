/**
 * Thumbnail Generation Service
 * Generates thumbnails for images and videos
 * Milestone 7: Photo/Media Upload System
 */

import sharp from 'sharp';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import { updateThumbnailUrl } from './media-storage';
import { getPublicUrl } from './media-upload-handler';
import type { MediaType } from './media-upload-handler';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface ThumbnailConfig {
  width: number;
  height: number;
  fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
}

export interface ThumbnailSizes {
  small: ThumbnailConfig;
  medium: ThumbnailConfig;
  large: ThumbnailConfig;
}

export interface ThumbnailResult {
  thumbnailUrl: string;
  thumbnailKey: string;
  width: number;
  height: number;
  fileSize: number;
  format: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
  format: string;
  size: number;
}

export interface VideoThumbnailOptions {
  timestamp?: number; // Seconds into video
  width?: number;
  height?: number;
}

// ============================================
// CONFIGURATION
// ============================================

const THUMBNAIL_SIZES: ThumbnailSizes = {
  small: {
    width: 200,
    height: 200,
    fit: 'cover',
    quality: 80,
    format: 'webp',
  },
  medium: {
    width: 600,
    height: 600,
    fit: 'cover',
    quality: 85,
    format: 'webp',
  },
  large: {
    width: 1200,
    height: 1200,
    fit: 'inside',
    quality: 90,
    format: 'webp',
  },
};

const S3_CONFIG = {
  region: process.env.AWS_REGION || 'eu-west-2',
  bucket: process.env.AWS_S3_BUCKET || 'escape-houses-media',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  endpoint: process.env.AWS_S3_ENDPOINT,
};

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
// IMAGE PROCESSING
// ============================================

/**
 * Get image dimensions and metadata
 */
export async function getImageDimensions(
  fileKey: string
): Promise<ImageDimensions> {
  const s3 = getS3Client();

  // Download image from S3
  const command = new GetObjectCommand({
    Bucket: S3_CONFIG.bucket,
    Key: fileKey,
  });

  const response = await s3.send(command);
  const stream = response.Body as Readable;
  const buffer = await streamToBuffer(stream);

  // Get metadata using sharp
  const metadata = await sharp(buffer).metadata();

  return {
    width: metadata.width || 0,
    height: metadata.height || 0,
    format: metadata.format || 'unknown',
    size: buffer.length,
  };
}

/**
 * Generate thumbnail for image
 */
export async function generateImageThumbnail(
  fileKey: string,
  size: 'small' | 'medium' | 'large' = 'medium'
): Promise<ThumbnailResult> {
  const config = THUMBNAIL_SIZES[size];
  const s3 = getS3Client();

  // Download original image
  const getCommand = new GetObjectCommand({
    Bucket: S3_CONFIG.bucket,
    Key: fileKey,
  });

  const response = await s3.send(getCommand);
  const stream = response.Body as Readable;
  const buffer = await streamToBuffer(stream);

  // Generate thumbnail
  const thumbnailBuffer = await sharp(buffer)
    .resize(config.width, config.height, {
      fit: config.fit,
      withoutEnlargement: true,
    })
    .toFormat(config.format, { quality: config.quality })
    .toBuffer();

  // Get thumbnail metadata
  const metadata = await sharp(thumbnailBuffer).metadata();

  // Generate thumbnail key
  const thumbnailKey = fileKey.replace(
    /\.[^.]+$/,
    `-thumb-${size}.${config.format}`
  );

  // Upload thumbnail to S3
  const putCommand = new PutObjectCommand({
    Bucket: S3_CONFIG.bucket,
    Key: thumbnailKey,
    Body: thumbnailBuffer,
    ContentType: `image/${config.format}`,
    CacheControl: 'public, max-age=31536000', // 1 year
  });

  await s3.send(putCommand);

  // Get public URL
  const thumbnailUrl = getPublicUrl(thumbnailKey);

  return {
    thumbnailUrl,
    thumbnailKey,
    width: metadata.width || config.width,
    height: metadata.height || config.height,
    fileSize: thumbnailBuffer.length,
    format: config.format,
  };
}

/**
 * Generate multiple thumbnail sizes
 */
export async function generateImageThumbnails(
  fileKey: string
): Promise<Record<string, ThumbnailResult>> {
  const results: Record<string, ThumbnailResult> = {};

  // Generate all sizes in parallel
  const [small, medium, large] = await Promise.all([
    generateImageThumbnail(fileKey, 'small'),
    generateImageThumbnail(fileKey, 'medium'),
    generateImageThumbnail(fileKey, 'large'),
  ]);

  results.small = small;
  results.medium = medium;
  results.large = large;

  return results;
}

/**
 * Optimize image (compress without thumbnail)
 */
export async function optimizeImage(
  fileKey: string,
  quality: number = 85
): Promise<{ optimizedUrl: string; originalSize: number; optimizedSize: number }> {
  const s3 = getS3Client();

  // Download original
  const getCommand = new GetObjectCommand({
    Bucket: S3_CONFIG.bucket,
    Key: fileKey,
  });

  const response = await s3.send(getCommand);
  const stream = response.Body as Readable;
  const buffer = await streamToBuffer(stream);
  const originalSize = buffer.length;

  // Optimize
  const optimizedBuffer = await sharp(buffer)
    .webp({ quality })
    .toBuffer();

  // Generate optimized key
  const optimizedKey = fileKey.replace(/\.[^.]+$/, '-optimized.webp');

  // Upload optimized version
  const putCommand = new PutObjectCommand({
    Bucket: S3_CONFIG.bucket,
    Key: optimizedKey,
    Body: optimizedBuffer,
    ContentType: 'image/webp',
    CacheControl: 'public, max-age=31536000',
  });

  await s3.send(putCommand);

  return {
    optimizedUrl: getPublicUrl(optimizedKey),
    originalSize,
    optimizedSize: optimizedBuffer.length,
  };
}

// ============================================
// VIDEO PROCESSING
// ============================================

/**
 * Generate thumbnail from video (first frame)
 * Note: This is a placeholder. Full video thumbnail generation requires ffmpeg
 */
export async function generateVideoThumbnail(
  fileKey: string,
  options: VideoThumbnailOptions = {}
): Promise<ThumbnailResult> {
  const { width = 800, height = 600 } = options;

  // For production, you would use ffmpeg to extract a frame
  // This is a placeholder implementation that creates a generic thumbnail
  
  const config = THUMBNAIL_SIZES.medium;
  const s3 = getS3Client();

  // Generate placeholder thumbnail (grey rectangle with play icon)
  const placeholderBuffer = await sharp({
    create: {
      width: config.width,
      height: config.height,
      channels: 4,
      background: { r: 100, g: 100, b: 100, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  // Generate thumbnail key
  const thumbnailKey = fileKey.replace(/\.[^.]+$/, '-thumb.png');

  // Upload to S3
  const putCommand = new PutObjectCommand({
    Bucket: S3_CONFIG.bucket,
    Key: thumbnailKey,
    Body: placeholderBuffer,
    ContentType: 'image/png',
    CacheControl: 'public, max-age=31536000',
  });

  await s3.send(putCommand);

  return {
    thumbnailUrl: getPublicUrl(thumbnailKey),
    thumbnailKey,
    width: config.width,
    height: config.height,
    fileSize: placeholderBuffer.length,
    format: 'png',
  };
}

// ============================================
// DOCUMENT PROCESSING
// ============================================

/**
 * Generate thumbnail for PDF document
 * Note: This is a placeholder. Full PDF thumbnail requires pdf-lib or similar
 */
export async function generateDocumentThumbnail(
  fileKey: string
): Promise<ThumbnailResult> {
  const config = THUMBNAIL_SIZES.medium;
  const s3 = getS3Client();

  // Generate placeholder thumbnail (document icon)
  const placeholderBuffer = await sharp({
    create: {
      width: config.width,
      height: config.height,
      channels: 4,
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    },
  })
    .png()
    .toBuffer();

  // Generate thumbnail key
  const thumbnailKey = fileKey.replace(/\.[^.]+$/, '-thumb.png');

  // Upload to S3
  const putCommand = new PutObjectCommand({
    Bucket: S3_CONFIG.bucket,
    Key: thumbnailKey,
    Body: placeholderBuffer,
    ContentType: 'image/png',
    CacheControl: 'public, max-age=31536000',
  });

  await s3.send(putCommand);

  return {
    thumbnailUrl: getPublicUrl(thumbnailKey),
    thumbnailKey,
    width: config.width,
    height: config.height,
    fileSize: placeholderBuffer.length,
    format: 'png',
  };
}

// ============================================
// MAIN THUMBNAIL GENERATION
// ============================================

/**
 * Generate thumbnail based on media type
 */
export async function generateThumbnail(
  mediaId: number,
  fileKey: string,
  mediaType: MediaType
): Promise<ThumbnailResult> {
  let result: ThumbnailResult;

  switch (mediaType) {
    case 'image':
      result = await generateImageThumbnail(fileKey, 'medium');
      break;

    case 'video':
      result = await generateVideoThumbnail(fileKey);
      break;

    case 'document':
      result = await generateDocumentThumbnail(fileKey);
      break;

    default:
      throw new Error(`Thumbnail generation not supported for type: ${mediaType}`);
  }

  // Update media record with thumbnail URL
  await updateThumbnailUrl(mediaId, result.thumbnailUrl);

  return result;
}

/**
 * Generate thumbnails for multiple media files
 */
export async function generateThumbnails(
  mediaItems: Array<{ id: number; fileKey: string; mediaType: MediaType }>
): Promise<ThumbnailResult[]> {
  const results: ThumbnailResult[] = [];

  // Process in batches to avoid overwhelming the system
  const batchSize = 5;
  for (let i = 0; i < mediaItems.length; i += batchSize) {
    const batch = mediaItems.slice(i, i + batchSize);
    const batchResults = await Promise.allSettled(
      batch.map(item => generateThumbnail(item.id, item.fileKey, item.mediaType))
    );

    for (const result of batchResults) {
      if (result.status === 'fulfilled') {
        results.push(result.value);
      } else {
        console.error('Thumbnail generation failed:', result.reason);
      }
    }
  }

  return results;
}

// ============================================
// RESPONSIVE IMAGES
// ============================================

/**
 * Generate responsive image set (srcset)
 */
export async function generateResponsiveImages(
  fileKey: string,
  sizes: number[] = [320, 640, 960, 1280, 1920]
): Promise<Array<{ url: string; width: number; size: number }>> {
  const s3 = getS3Client();

  // Download original
  const getCommand = new GetObjectCommand({
    Bucket: S3_CONFIG.bucket,
    Key: fileKey,
  });

  const response = await s3.send(getCommand);
  const stream = response.Body as Readable;
  const buffer = await streamToBuffer(stream);

  const results: Array<{ url: string; width: number; size: number }> = [];

  // Generate each size
  for (const width of sizes) {
    const resizedBuffer = await sharp(buffer)
      .resize(width, null, {
        withoutEnlargement: true,
      })
      .webp({ quality: 85 })
      .toBuffer();

    const resizedKey = fileKey.replace(/\.[^.]+$/, `-${width}w.webp`);

    const putCommand = new PutObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: resizedKey,
      Body: resizedBuffer,
      ContentType: 'image/webp',
      CacheControl: 'public, max-age=31536000',
    });

    await s3.send(putCommand);

    results.push({
      url: getPublicUrl(resizedKey),
      width,
      size: resizedBuffer.length,
    });
  }

  return results;
}

// ============================================
// UTILITIES
// ============================================

/**
 * Convert stream to buffer
 */
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  const chunks: Buffer[] = [];
  
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  
  return Buffer.concat(chunks);
}

/**
 * Check if media type supports thumbnails
 */
export function supportsThumbnails(mediaType: MediaType): boolean {
  return ['image', 'video', 'document'].includes(mediaType);
}

/**
 * Get thumbnail configuration
 */
export function getThumbnailConfig(size: 'small' | 'medium' | 'large'): ThumbnailConfig {
  return THUMBNAIL_SIZES[size];
}

/**
 * Calculate aspect ratio
 */
export function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

/**
 * Get optimal thumbnail size based on display width
 */
export function getOptimalThumbnailSize(displayWidth: number): 'small' | 'medium' | 'large' {
  if (displayWidth <= 300) return 'small';
  if (displayWidth <= 800) return 'medium';
  return 'large';
}
