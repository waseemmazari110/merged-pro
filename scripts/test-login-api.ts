import fetch from "node-fetch";

const BASE_URL = "http://localhost:3000/api/auth";

async function testLogin() {
  try {
    console.log("🧪 Testing admin login via API...\n");

    const response = await fetch(`${BASE_URL}/sign-in/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "cswaseem110@gmail.com",
        password: "Admin123",
      }),
    });

    console.log("Status:", response.status);
    const data = await response.json();
    
    if (response.status === 200) {
      console.log("✅ Login successful!");
      console.log("Response:", JSON.stringify(data, null, 2).substring(0, 200) + "...");
    } else {
      console.log("❌ Login failed!");
      console.log("Response:", JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testLogin();
