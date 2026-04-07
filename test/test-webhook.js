/**
 * Render Live Webhook Tester
 * Run: node test/test-webhook.js
 *
 * Server must be running on Render (https://realestate-webhook.onrender.com)
 */

const https = require("https");

const BASE_URL = "https://realestate-webhook.onrender.com";
const SENDER = "919876543210"; // dummy phone number

// ---------------------------------------------------------------------------
// Helper: send a POST to /webhook
// ---------------------------------------------------------------------------
function sendMessage(message) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ message, sender: SENDER });

    const options = {
      hostname: "realestate-webhook.onrender.com",
      port: 443,
      path: "/webhook",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve({ raw: data });
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ---------------------------------------------------------------------------
// Test cases
// ---------------------------------------------------------------------------
const TEST_CASES = [
  { label: "1. Greeting (Hi)",         message: "Hi" },
  { label: "2. Option 1 - Projects",   message: "1" },
  { label: "3. Option 2 - Brochure",   message: "2" },
  { label: "4. Option 3 - Site Visit", message: "3" },
  { label: "5. VISIT keyword",         message: "VISIT" },
  { label: "6. Option 4 - Expert",     message: "4" },
  { label: "7. Session: Enter Name",   message: "Rahul Sharma" },
  { label: "8. Session: Enter Phone",  message: "9876543210" },  // ← triggers saveLead
  { label: "9. Unknown input (AI fallback)", message: "What is the price of 2BHK?" },
  { label: "10. Menu keyword",         message: "menu" },
];

// ---------------------------------------------------------------------------
// Run all tests sequentially
// ---------------------------------------------------------------------------
async function runTests() {
  console.log("🚀 Starting Render Webhook Tests...\n");
  console.log("=".repeat(60));

  for (const test of TEST_CASES) {
    try {
      const response = await sendMessage(test.message);
      const replyText = response?.replies?.[0]?.message || JSON.stringify(response);

      console.log(`\n✅ ${test.label}`);
      console.log(`   Sent    : "${test.message}"`);
      console.log(`   Reply   : "${replyText.substring(0, 80)}${replyText.length > 80 ? "..." : ""}"`);
    } catch (err) {
      console.log(`\n❌ ${test.label} — FAILED`);
      console.log(`   Error: ${err.message}`);
    }

    // Small delay between requests
    await new Promise((r) => setTimeout(r, 300));
  }

  console.log("\n" + "=".repeat(60));
  console.log("✅ All tests completed!\n");
}

runTests();