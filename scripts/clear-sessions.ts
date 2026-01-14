import 'dotenv/config';
import { db } from './src/db/index';
import { user, session } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function clearUserSessions() {
  try {
    console.log('Clearing all sessions for user...\n');

    const targetEmail = 'risek290@gmail.com';
    
    // Get the user
    const [currentUser] = await db.select().from(user).where(eq(user.email, targetEmail)).limit(1);
    
    if (!currentUser) {
      console.log(`❌ User not found`);
      return;
    }

    console.log(`User: ${currentUser.name} (${currentUser.email})`);
    console.log(`Current role in database: ${currentUser.role}`);

    // Delete all sessions for this user
    await db.delete(session).where(eq(session.userId, currentUser.id));
    
    console.log('\n✅ All sessions deleted');
    console.log('\nNext steps:');
    console.log('1. Go to your browser');
    console.log('2. Clear cookies for localhost (Ctrl+Shift+Delete)');
    console.log('3. Refresh the page');
    console.log('4. Log in again with: risek290@gmail.com');
    console.log('5. You should now have owner access!');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

clearUserSessions();
