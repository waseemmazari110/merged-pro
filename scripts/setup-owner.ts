import 'dotenv/config';
import { db } from './src/db/index';
import { user, properties } from './src/db/schema';
import { eq, inArray, sql } from 'drizzle-orm';

async function setupOwnerData() {
  try {
    console.log('Setting up owner test data...\n');

    // 1. Get all users
    console.log(`1. Looking for users in database...`);
    
    const allUsers = await db.select().from(user).limit(10);
    
    if (allUsers.length === 0) {
      console.log(`   ❌ No users found in database. Please register a user first through the app.`);
      return;
    }

    console.log(`   Found ${allUsers.length} users:`);
    allUsers.forEach((u, index) => {
      console.log(`   ${index + 1}. ${u.name} (${u.email}) - Role: ${u.role}`);
    });

    // Use the first user or find one with a specific email
    const ownerEmail = 'owner@example.com';
    let ownerUser = allUsers.find(u => u.email === ownerEmail);
    
    if (!ownerUser) {
      // Use the first user
      ownerUser = allUsers[0];
      console.log(`\n   Using first user: ${ownerUser.name} (${ownerUser.email})`);
    } else {
      console.log(`\n   Found target user: ${ownerUser.name} (${ownerUser.email})`);
    }

    // 2. Update user role to owner
    if (ownerUser.role !== 'owner') {
      console.log(`\n2. Updating user role from '${ownerUser.role}' to 'owner'...`);
      await db.update(user)
        .set({ role: 'owner' })
        .where(eq(user.id, ownerUser.id));
      console.log('   ✓ User role updated to owner');
    } else {
      console.log(`\n2. User already has 'owner' role ✓`);
    }

    // 3. Get first 3 properties
    console.log(`\n3. Finding properties to assign...`);
    const allProperties = await db.select().from(properties).limit(10);
    
    if (allProperties.length === 0) {
      console.log('   ❌ No properties found in database');
      return;
    }

    const propertiesToAssign = allProperties.slice(0, Math.min(3, allProperties.length));
    const propertyIds = propertiesToAssign.map(p => p.id);
    
    console.log(`   Found ${allProperties.length} properties, assigning first ${propertiesToAssign.length}:`);
    propertiesToAssign.forEach(p => {
      console.log(`   - ID ${p.id}: ${p.title}`);
    });

    // 4. Assign properties to owner
    console.log(`\n4. Assigning properties to owner...`);
    await db.update(properties)
      .set({ ownerId: ownerUser.id })
      .where(inArray(properties.id, propertyIds));
    
    console.log(`   ✓ Assigned ${propertiesToAssign.length} properties to ${ownerUser.name}`);

    // 5. Verify the assignment
    console.log(`\n5. Verifying assignment...`);
    const assignedProperties = await db.select()
      .from(properties)
      .where(eq(properties.ownerId, ownerUser.id));
    
    console.log(`   ✓ Owner now has ${assignedProperties.length} properties:`);
    assignedProperties.forEach(p => {
      console.log(`   - ${p.title} (${p.location})`);
    });

    console.log('\n✅ Setup complete!');
    console.log(`\nYou can now login with:`);
    console.log(`   Email: ${ownerEmail}`);
    console.log(`   Then navigate to: /owner/dashboard`);

  } catch (error) {
    console.error('Error setting up owner data:', error);
  } finally {
    process.exit(0);
  }
}

setupOwnerData();
