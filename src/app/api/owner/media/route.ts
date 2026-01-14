/**
 * Owner Dashboard - Media Management API
 * 
 * POST /api/owner/media/presign - Generate presigned upload URLs
 * POST /api/owner/media/verify - Verify upload completion
 * DELETE /api/owner/media/[key] - Delete media file
 * POST /api/owner/media/reorder - Reorder media files
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { nowUKFormatted } from '@/lib/date-utils';
import {
  generatePresignedUpload,
  generateBulkPresignedUploads,
  verifyUploadCompletion,
  reorderMedia,
  getMediaUsageStats,
  type PresignedUploadRequest,
} from '@/lib/media-presign';
import { logMediaAction, captureRequestDetails } from '@/lib/audit-logger';

// ============================================
// POST - Generate presigned upload URL(s)
// ============================================

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if ((session.user as any).role !== 'owner') {
      return NextResponse.json(
        { error: 'Access denied. Owner role required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action } = body;

    // Handle different actions
    if (action === 'presign') {
      return await handlePresignUpload(session.user.id, body, request);
    } else if (action === 'bulk-presign') {
      return await handleBulkPresignUpload(session.user.id, body, request);
    } else if (action === 'verify') {
      return await handleVerifyUpload(session.user.id, body);
    } else if (action === 'reorder') {
      return await handleReorder(session.user.id, body);
    } else if (action === 'usage-stats') {
      return await handleUsageStats(session.user.id);
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: presign, bulk-presign, verify, reorder, usage-stats' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error in media API:', error);
    return NextResponse.json(
      { error: 'Failed to process media request' },
      { status: 500 }
    );
  }
}

// ============================================
// HANDLER FUNCTIONS
// ============================================

async function handlePresignUpload(
  userId: string,
  body: any,
  request: NextRequest
) {
  const { propertyId, filename, fileType, fileSize, mediaType } = body;

  if (!propertyId || !filename || !fileType || !fileSize || !mediaType) {
    return NextResponse.json(
      { error: 'Missing required fields: propertyId, filename, fileType, fileSize, mediaType' },
      { status: 400 }
    );
  }

  const uploadRequest: PresignedUploadRequest = {
    userId,
    propertyId,
    filename,
    fileType,
    fileSize,
    mediaType,
  };

  try {
    const result = await generatePresignedUpload(uploadRequest);

    // Log audit event
    const requestDetails = captureRequestDetails(request);
    await logMediaAction(
      userId,
      'media.upload',
      result.fileKey,
      filename,
      { fileSize, fileType, mediaType, ...requestDetails }
    );

    return NextResponse.json({
      success: true,
      upload: result,
      timestamp: nowUKFormatted(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

async function handleBulkPresignUpload(
  userId: string,
  body: any,
  request: NextRequest
) {
  const { uploads } = body;

  if (!Array.isArray(uploads) || uploads.length === 0) {
    return NextResponse.json(
      { error: 'uploads must be a non-empty array' },
      { status: 400 }
    );
  }

  if (uploads.length > 20) {
    return NextResponse.json(
      { error: 'Maximum 20 uploads per request' },
      { status: 400 }
    );
  }

  const requests: PresignedUploadRequest[] = uploads.map(u => ({
    userId,
    propertyId: u.propertyId,
    filename: u.filename,
    fileType: u.fileType,
    fileSize: u.fileSize,
    mediaType: u.mediaType,
  }));

  const result = await generateBulkPresignedUploads(requests);

  // Log successful uploads
  const requestDetails = captureRequestDetails(request);
  for (const upload of result.successful) {
    await logMediaAction(
      userId,
      'media.upload',
      upload.fileKey,
      upload.fileKey.split('/').pop() || upload.fileKey,
      { bulk: true, ...requestDetails }
    );
  }

  return NextResponse.json({
    success: true,
    successful: result.successful,
    failed: result.failed,
    timestamp: nowUKFormatted(),
  });
}

async function handleVerifyUpload(userId: string, body: any) {
  const { fileKey } = body;

  if (!fileKey) {
    return NextResponse.json(
      { error: 'Missing required field: fileKey' },
      { status: 400 }
    );
  }

  const verification = await verifyUploadCompletion(fileKey);

  return NextResponse.json({
    success: true,
    verification,
    timestamp: nowUKFormatted(),
  });
}

async function handleReorder(userId: string, body: any) {
  const { propertyId, mediaIds } = body;

  if (!propertyId || !Array.isArray(mediaIds)) {
    return NextResponse.json(
      { error: 'Missing required fields: propertyId, mediaIds (array)' },
      { status: 400 }
    );
  }

  await reorderMedia(propertyId, userId, mediaIds);

  return NextResponse.json({
    success: true,
    message: 'Media reordered successfully',
    timestamp: nowUKFormatted(),
  });
}

async function handleUsageStats(userId: string) {
  const stats = await getMediaUsageStats(userId);

  return NextResponse.json({
    success: true,
    stats,
    timestamp: nowUKFormatted(),
  });
}
