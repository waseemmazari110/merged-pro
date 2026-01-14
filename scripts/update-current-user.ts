import 'dotenv/config';
import { db } from './src/db/index';
import { user, properties } from './src/db/schema';
import { eq, inArray } from 'drizzle-orm';

async function updateCurrentUser() {
  try {
    console.log('Updating current user to owner role...\n');

    const targetEmail = 'risek290@gmail.com';
    
    // Get the user
    const [currentUser] = await db.select().from(user).where(eq(user.email, targetEmail)).limit(1);
    
    if (!currentUser) {
      console.log(`❌ User not found with email: ${targetEmail}`);
      return;
    }

    console.log(`Found user: ${currentUser.name} (${currentUser.email})`);
    console.log(`Current role: ${currentUser.role}`);

    // Update to owner
    await db.update(user)
      .set({ role: 'owner' })
      .where(eq(user.id, currentUser.id));
    
    console.log(`✅ Updated role to: owner`);

    // Assign properties
    const allProperties = await db.select().from(properties).limit(3);
    
    if (allProperties.length > 0) {
      const propertyIds = allProperties.map(p => p.id);
      
      await db.update(properties)
        .set({ ownerId: currentUser.id })
        .where(inArray(properties.id, propertyIds));
      
      console.log(`✅ Assigned ${allProperties.length} properties to user`);
      allProperties.forEach(p => {
        console.log(`   - ${p.title}`);
      });
    }

    console.log('\n✅ Done! Please refresh your browser and try again.');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

updateCurrentUser();
