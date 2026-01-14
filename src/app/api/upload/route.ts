/**
 * Media Upload API Route
 * Handles upload initiation, completion, and management
 * Milestone 7: Photo/Media Upload System
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  generatePresignedUpload,
  generateBulkPresignedUploads,
  getPublicUrl,
  validateUpload,
  type UploadRequest,
  type BulkUploadRequest,
} from '@/lib/media-upload-handler';
import {
  createMediaRecord,
  createMediaRecords,
  getMediaByStorageKey,
  updateMediaDimensions,
  listMedia,
  deleteMediaRecord,
  getMediaStats,
  type CreateMediaInput,
} from '@/lib/media-storage';
import {
  generateThumbnail,
  getImageDimensions,
  supportsThumbnails,
} from '@/lib/thumbnail-generator';

// ============================================
// POST /api/upload - Multiple Actions
// ============================================

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { action } = body;

    // Get IP address for audit logging
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    // Route to appropriate action
    switch (action) {
      case 'initiate':
        return await initiateUpload(body, session.user.id);

      case 'bulk-initiate':
        return await bulkInitiateUpload(body, session.user.id);

      case 'complete':
        return await completeUpload(body, session.user.id, ipAddress);

      case 'bulk-complete':
        return await bulkCompleteUpload(body, session.user.id, ipAddress);

      case 'list':
        return await listUploads(body, session.user.id);

      case 'delete':
        return await deleteUpload(body, session.user.id, ipAddress);

      case 'stats':
        return await getUploadStats(session.user.id);

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// INITIATE UPLOAD
// ============================================

async function initiateUpload(body: any, userId: string) {
  const { fileName, fileType, fileSize, mediaType, entityType, entityId, folder, isPublic, altText, caption, tags } = body;

  // Validate required fields
  if (!fileName || !fileType || !fileSize || !mediaType) {
    return NextResponse.json(
      { error: 'Missing required fields: fileName, fileType, fileSize, mediaType' },
      { status: 400 }
    );
  }

  // Create upload request
  const uploadRequest: UploadRequest = {
    fileName,
    fileType,
    fileSize,
    mediaType,
    entityType,
    entityId,
    folder,
    isPublic,
    altText,
    caption,
    tags,
  };

  // Generate presigned URL
  const presignedUpload = await generatePresignedUpload(uploadRequest, userId);

  return NextResponse.json({
    success: true,
    upload: presignedUpload,
    instructions: {
      method: 'PUT',
      url: presignedUpload.uploadUrl,
      headers: presignedUpload.headers,
      body: 'File binary data',
      note: 'After successful upload, call complete action to finalize',
    },
  });
}

// ============================================
// BULK INITIATE UPLOAD
// ============================================

async function bulkInitiateUpload(body: any, userId: string) {
  const { uploads, maxConcurrent } = body;

  if (!uploads || !Array.isArray(uploads) || uploads.length === 0) {
    return NextResponse.json(
      { error: 'uploads array is required' },
      { status: 400 }
    );
  }

  // Create bulk request
  const bulkRequest: BulkUploadRequest = {
    uploads,
    maxConcurrent,
  };

  // Generate bulk presigned URLs
  const bulkResponse = await generateBulkPresignedUploads(bulkRequest, userId);

  return NextResponse.json({
    success: true,
    ...bulkResponse,
    instructions: {
      method: 'PUT',
      note: 'Upload each file to its corresponding uploadUrl, then call bulk-complete',
    },
  });
}

// ============================================
// COMPLETE UPLOAD
// ============================================

async function completeUpload(body: any, userId: string, ipAddress: string) {
  const {
    uploadId,
    fileKey,
    fileName,
    fileType,
    fileSize,
    mediaType,
    entityType,
    entityId,
    folder,
    isPublic,
    altText,
    caption,
    description,
    title,
    tags,
    metadata,
  } = body;

  // Validate required fields
  if (!fileKey || !fileName || !fileType || !fileSize || !mediaType) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Generate public URL
  const fileUrl = getPublicUrl(fileKey);

  // Create media record input
  const mediaInput: CreateMediaInput = {
    fileName,
    fileUrl,
    fileType: mediaType,
    mimeType: fileType,
    fileSize,
    altText,
    caption,
    description,
    title,
    entityType,
    entityId,
    uploadedBy: userId,
    folder: folder || 'general',
    tags,
    isPublic,
    metadata,
    storageKey: fileKey,
  };

  // Create media record in database
  const mediaRecord = await createMediaRecord(mediaInput, userId, ipAddress);

  // Process image dimensions and thumbnail generation in background
  processMediaPostUpload(mediaRecord.id, fileKey, mediaType).catch(error => {
    console.error('Post-upload processing error:', error);
  });

  return NextResponse.json({
    success: true,
    media: mediaRecord,
    message: 'Upload completed successfully',
  });
}

// ============================================
// BULK COMPLETE UPLOAD
// ============================================

async function bulkCompleteUpload(body: any, userId: string, ipAddress: string) {
  const { uploadId, completedUploads } = body;

  if (!completedUploads || !Array.isArray(completedUploads) || completedUploads.length === 0) {
    return NextResponse.json(
      { error: 'completedUploads array is required' },
      { status: 400 }
    );
  }

  // Create media inputs
  const mediaInputs: CreateMediaInput[] = completedUploads.map((upload: any) => ({
    fileName: upload.fileName,
    fileUrl: getPublicUrl(upload.fileKey),
    fileType: upload.mediaType,
    mimeType: upload.fileType,
    fileSize: upload.fileSize,
    altText: upload.altText,
    caption: upload.caption,
    description: upload.description,
    title: upload.title,
    entityType: upload.entityType,
    entityId: upload.entityId,
    uploadedBy: userId,
    folder: upload.folder || 'general',
    tags: upload.tags,
    isPublic: upload.isPublic,
    metadata: upload.metadata,
    storageKey: upload.fileKey,
  }));

  // Create all media records
  const mediaRecords = await createMediaRecords(mediaInputs, userId, ipAddress);

  // Process thumbnails in background
  for (const record of mediaRecords) {
    processMediaPostUpload(record.id, record.storageKey, record.fileType).catch(error => {
      console.error('Post-upload processing error:', error);
    });
  }

  return NextResponse.json({
    success: true,
    media: mediaRecords,
    totalCompleted: mediaRecords.length,
    message: 'Bulk upload completed successfully',
  });
}

// ============================================
// LIST UPLOADS
// ============================================

async function listUploads(body: any, userId: string) {
  const {
    fileType,
    entityType,
    entityId,
    folder,
    tags,
    searchTerm,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    limit = 50,
    offset = 0,
  } = body;

  // Build filters
  const filters: any = {};
  
  if (fileType) filters.fileType = fileType;
  if (entityType) filters.entityType = entityType;
  if (entityId) filters.entityId = entityId;
  if (folder) filters.folder = folder;
  if (tags) filters.tags = tags;
  if (searchTerm) filters.searchTerm = searchTerm;
  
  // Only show user's uploads (or all if admin)
  // For now, restrict to user's own uploads
  filters.uploadedBy = userId;

  // List media
  const result = await listMedia({
    filters,
    sortBy,
    sortOrder,
    limit,
    offset,
  });

  return NextResponse.json({
    success: true,
    ...result,
    pagination: {
      limit,
      offset,
      total: result.total,
      hasMore: offset + limit < result.total,
    },
  });
}

// ============================================
// DELETE UPLOAD
// ============================================

async function deleteUpload(body: any, userId: string, ipAddress: string) {
  const { mediaId } = body;

  if (!mediaId) {
    return NextResponse.json(
      { error: 'mediaId is required' },
      { status: 400 }
    );
  }

  // Get media record
  const media = await getMediaByStorageKey(body.fileKey || '');
  
  if (!media) {
    return NextResponse.json(
      { error: 'Media not found' },
      { status: 404 }
    );
  }

  // Check ownership
  if (media.uploadedBy !== userId) {
    return NextResponse.json(
      { error: 'Unauthorized to delete this media' },
      { status: 403 }
    );
  }

  // Delete media record
  await deleteMediaRecord(media.id, userId, ipAddress);

  // TODO: Delete from S3 (implement S3 deletion)

  return NextResponse.json({
    success: true,
    message: 'Media deleted successfully',
  });
}

// ============================================
// GET STATS
// ============================================

async function getUploadStats(userId: string) {
  const stats = await getMediaStats(userId);

  return NextResponse.json({
    success: true,
    stats,
  });
}

// ============================================
// POST-UPLOAD PROCESSING
// ============================================

/**
 * Process media after upload (dimensions, thumbnails, etc.)
 * This runs asynchronously in the background
 */
async function processMediaPostUpload(
  mediaId: number,
  fileKey: string,
  mediaType: string
): Promise<void> {
  try {
    // Get image dimensions if it's an image
    if (mediaType === 'image') {
      const dimensions = await getImageDimensions(fileKey);
      await updateMediaDimensions(mediaId, dimensions.width, dimensions.height);
    }

    // Generate thumbnail if supported
    if (supportsThumbnails(mediaType as any)) {
      await generateThumbnail(mediaId, fileKey, mediaType as any);
    }
  } catch (error) {
    console.error('Post-upload processing failed:', error);
    throw error;
  }
}

// ============================================
// GET /api/upload - Check Upload Status
// ============================================

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const fileKey = searchParams.get('fileKey');

    if (!fileKey) {
      return NextResponse.json(
        { error: 'fileKey parameter is required' },
        { status: 400 }
      );
    }

    // Get media record
    const media = await getMediaByStorageKey(fileKey);

    if (!media) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (media.uploadedBy !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      media,
    });
  } catch (error) {
    console.error('Upload status check error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
