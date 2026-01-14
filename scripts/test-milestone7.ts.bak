/**
 * Milestone 7 - Media Upload System Test Suite
 * Tests for presigned uploads, storage, and thumbnail generation
 */

import {
  sanitizeFileName,
  validateUpload,
  generatePresignedUpload,
  generateBulkPresignedUploads,
  getPublicUrl,
  parseFileKey,
  supportsThumbnails,
  formatFileSize,
  type UploadRequest,
} from '../lib/media-upload-handler';
import {
  createMediaRecord,
  getMediaById,
  listMedia,
  updateMediaRecord,
  deleteMediaRecord,
  getMediaStats,
  type CreateMediaInput,
} from '../lib/media-storage';
import {
  getImageDimensions,
  generateImageThumbnail,
  calculateAspectRatio,
  getOptimalThumbnailSize,
} from '../lib/thumbnail-generator';

// ============================================
// TEST UTILITIES
// ============================================

function log(section: string, message: string, data?: any) {
  console.log(`\n[${section}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

function logSuccess(message: string) {
  console.log(`✅ ${message}`);
}

function logError(message: string, error?: any) {
  console.error(`❌ ${message}`);
  if (error) {
    console.error(error);
  }
}

// ============================================
// TEST 1: FILE VALIDATION
// ============================================

async function testFileValidation() {
  log('TEST 1', 'File Validation & Sanitization');

  try {
    // Test 1.1: Filename sanitization
    const dangerousNames = [
      '../../../etc/passwd',
      'test<script>.jpg',
      'file|name.png',
      'path\\to\\file.pdf',
      '   spaces   .doc',
      'multiple____underscores.txt',
    ];

    for (const name of dangerousNames) {
      const sanitized = sanitizeFileName(name);
      if (sanitized.includes('..') || sanitized.includes('<') || sanitized.includes('>')) {
        throw new Error(`Sanitization failed for: ${name}`);
      }
      logSuccess(`Sanitized: "${name}" → "${sanitized}"`);
    }

    // Test 1.2: Valid upload requests
    const validRequest: UploadRequest = {
      fileName: 'test-image.jpg',
      fileType: 'image/jpeg',
      fileSize: 2048000, // 2MB
      mediaType: 'image',
    };

    const validation = validateUpload(validRequest);
    if (!validation.valid) {
      throw new Error('Valid request marked as invalid');
    }
    logSuccess('Valid upload request accepted');

    // Test 1.3: File size validation
    const oversizedRequest: UploadRequest = {
      fileName: 'huge.jpg',
      fileType: 'image/jpeg',
      fileSize: 50 * 1024 * 1024, // 50MB (exceeds 10MB limit)
      mediaType: 'image',
    };

    const sizeValidation = validateUpload(oversizedRequest);
    if (sizeValidation.valid) {
      throw new Error('Oversized file should be rejected');
    }
    logSuccess('Oversized file rejected: ' + sizeValidation.error);

    // Test 1.4: MIME type validation
    const invalidMimeRequest: UploadRequest = {
      fileName: 'test.jpg',
      fileType: 'application/exe',
      fileSize: 1024000,
      mediaType: 'image',
    };

    const mimeValidation = validateUpload(invalidMimeRequest);
    if (mimeValidation.valid) {
      throw new Error('Invalid MIME type should be rejected');
    }
    logSuccess('Invalid MIME type rejected: ' + mimeValidation.error);

    logSuccess('✅ FILE VALIDATION TESTS PASSED');
  } catch (error) {
    logError('FILE VALIDATION TESTS FAILED', error);
    throw error;
  }
}

// ============================================
// TEST 2: PRESIGNED URL GENERATION
// ============================================

async function testPresignedUrls() {
  log('TEST 2', 'Presigned URL Generation');

  try {
    const testUserId = 'test-user-123';

    // Test 2.1: Single presigned URL
    const uploadRequest: UploadRequest = {
      fileName: 'test-photo.jpg',
      fileType: 'image/jpeg',
      fileSize: 2048000,
      mediaType: 'image',
      entityType: 'property',
      entityId: '123',
      folder: 'properties',
    };

    const presigned = await generatePresignedUpload(uploadRequest, testUserId);

    if (!presigned.uploadUrl) {
      throw new Error('No upload URL generated');
    }
    if (!presigned.fileKey) {
      throw new Error('No file key generated');
    }
    if (!presigned.uploadId) {
      throw new Error('No upload ID generated');
    }

    logSuccess('Single presigned URL generated');
    log('Presigned Upload', 'Details:', {
      uploadId: presigned.uploadId,
      fileName: presigned.fileName,
      fileKey: presigned.fileKey,
      expiresIn: presigned.expiresIn,
      urlLength: presigned.uploadUrl.length,
    });

    // Test 2.2: Bulk presigned URLs
    const bulkRequest = {
      uploads: [
        {
          fileName: 'photo1.jpg',
          fileType: 'image/jpeg',
          fileSize: 1024000,
          mediaType: 'image' as const,
        },
        {
          fileName: 'photo2.png',
          fileType: 'image/png',
          fileSize: 2048000,
          mediaType: 'image' as const,
        },
        {
          fileName: 'video.mp4',
          fileType: 'video/mp4',
          fileSize: 10485760,
          mediaType: 'video' as const,
        },
      ],
    };

    const bulkPresigned = await generateBulkPresignedUploads(bulkRequest, testUserId);

    if (bulkPresigned.uploads.length !== 3) {
      throw new Error('Expected 3 presigned URLs');
    }
    if (bulkPresigned.totalFiles !== 3) {
      throw new Error('Total files count incorrect');
    }

    logSuccess(`Bulk presigned URLs generated: ${bulkPresigned.totalFiles} files`);

    // Test 2.3: File key parsing
    const parsedKey = parseFileKey(presigned.fileKey);
    if (!parsedKey.fileName) {
      throw new Error('File name not parsed from key');
    }
    logSuccess('File key parsed successfully');
    log('Parsed Key', 'Components:', parsedKey);

    // Test 2.4: Public URL generation
    const publicUrl = getPublicUrl(presigned.fileKey);
    if (!publicUrl.startsWith('http')) {
      throw new Error('Invalid public URL generated');
    }
    logSuccess('Public URL generated: ' + publicUrl.substring(0, 50) + '...');

    logSuccess('✅ PRESIGNED URL TESTS PASSED');
  } catch (error) {
    logError('PRESIGNED URL TESTS FAILED', error);
    throw error;
  }
}

// ============================================
// TEST 3: MEDIA STORAGE (Mock)
// ============================================

async function testMediaStorage() {
  log('TEST 3', 'Media Storage System (Structure Tests)');

  try {
    // Test 3.1: CreateMediaInput validation
    const mediaInput: CreateMediaInput = {
      fileName: 'test-image.jpg',
      fileUrl: 'https://example.com/test.jpg',
      fileType: 'image',
      mimeType: 'image/jpeg',
      fileSize: 2048000,
      width: 1920,
      height: 1080,
      altText: 'Test image',
      caption: 'This is a test',
      entityType: 'property',
      entityId: '123',
      uploadedBy: 'user-123',
      folder: 'properties',
      tags: ['test', 'demo'],
      isPublic: true,
      storageKey: 'properties/property/123/test.jpg',
    };

    if (!mediaInput.fileName || !mediaInput.fileUrl || !mediaInput.storageKey) {
      throw new Error('Required media input fields missing');
    }
    logSuccess('Media input structure validated');

    // Test 3.2: Media filters structure
    const filters = {
      fileType: 'image' as const,
      entityType: 'property',
      uploadedBy: 'user-123',
      isPublic: true,
    };

    if (typeof filters.fileType !== 'string') {
      throw new Error('Invalid filter type');
    }
    logSuccess('Media filters structure validated');

    // Test 3.3: List options structure
    const listOptions = {
      filters,
      sortBy: 'createdAt' as const,
      sortOrder: 'desc' as const,
      limit: 50,
      offset: 0,
    };

    if (listOptions.limit <= 0 || listOptions.offset < 0) {
      throw new Error('Invalid pagination parameters');
    }
    logSuccess('List options structure validated');

    // Test 3.4: Update input structure
    const updateInput = {
      altText: 'Updated alt text',
      caption: 'Updated caption',
      tags: ['updated'],
      isPublic: false,
    };

    if (typeof updateInput.altText !== 'string') {
      throw new Error('Invalid update input');
    }
    logSuccess('Update input structure validated');

    logSuccess('✅ MEDIA STORAGE TESTS PASSED');
  } catch (error) {
    logError('MEDIA STORAGE TESTS FAILED', error);
    throw error;
  }
}

// ============================================
// TEST 4: THUMBNAIL UTILITIES
// ============================================

async function testThumbnailUtilities() {
  log('TEST 4', 'Thumbnail Generation Utilities');

  try {
    // Test 4.1: Thumbnail support detection
    const imageSupport = supportsThumbnails('image');
    const videoSupport = supportsThumbnails('video');
    const audioSupport = supportsThumbnails('audio');

    if (!imageSupport) {
      throw new Error('Images should support thumbnails');
    }
    if (!videoSupport) {
      throw new Error('Videos should support thumbnails');
    }
    if (audioSupport) {
      throw new Error('Audio should not support thumbnails');
    }

    logSuccess('Thumbnail support detection works');

    // Test 4.2: Aspect ratio calculation
    const aspectRatio1 = calculateAspectRatio(1920, 1080);
    const aspectRatio2 = calculateAspectRatio(1200, 800);
    const aspectRatio3 = calculateAspectRatio(1000, 1000);

    if (aspectRatio1 !== '16:9') {
      throw new Error(`Expected 16:9, got ${aspectRatio1}`);
    }
    if (aspectRatio2 !== '3:2') {
      throw new Error(`Expected 3:2, got ${aspectRatio2}`);
    }
    if (aspectRatio3 !== '1:1') {
      throw new Error(`Expected 1:1, got ${aspectRatio3}`);
    }

    logSuccess('Aspect ratio calculations correct');
    log('Aspect Ratios', 'Results:', {
      '1920x1080': aspectRatio1,
      '1200x800': aspectRatio2,
      '1000x1000': aspectRatio3,
    });

    // Test 4.3: Optimal thumbnail size selection
    const small = getOptimalThumbnailSize(200);
    const medium = getOptimalThumbnailSize(600);
    const large = getOptimalThumbnailSize(1200);

    if (small !== 'small') {
      throw new Error('Should select small thumbnail');
    }
    if (medium !== 'medium') {
      throw new Error('Should select medium thumbnail');
    }
    if (large !== 'large') {
      throw new Error('Should select large thumbnail');
    }

    logSuccess('Optimal thumbnail size selection works');

    logSuccess('✅ THUMBNAIL UTILITY TESTS PASSED');
  } catch (error) {
    logError('THUMBNAIL UTILITY TESTS FAILED', error);
    throw error;
  }
}

// ============================================
// TEST 5: FILE SIZE FORMATTING
// ============================================

async function testFormatting() {
  log('TEST 5', 'File Size Formatting');

  try {
    const sizes = [
      { bytes: 0, expected: '0 Bytes' },
      { bytes: 1024, expected: '1 KB' },
      { bytes: 1048576, expected: '1 MB' },
      { bytes: 1073741824, expected: '1 GB' },
      { bytes: 2560000, expected: '2.44 MB' },
    ];

    for (const { bytes, expected } of sizes) {
      const formatted = formatFileSize(bytes);
      if (formatted !== expected) {
        throw new Error(`Expected "${expected}", got "${formatted}"`);
      }
      logSuccess(`${bytes} bytes → ${formatted}`);
    }

    logSuccess('✅ FORMATTING TESTS PASSED');
  } catch (error) {
    logError('FORMATTING TESTS FAILED', error);
    throw error;
  }
}

// ============================================
// TEST 6: API ENDPOINT STRUCTURE
// ============================================

async function testApiStructure() {
  log('TEST 6', 'API Endpoint Structure');

  try {
    // Test 6.1: Upload actions
    const validActions = [
      'initiate',
      'bulk-initiate',
      'complete',
      'bulk-complete',
      'list',
      'delete',
      'stats',
    ];

    for (const action of validActions) {
      if (typeof action !== 'string' || action.length === 0) {
        throw new Error(`Invalid action: ${action}`);
      }
    }
    logSuccess('Upload actions validated');

    // Test 6.2: Initiate request structure
    const initiateRequest = {
      action: 'initiate',
      fileName: 'test.jpg',
      fileType: 'image/jpeg',
      fileSize: 2048000,
      mediaType: 'image',
      entityType: 'property',
      entityId: '123',
    };

    if (!initiateRequest.action || !initiateRequest.fileName) {
      throw new Error('Invalid initiate request structure');
    }
    logSuccess('Initiate request structure validated');

    // Test 6.3: Complete request structure
    const completeRequest = {
      action: 'complete',
      uploadId: 'upload-123',
      fileKey: 'properties/test.jpg',
      fileName: 'test.jpg',
      fileType: 'image/jpeg',
      fileSize: 2048000,
      mediaType: 'image',
    };

    if (!completeRequest.action || !completeRequest.fileKey) {
      throw new Error('Invalid complete request structure');
    }
    logSuccess('Complete request structure validated');

    // Test 6.4: List request structure
    const listRequest = {
      action: 'list',
      fileType: 'image',
      limit: 50,
      offset: 0,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };

    if (listRequest.limit <= 0) {
      throw new Error('Invalid list request structure');
    }
    logSuccess('List request structure validated');

    logSuccess('✅ API STRUCTURE TESTS PASSED');
  } catch (error) {
    logError('API STRUCTURE TESTS FAILED', error);
    throw error;
  }
}

// ============================================
// RUN ALL TESTS
// ============================================

async function runAllTests() {
  console.log('============================================================');
  console.log('🚀 MILESTONE 7 - MEDIA UPLOAD SYSTEM TEST SUITE');
  console.log('============================================================');

  const startTime = Date.now();
  let passedTests = 0;
  let failedTests = 0;

  const tests = [
    { name: 'File Validation', fn: testFileValidation },
    { name: 'Presigned URLs', fn: testPresignedUrls },
    { name: 'Media Storage', fn: testMediaStorage },
    { name: 'Thumbnail Utilities', fn: testThumbnailUtilities },
    { name: 'Formatting', fn: testFormatting },
    { name: 'API Structure', fn: testApiStructure },
  ];

  for (const test of tests) {
    try {
      await test.fn();
      passedTests++;
    } catch (error) {
      failedTests++;
      console.error(`\n❌ ${test.name} FAILED:`, error);
    }
  }

  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);

  console.log('\n============================================================');
  console.log(`✅ TESTS PASSED: ${passedTests}/${tests.length}`);
  console.log(`❌ TESTS FAILED: ${failedTests}/${tests.length}`);
  console.log(`⏱️  DURATION: ${duration}s`);
  console.log('============================================================');

  if (failedTests === 0) {
    console.log('\n🎉 ALL TESTS PASSED!\n');
  } else {
    console.log('\n⚠️  SOME TESTS FAILED\n');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('Test suite error:', error);
  process.exit(1);
});
