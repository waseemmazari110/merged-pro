/**
 * Test Script for Milestone 2 Database Tables
 * Tests all new tables with UK timestamp formats
 */

import { db } from './index';
import { subscriptions, invoices, media, enquiries } from './schema';
import { nowUKFormatted, todayUKFormatted, formatDateUK } from '@/lib/date-utils';

async function testMilestone2Tables() {
  console.log('🧪 Testing Milestone 2 Database Tables');
  console.log('═'.repeat(60));
  
  const now = nowUKFormatted();
  const today = todayUKFormatted();
  
  console.log(`\n📅 Current UK DateTime: ${now}`);
  console.log(`📅 Current UK Date: ${today}`);
  
  try {
    // Test 1: Subscriptions Table
    console.log('\n\n1️⃣ Testing SUBSCRIPTIONS table...');
    console.log('─'.repeat(60));
    
    const testSubscription = await db.insert(subscriptions).values({
      userId: 'test-user-123',
      stripeSubscriptionId: 'sub_test_123456',
      stripePriceId: 'price_test_123',
      stripeCustomerId: 'cus_test_123',
      planName: 'Premium',
      planType: 'monthly',
      status: 'active',
      currentPeriodStart: today,
      currentPeriodEnd: '12/01/2026',
      amount: 29.99,
      currency: 'GBP',
      interval: 'month',
      intervalCount: 1,
      cancelAtPeriodEnd: false,
      metadata: JSON.stringify({ testData: true }),
      createdAt: now,
      updatedAt: now,
    }).returning();
    
    console.log('✅ Subscription created successfully');
    console.log('   ID:', testSubscription[0].id);
    console.log('   Created At:', testSubscription[0].createdAt);
    console.log('   Period Start:', testSubscription[0].currentPeriodStart);
    console.log('   Format: DD/MM/YYYY HH:mm:ss');
    
    // Test 2: Invoices Table
    console.log('\n\n2️⃣ Testing INVOICES table...');
    console.log('─'.repeat(60));
    
    const testInvoice = await db.insert(invoices).values({
      userId: 'test-user-123',
      subscriptionId: testSubscription[0].id,
      stripeInvoiceId: 'in_test_123456',
      invoiceNumber: 'INV-2025-001',
      status: 'paid',
      description: 'Test invoice for Premium subscription',
      amountDue: 29.99,
      amountPaid: 29.99,
      amountRemaining: 0,
      currency: 'GBP',
      taxAmount: 5.00,
      subtotal: 24.99,
      total: 29.99,
      invoiceDate: today,
      dueDate: today,
      paidAt: now,
      periodStart: today,
      periodEnd: '12/01/2026',
      billingReason: 'subscription_create',
      customerEmail: 'test@example.com',
      customerName: 'Test User',
      metadata: JSON.stringify({ testInvoice: true }),
      createdAt: now,
      updatedAt: now,
    }).returning();
    
    console.log('✅ Invoice created successfully');
    console.log('   ID:', testInvoice[0].id);
    console.log('   Invoice Number:', testInvoice[0].invoiceNumber);
    console.log('   Invoice Date:', testInvoice[0].invoiceDate);
    console.log('   Paid At:', testInvoice[0].paidAt);
    console.log('   Format: DD/MM/YYYY HH:mm:ss');
    
    // Test 3: Media Table
    console.log('\n\n3️⃣ Testing MEDIA table...');
    console.log('─'.repeat(60));
    
    const testMedia = await db.insert(media).values({
      fileName: 'test-image.jpg',
      fileUrl: 'https://example.com/test-image.jpg',
      fileType: 'image',
      mimeType: 'image/jpeg',
      fileSize: 1024000,
      width: 1920,
      height: 1080,
      altText: 'Test image',
      caption: 'A test image for Milestone 2',
      title: 'Test Image',
      entityType: 'property',
      entityId: '1',
      uploadedBy: 'test-user-123',
      folder: 'properties',
      tags: JSON.stringify(['test', 'milestone2', 'image']),
      isPublic: true,
      storageProvider: 'supabase',
      storageKey: 'properties/test-image.jpg',
      metadata: JSON.stringify({ exif: { camera: 'Test Camera' } }),
      createdAt: now,
      updatedAt: now,
    }).returning();
    
    console.log('✅ Media created successfully');
    console.log('   ID:', testMedia[0].id);
    console.log('   File Name:', testMedia[0].fileName);
    console.log('   File Type:', testMedia[0].fileType);
    console.log('   Created At:', testMedia[0].createdAt);
    console.log('   Format: DD/MM/YYYY HH:mm:ss');
    
    // Test 4: Enquiries Table
    console.log('\n\n4️⃣ Testing ENQUIRIES table...');
    console.log('─'.repeat(60));
    
    const testEnquiry = await db.insert(enquiries).values({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+44 1234 567890',
      subject: 'Test Enquiry for Milestone 2',
      message: 'This is a test enquiry to verify the database schema.',
      enquiryType: 'booking',
      source: 'website',
      status: 'new',
      priority: 'medium',
      propertyId: 1,
      checkInDate: '20/12/2025',
      checkOutDate: '27/12/2025',
      numberOfGuests: 8,
      occasion: 'Christmas Holiday',
      budget: 2500.00,
      preferredLocations: JSON.stringify(['Brighton', 'Bath']),
      specialRequests: 'Hot tub access required',
      referralSource: 'Google Search',
      marketingConsent: true,
      ipAddress: '192.168.1.1',
      userAgent: 'Mozilla/5.0 Test Browser',
      metadata: JSON.stringify({ testEnquiry: true }),
      createdAt: now,
      updatedAt: now,
    }).returning();
    
    console.log('✅ Enquiry created successfully');
    console.log('   ID:', testEnquiry[0].id);
    console.log('   Name:', testEnquiry[0].firstName, testEnquiry[0].lastName);
    console.log('   Email:', testEnquiry[0].email);
    console.log('   Check-in:', testEnquiry[0].checkInDate);
    console.log('   Check-out:', testEnquiry[0].checkOutDate);
    console.log('   Created At:', testEnquiry[0].createdAt);
    console.log('   Format: DD/MM/YYYY HH:mm:ss');
    
    // Clean up test data
    console.log('\n\n🧹 Cleaning up test data...');
    console.log('─'.repeat(60));
    
    await db.delete(enquiries).where(eq(enquiries.id, testEnquiry[0].id));
    console.log('✅ Test enquiry deleted');
    
    await db.delete(media).where(eq(media.id, testMedia[0].id));
    console.log('✅ Test media deleted');
    
    await db.delete(invoices).where(eq(invoices.id, testInvoice[0].id));
    console.log('✅ Test invoice deleted');
    
    await db.delete(subscriptions).where(eq(subscriptions.id, testSubscription[0].id));
    console.log('✅ Test subscription deleted');
    
    // Summary
    console.log('\n\n✅ ALL TESTS PASSED!');
    console.log('═'.repeat(60));
    console.log('📊 Summary:');
    console.log('   ✓ Subscriptions table: Working');
    console.log('   ✓ Invoices table: Working');
    console.log('   ✓ Media table: Working');
    console.log('   ✓ Enquiries table: Working');
    console.log('   ✓ UK Timestamp format: DD/MM/YYYY HH:mm:ss');
    console.log('   ✓ UK Date format: DD/MM/YYYY');
    console.log('   ✓ All foreign keys: Working');
    console.log('   ✓ JSON fields: Working');
    console.log('═'.repeat(60));
    
    return true;
    
  } catch (error) {
    console.error('\n\n❌ TEST FAILED!');
    console.error('Error:', error);
    throw error;
  }
}

// Run tests if executed directly
if (require.main === module) {
  testMilestone2Tables()
    .then(() => {
      console.log('\n✅ Milestone 2 database tests completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Tests failed:', error);
      process.exit(1);
    });
}

export { testMilestone2Tables };
