import { db } from './src/db/index';
import { user } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function verifyAdminAccess() {
  try {
    console.log('\n🔐 Admin Access Verification\n');
    console.log('============================\n');
    
    // Get all admin users
    const admins = await db.select().from(user).where(eq(user.role, 'admin'));
    
    if (admins.length === 0) {
      console.log('❌ No admin users found!\n');
      console.log('To create an admin user, run: npx tsx create-admin.ts\n');
      return;
    }
    
    console.log(`✅ Found ${admins.length} admin user(s):\n`);
    
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   ID: ${admin.id}`);
      console.log(`   Email Verified: ${admin.emailVerified ? '✓' : '✗'}`);
      console.log(`   Created: ${admin.createdAt}`);
      console.log('');
    });
    
    console.log('🎯 Admin Access URLs:');
    console.log('   Login: http://localhost:3000/admin/login');
    console.log('   Dashboard: http://localhost:3000/admin/dashboard');
    console.log('   Property Approvals: http://localhost:3000/admin/dashboard?view=approvals');
    console.log('');
    
    // Get all users summary
    const allUsers = await db.select().from(user);
    const roleStats = {
      admin: allUsers.filter(u => u.role === 'admin').length,
      owner: allUsers.filter(u => u.role === 'owner').length,
      guest: allUsers.filter(u => u.role === 'guest').length,
    };
    
    console.log('📊 User Statistics:');
    console.log(`   Total Users: ${allUsers.length}`);
    console.log(`   Admins: ${roleStats.admin}`);
    console.log(`   Owners: ${roleStats.owner}`);
    console.log(`   Guests: ${roleStats.guest}`);
    console.log('');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  process.exit(0);
}

verifyAdminAccess();
