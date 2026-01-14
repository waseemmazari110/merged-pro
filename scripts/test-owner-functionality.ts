/**
 * Test script to verify owner property view and availability functionality
 * Run this with: npx tsx test-owner-functionality.ts
 */

import { db } from "./src/db";
import { properties, availabilityCalendar } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function testOwnerFunctionality() {
  console.log("=== Testing Owner Property View & Availability ===\n");
  
  try {
    // Get first property owned by an owner
    const allProperties = await db.select().from(properties).limit(1);
    
    if (allProperties.length === 0) {
      console.log("❌ No properties found in database");
      return;
    }
    
    const property = allProperties[0];
    console.log("✓ Found property:");
    console.log(`  ID: ${property.id}`);
    console.log(`  Title: ${property.title}`);
    console.log(`  Owner ID: ${property.ownerId}`);
    console.log(`  Status: ${property.status}`);
    
    // Test availability table
    console.log("\n--- Testing Availability Table ---");
    const availability = await db
      .select()
      .from(availabilityCalendar)
      .where(eq(availabilityCalendar.propertyId, property.id))
      .limit(5);
    
    console.log(`✓ Availability records found: ${availability.length}`);
    if (availability.length > 0) {
      console.log("  Sample record:");
      const rec = availability[0];
      console.log(`    Date: ${rec.date}`);
      console.log(`    Status: ${rec.status}`);
      console.log(`    Available: ${rec.isAvailable}`);
    } else {
      console.log("  (No availability records - this is normal for new properties)");
    }
    
    // Test API endpoints
    console.log("\n--- API Endpoint Test ---");
    console.log(`View page URL: http://localhost:3000/owner/properties/${property.id}/view`);
    console.log(`Availability page URL: http://localhost:3000/owner/properties/${property.id}/availability`);
    console.log(`API endpoint: /api/owner/properties/${property.id}/availability`);
    
    console.log("\n✓ Test complete! Navigate to the URLs above to test the functionality.");
    
  } catch (error) {
    console.error("❌ Error:", (error as Error).message);
  }
  
  process.exit(0);
}

testOwnerFunctionality().catch(console.error);
