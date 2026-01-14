/**
 * Database Migration Script
 * 
 * Adds property approval workflow fields to the properties table.
 * Run this script to update your existing database.
 * 
 * Usage:
 *   npm install tsx --save-dev
 *   npx tsx migrate-approval-workflow.ts
 */

import { db } from './src/db';
import { sql } from 'drizzle-orm';

async function migrateApprovalWorkflow() {
  console.log('🚀 Starting approval workflow migration...\n');

  try {
    // Step 1: Add status column
    console.log('📝 Adding status column...');
    await db.run(sql`
      ALTER TABLE properties 
      ADD COLUMN status TEXT NOT NULL DEFAULT 'pending'
    `);
    console.log('✅ Status column added\n');

    // Step 2: Add rejectionReason column
    console.log('📝 Adding rejection_reason column...');
    await db.run(sql`
      ALTER TABLE properties 
      ADD COLUMN rejection_reason TEXT
    `);
    console.log('✅ Rejection reason column added\n');

    // Step 3: Add approvedBy column
    console.log('📝 Adding approved_by column...');
    await db.run(sql`
      ALTER TABLE properties 
      ADD COLUMN approved_by TEXT
    `);
    console.log('✅ Approved by column added\n');

    // Step 4: Add approvedAt column
    console.log('📝 Adding approved_at column...');
    await db.run(sql`
      ALTER TABLE properties 
      ADD COLUMN approved_at TEXT
    `);
    console.log('✅ Approved at column added\n');

    // Step 5: Update existing published properties to approved
    console.log('📝 Setting existing published properties to approved status...');
    const result = await db.run(sql`
      UPDATE properties 
      SET status = 'approved',
          approved_at = datetime('now', 'localtime')
      WHERE is_published = 1
    `);
    console.log(`✅ Updated ${result.changes || 0} existing properties to approved\n`);

    // Step 6: Verify migration
    console.log('🔍 Verifying migration...');
    const statusCounts = await db.all(sql`
      SELECT status, COUNT(*) as count 
      FROM properties 
      GROUP BY status
    `);
    
    console.log('\n📊 Status distribution:');
    statusCounts.forEach((row: any) => {
      console.log(`   ${row.status}: ${row.count} properties`);
    });

    console.log('\n✨ Migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('   1. Test admin approval endpoints');
    console.log('   2. Test owner property creation (should be pending)');
    console.log('   3. Verify public APIs only show approved properties');
    console.log('   4. Update frontend to display status badges');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    console.error('\nPlease check:');
    console.error('   1. Database connection is working');
    console.error('   2. Properties table exists');
    console.error('   3. You have write permissions');
    throw error;
  }
}

// Run migration
migrateApprovalWorkflow()
  .then(() => {
    console.log('\n✅ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  });
