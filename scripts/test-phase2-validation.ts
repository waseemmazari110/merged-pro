/**
 * Subscription & CRM Validation Tests
 * Phase 2: Deliverables Validation
 * 
 * Run with: npx tsx test-phase2-validation.ts
 */

import { db } from '@/db';
import { user, subscriptions, crmOwnerProfiles, crmPropertyLinks, properties } from '@/db/schema';
import { 
  syncMembershipStatus, 
  getMembershipData, 
  syncPropertiesToCRM,
  updateMembershipAfterPayment,
  downgradeAfterCancellation 
} from '@/lib/crm-sync';
import { eq } from 'drizzle-orm';
import { nowUKFormatted } from '@/lib/date-utils';

// ============================================
// TEST 1: SUBSCRIPTION STATUS → ROLE SYNC
// ============================================

async function testSubscriptionRoleSync() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 1: SUBSCRIPTION STATUS → ROLE SYNC');
  console.log('='.repeat(70) + '\n');

  try {
    // Find a test user (or use specific ID)
    const testUsers = await db.select().from(user).limit(1);
    
    if (testUsers.length === 0) {
      console.log('❌ No users found in database. Create a user first.');
      return;
    }

    const testUserId = testUsers[0].id;
    console.log(`📋 Testing with user ID: ${testUserId}`);
    console.log(`📧 Email: ${testUsers[0].email}`);
    console.log(`👤 Current role: ${testUsers[0].role}\n`);

    // Test Case 1: Active subscription → Owner role
    console.log('Test Case 1: Active Subscription → Owner Role');
    console.log('-'.repeat(50));

    const userSub = await db.select().from(subscriptions)
      .where(eq(subscriptions.userId, testUserId))
      .limit(1);

    if (userSub.length > 0) {
      // Update to active
      await db.update(subscriptions)
        .set({ 
          status: 'active',
          updatedAt: nowUKFormatted() 
        })
        .where(eq(subscriptions.userId, testUserId));
      
      console.log('✓ Updated subscription status to "active"');

      // Trigger sync
      const syncResult = await syncMembershipStatus(testUserId);
      console.log('✓ CRM sync triggered');
      console.log(`  - Changes: ${syncResult.changes.join(', ') || 'none'}`);
      console.log(`  - New status: ${syncResult.newStatus}`);
      console.log(`  - New role: ${syncResult.newRole}`);

      // Verify
      const updatedUser = await db.select().from(user)
        .where(eq(user.id, testUserId))
        .limit(1);

      const expectedRole = 'owner';
      const actualRole = updatedUser[0].role;
      
      if (actualRole === expectedRole) {
        console.log(`✅ PASS: Role is "${expectedRole}"`);
      } else {
        console.log(`❌ FAIL: Expected "${expectedRole}", got "${actualRole}"`);
      }
    } else {
      console.log('⚠️  No subscription found for user. Skipping active test.');
    }

    console.log('');

    // Test Case 2: Cancelled subscription → Guest role
    console.log('Test Case 2: Cancelled Subscription → Guest Role');
    console.log('-'.repeat(50));

    if (userSub.length > 0) {
      // Update to cancelled
      await db.update(subscriptions)
        .set({ 
          status: 'cancelled',
          cancelledAt: nowUKFormatted(),
          updatedAt: nowUKFormatted() 
        })
        .where(eq(subscriptions.userId, testUserId));
      
      console.log('✓ Updated subscription status to "cancelled"');

      // Trigger downgrade
      await downgradeAfterCancellation(testUserId);
      console.log('✓ Downgrade triggered');

      // Verify
      const downgraded = await db.select().from(user)
        .where(eq(user.id, testUserId))
        .limit(1);

      const expectedRole = 'guest';
      const actualRole = downgraded[0].role;
      
      if (actualRole === expectedRole) {
        console.log(`✅ PASS: Role downgraded to "${expectedRole}"`);
      } else {
        console.log(`❌ FAIL: Expected "${expectedRole}", got "${actualRole}"`);
      }
    }

    console.log('\n✓ Test 1 Complete\n');

  } catch (error) {
    console.error('❌ Test 1 Error:', error);
  }
}

// ============================================
// TEST 2: MEMBERSHIP DATA RETRIEVAL
// ============================================

async function testMembershipDataRetrieval() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 2: MEMBERSHIP DATA RETRIEVAL');
  console.log('='.repeat(70) + '\n');

  try {
    const testUsers = await db.select().from(user).limit(1);
    
    if (testUsers.length === 0) {
      console.log('❌ No users found');
      return;
    }

    const testUserId = testUsers[0].id;
    console.log(`📋 Testing with user ID: ${testUserId}\n`);

    // Fetch membership data
    const membership = await getMembershipData(testUserId);

    if (!membership) {
      console.log('❌ FAIL: getMembershipData returned null');
      return;
    }

    console.log('Membership Data Retrieved:');
    console.log('-'.repeat(50));
    console.log(`Status: ${membership.status}`);
    console.log(`Role: ${membership.role}`);
    console.log(`Tier: ${membership.tier}`);
    console.log(`Plan Name: ${membership.planName || 'None'}`);
    console.log(`Max Properties: ${membership.maxProperties}`);
    console.log(`Max Photos: ${membership.maxPhotos}`);
    console.log(`Features:`);
    console.log(`  - Analytics: ${membership.hasAnalytics ? '✅' : '❌'}`);
    console.log(`  - Priority Support: ${membership.hasPrioritySupport ? '✅' : '❌'}`);
    console.log(`  - API Access: ${membership.hasApiAccess ? '✅' : '❌'}`);
    console.log(`  - Custom Domain: ${membership.hasCustomDomain ? '✅' : '❌'}`);
    console.log(`Last Synced: ${membership.lastSyncedAt}`);

    // Verify consistency
    const isConsistent = 
      (membership.status === 'active' && membership.role === 'owner') ||
      (membership.status === 'trial' && membership.role === 'owner') ||
      (membership.status === 'past_due' && membership.role === 'owner') ||
      (membership.status === 'free' && membership.role === 'guest') ||
      (membership.status === 'cancelled' && membership.role === 'guest') ||
      (membership.status === 'expired' && membership.role === 'guest') ||
      (membership.status === 'suspended' && membership.role === 'guest') ||
      (membership.role === 'admin');

    if (isConsistent) {
      console.log('\n✅ PASS: Status and role are consistent');
    } else {
      console.log('\n❌ FAIL: Status/role mismatch detected!');
    }

    console.log('\n✓ Test 2 Complete\n');

  } catch (error) {
    console.error('❌ Test 2 Error:', error);
  }
}

// ============================================
// TEST 3: CRM PROPERTY SYNC
// ============================================

async function testCRMPropertySync() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 3: CRM PROPERTY SYNC');
  console.log('='.repeat(70) + '\n');

  try {
    // Find owner with properties
    const owners = await db.select().from(user).where(eq(user.role, 'owner')).limit(1);
    
    if (owners.length === 0) {
      console.log('⚠️  No owners found. Create an owner account first.');
      return;
    }

    const ownerId = owners[0].id;
    console.log(`📋 Testing with owner ID: ${ownerId}`);
    console.log(`📧 Email: ${owners[0].email}\n`);

    // Get actual properties
    const actualProperties = await db.select()
      .from(properties)
      .where(eq(properties.ownerId, ownerId));

    console.log(`Properties in database: ${actualProperties.length}`);

    if (actualProperties.length > 0) {
      actualProperties.forEach((prop, idx) => {
        console.log(`  ${idx + 1}. ${prop.title} (ID: ${prop.id})`);
      });
    }

    console.log('');

    // Trigger CRM sync
    console.log('Triggering CRM property sync...');
    const syncResult = await syncPropertiesToCRM(ownerId);
    console.log(`✓ Sync completed. Properties synced: ${syncResult.propertySyncCount}`);

    // Verify CRM links
    const crmLinks = await db.select()
      .from(crmPropertyLinks)
      .where(eq(crmPropertyLinks.ownerId, ownerId));

    console.log(`CRM property links: ${crmLinks.length}\n`);

    // Compare counts
    if (actualProperties.length === crmLinks.length) {
      console.log('✅ PASS: Property counts match');
    } else {
      console.log(`❌ FAIL: Count mismatch (DB: ${actualProperties.length}, CRM: ${crmLinks.length})`);
    }

    // Verify each property
    console.log('\nProperty-by-property verification:');
    console.log('-'.repeat(50));

    let allMatch = true;
    for (const prop of actualProperties) {
      const link = crmLinks.find(l => l.propertyId === prop.id);
      
      if (!link) {
        console.log(`❌ Property ${prop.id} (${prop.title}) - NOT IN CRM`);
        allMatch = false;
      } else {
        // CRM links only track propertyId and linkStatus
        // Property details fetched via join, so just verify link exists
        console.log(`✅ Property ${prop.id} (${prop.title}) - CRM link exists`);
        console.log(`   Link status: ${link.linkStatus}`);
        console.log(`   Ownership: ${link.ownershipType || 'N/A'}`);
      }
    }

    if (allMatch && actualProperties.length > 0) {
      console.log('\n✅ PASS: All properties synced correctly');
    } else if (actualProperties.length === 0) {
      console.log('\n⚠️  No properties to verify');
    }

    console.log('\n✓ Test 3 Complete\n');

  } catch (error) {
    console.error('❌ Test 3 Error:', error);
  }
}

// ============================================
// TEST 4: CRM PROFILE EXISTS
// ============================================

async function testCRMProfileExists() {
  console.log('\n' + '='.repeat(70));
  console.log('TEST 4: CRM PROFILE EXISTENCE');
  console.log('='.repeat(70) + '\n');

  try {
    const owners = await db.select().from(user).where(eq(user.role, 'owner')).limit(5);

    console.log(`Checking CRM profiles for ${owners.length} owner(s):\n`);

    let allHaveProfiles = true;

    for (const owner of owners) {
      const profile = await db.select()
        .from(crmOwnerProfiles)
        .where(eq(crmOwnerProfiles.userId, owner.id))
        .limit(1);

      if (profile.length > 0) {
        console.log(`✅ ${owner.email} - CRM profile exists`);
        console.log(`   Business: ${profile[0].businessName || 'N/A'}`);
        console.log(`   Status: ${profile[0].status || 'N/A'}`);
        console.log(`   Country: ${profile[0].country || 'N/A'}`);
      } else {
        console.log(`❌ ${owner.email} - NO CRM PROFILE`);
        allHaveProfiles = false;
      }
    }

    console.log('');

    if (allHaveProfiles && owners.length > 0) {
      console.log('✅ PASS: All owners have CRM profiles');
    } else if (owners.length === 0) {
      console.log('⚠️  No owners to check');
    } else {
      console.log('❌ FAIL: Some owners missing CRM profiles');
    }

    console.log('\n✓ Test 4 Complete\n');

  } catch (error) {
    console.error('❌ Test 4 Error:', error);
  }
}

// ============================================
// RUN ALL TESTS
// ============================================

async function runAllTests() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║       PHASE 2: SUBSCRIPTION & CRM VALIDATION TESTS                 ║');
  console.log('║       Started: ' + nowUKFormatted() + '                             ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝');

  await testSubscriptionRoleSync();
  await testMembershipDataRetrieval();
  await testCRMPropertySync();
  await testCRMProfileExists();

  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════════╗');
  console.log('║       ALL TESTS COMPLETED                                          ║');
  console.log('║       Finished: ' + nowUKFormatted() + '                            ║');
  console.log('╚════════════════════════════════════════════════════════════════════╝');
  console.log('\n');
}

// Execute tests
runAllTests()
  .then(() => {
    console.log('✓ Test suite execution complete\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
