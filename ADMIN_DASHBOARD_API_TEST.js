/**
 * API Endpoints Testing Guide
 * 
 * Use this to test if the admin dashboard APIs are working
 */

// Test 1: Get Stats
async function testStats() {
  console.log("🧪 Testing /api/admin/dashboard-stats...");
  try {
    const res = await fetch("/api/admin/dashboard-stats", {
      credentials: "include"
    });
    const data = await res.json();
    console.log("✅ Stats:", data);
    return data;
  } catch (err) {
    console.error("❌ Stats Error:", err);
    return null;
  }
}

// Test 2: Get Users
async function testUsers() {
  console.log("🧪 Testing /api/admin/dashboard-users...");
  try {
    const res = await fetch("/api/admin/dashboard-users", {
      credentials: "include"
    });
    const data = await res.json();
    console.log("✅ Users:", data);
    return data;
  } catch (err) {
    console.error("❌ Users Error:", err);
    return null;
  }
}

// Test 3: Get Properties
async function testProperties() {
  console.log("🧪 Testing /api/admin/dashboard-properties...");
  try {
    const res = await fetch("/api/admin/dashboard-properties?status=pending", {
      credentials: "include"
    });
    const data = await res.json();
    console.log("✅ Properties:", data);
    return data;
  } catch (err) {
    console.error("❌ Properties Error:", err);
    return null;
  }
}

// Test 4: Get Payments
async function testPayments() {
  console.log("🧪 Testing /api/admin/dashboard-payments...");
  try {
    const res = await fetch("/api/admin/dashboard-payments", {
      credentials: "include"
    });
    const data = await res.json();
    console.log("✅ Payments:", data);
    return data;
  } catch (err) {
    console.error("❌ Payments Error:", err);
    return null;
  }
}

// Test 5: Get Subscriptions
async function testSubscriptions() {
  console.log("🧪 Testing /api/admin/dashboard-subscriptions...");
  try {
    const res = await fetch("/api/admin/dashboard-subscriptions", {
      credentials: "include"
    });
    const data = await res.json();
    console.log("✅ Subscriptions:", data);
    return data;
  } catch (err) {
    console.error("❌ Subscriptions Error:", err);
    return null;
  }
}

// Run all tests
async function runAllTests() {
  console.log("\n📊 Running Admin Dashboard API Tests\n");
  console.log("Make sure you're logged in as admin first!\n");
  
  await testStats();
  console.log("\n---\n");
  
  await testUsers();
  console.log("\n---\n");
  
  await testProperties();
  console.log("\n---\n");
  
  await testPayments();
  console.log("\n---\n");
  
  await testSubscriptions();
  console.log("\n---\n");
  
  console.log("✅ All tests completed!\n");
}

// Run tests - paste this in browser console on /admin/dashboard
runAllTests();
