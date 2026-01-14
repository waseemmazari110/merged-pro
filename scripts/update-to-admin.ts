import { db } from './src/db';
import { user } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function updateUserToAdmin() {
  const email = 'cswaseem110@gmail.com';
  
  try {
    console.log(`\nUpdating user ${email} to admin role...\n`);
    
    // Update the user role
    await db
      .update(user)
      .set({ role: 'admin' })
      .where(eq(user.email, email));
    
    console.log('✅ Successfully updated user role to admin!');
    console.log('\n📍 Admin Access:');
    console.log('   Login URL: http://localhost:3000/admin/login');
    console.log('   Dashboard: http://localhost:3000/admin/dashboard');
    console.log('\n👤 Your Credentials:');
    console.log(`   Email: ${email}`);
    console.log('   Password: (your existing password)');
    console.log('\n🎉 You can now login as admin!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating user:', error);
    process.exit(1);
  }
}

updateUserToAdmin();
