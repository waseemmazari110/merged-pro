/**
 * Test script to verify owner property view and availability pages are working
 */

async function testAPI() {
  const propertyId = "1"; // Test with property ID 1
  
  console.log("=== Testing Owner Property Pages ===\n");
  
  // Test 1: Fetch single property
  console.log("1. Testing /api/properties?id=1");
  try {
    const res = await fetch(`http://localhost:3000/api/properties?id=${propertyId}`);
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Data keys:", Object.keys(data));
    if (data.title) console.log("Property:", data.title);
    if (data.error) console.log("Error:", data.error);
  } catch (err) {
    console.error("Failed:", (err as Error).message);
  }
  
  console.log("\n2. Testing /api/owner/properties/1/availability");
  try {
    // This requires authentication, so it might fail
    const res = await fetch(`http://localhost:3000/api/owner/properties/${propertyId}/availability`);
    const data = await res.json();
    console.log("Status:", res.status);
    if (res.ok) {
      console.log("Availability data:", {
        propertyId: data.propertyId,
        availabilityCount: data.availability?.length || 0,
        bookingsCount: data.bookings?.length || 0,
      });
    } else {
      console.log("Error:", data.error || data.message);
    }
  } catch (err) {
    console.error("Failed:", (err as Error).message);
  }
  
  console.log("\n3. Page route structure:");
  console.log("View page: /owner/properties/[id]/view");
  console.log("Availability: /owner/properties/[id]/availability");
}

testAPI().catch(console.error);
