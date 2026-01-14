import 'dotenv/config';
import { db } from './src/db/index';
import { user, session } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function checkUserSession() {
  try {
    console.log('Checking user and session data...\n');

    const targetEmail = 'risek290@gmail.com';
    
    // Get the user
    const [currentUser] = await db.select().from(user).where(eq(user.email, targetEmail)).limit(1);
    
    if (!currentUser) {
      console.log(`❌ User not found with email: ${targetEmail}`);
      return;
    }

    console.log('User Information:');
    console.log(`  Name: ${currentUser.name}`);
    console.log(`  Email: ${currentUser.email}`);
    console.log(`  Role: ${currentUser.role}`);
    console.log(`  User ID: ${currentUser.id}`);

    // Check sessions for this user
    const userSessions = await db.select().from(session).where(eq(session.userId, currentUser.id));
    
    console.log(`\nActive Sessions: ${userSessions.length}`);
    
    if (userSessions.length > 0) {
      console.log('\n⚠️  You have active sessions. To see the owner dashboard:');
      console.log('  1. Log out from the application');
      console.log('  2. Clear browser cookies/cache (Ctrl+Shift+Delete)');
      console.log('  3. Log back in with: risek290@gmail.com');
      console.log('  4. Your session will refresh with the "owner" role');
      
      console.log('\nOr you can delete old sessions:');
      console.log('  Run: npx tsx clear-sessions.ts');
    } else {
      console.log('\n✅ No active sessions. Just log in and you should have owner access.');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkUserSession();
