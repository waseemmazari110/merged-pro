import { db } from './src/db/index';
import { user } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function updateDanToAdmin() {
  try {
    // Find Dan's user record
    const users = await db.select().from(user).where(eq(user.name, 'Dan'));
    
    if (users.length === 0) {
      console.log('User "Dan" not found. Searching by email...');
      const allUsers = await db.select().from(user);
      console.log('All users:', allUsers.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })));
      return;
    }
    
    console.log('Found user:', users[0]);
    
    // Update role to admin
    await db.update(user)
      .set({ role: 'admin' })
      .where(eq(user.id, users[0].id));
    
    console.log('✅ Successfully updated Dan\'s role to admin!');
    
    // Verify the update
    const updatedUser = await db.select().from(user).where(eq(user.id, users[0].id));
    console.log('Updated user:', updatedUser[0]);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  process.exit(0);
}

updateDanToAdmin();
