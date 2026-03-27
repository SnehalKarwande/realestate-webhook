const express = require("express");
const router = express.Router();
const { saveLead } = require("../services/supabaseService");

// ---------------------------------------------------------------------------
// Helper: AutoResponder app expects exactly this format
// {"replies": [{"message": "..."}]}
// ---------------------------------------------------------------------------
function reply(res, message) {
  return res.json({ replies: [{ message }] });
}

// ---------------------------------------------------------------------------
// In-memory session store
// Key: phone number | Value: { step: "awaiting_name" | "awaiting_phone" }
// ---------------------------------------------------------------------------
const sessions = new Map();

// ---------------------------------------------------------------------------
// Static reply messages
// ---------------------------------------------------------------------------
const MESSAGES = {
  welcome: `Hello! 👋 Welcome to *Shubhstra Properties* 🏢✨

We specialize in premium homes in Wakad & Hinjewadi. Let me help you find the perfect property 😊

Please choose an option:
1️⃣ Explore 2BHK & 3BHK Projects 🏡
2️⃣ Download Project Brochure 📄
3️⃣ Book a Free Site Visit 🚗
4️⃣ Talk to Property Expert 📞`,

  option1: `🏡 *Our Premium Projects in Wakad & Hinjewadi:*

✅ Shubhstra Greens – 2BHK starting ₹65L
✅ Shubhstra Heights – 3BHK starting ₹95L
✅ Shubhstra Elite – 2 & 3BHK with Club House

📍 Prime locations with metro connectivity
🏊 World-class amenities: Pool, Gym, Garden

Type *2* to download the brochure 📄
Type *3* to book a FREE site visit 🚗`,

  option2: `Here's your project brochure 📄✨
👉 https://drive.google.com/file/d/DUMMY_LINK

It includes a quick overview of pricing, layout & key highlights 🏢
Take a look and let me know your thoughts 😊

🚗 Want to visit the site and see it in real?
Type *VISIT* or *3* to book your FREE site visit with pickup & drop`,

  option3: `Excellent choice! 🚗✨
We'd love to show you the project in person — it's even better than the photos 😊

🎁 We offer *FREE pickup & drop* for your site visit
🏢 Experience the actual flat, amenities & location firsthand
⚡ Limited slots available for today & tomorrow

🗓️ Please share your preferred date & time here:
👉 https://calendly.com/shubhstra/site-visit

Our senior property expert will call you within *5 minutes* to confirm your visit 🤝`,

  option4_ask_name: `You're in good hands! 😊🏢
Our property specialist will guide you with the best options based on your budget and requirements ✨

💼 Get insights on:
• Best deals & current offers
• Investment potential & ROI
• Availability in top projects

📝 Please share your *full name* first:`,

  option4_ask_phone: (name) =>
    `Thanks, *${name}*! 🙏\nNow please share your *phone number* so our expert can reach you 📞`,

  option4_done: (name) =>
    `Perfect! ✅\nThank you, *${name}*! Our property expert will connect with you shortly for a personalized consultation 🤝\n\nType *Hi* anytime to return to the main menu.`,

  fallback: `Hmm, I didn't quite get that 🤔

Please choose a valid option:
1️⃣ Explore Projects 🏡
2️⃣ Download Brochure 📄
3️⃣ Book Site Visit 🚗
4️⃣ Talk to Expert 📞

Or type *Hi* to restart.`,
};

// ---------------------------------------------------------------------------
// POST /webhook  ← AutoResponder app hits this endpoint
// ---------------------------------------------------------------------------
router.post("/", async (req, res) => {
  try {
    // AutoResponder sends the message in req.body
    // Common fields: { message, sender, ... } — adjust key if your app differs
    const incomingText = (
      req.body.message ||
      req.body.text ||
      req.body.body ||
      ""
    ).trim();

    const phone = req.body.sender || req.body.from || "unknown";

    console.log(`📩 [${phone}]: ${incomingText}`);

    if (!incomingText) {
      return reply(res, MESSAGES.fallback);
    }

    const text = incomingText.toLowerCase();
    const session = sessions.get(phone);

    // -----------------------------------------------------------------------
    // Session: waiting for name (step 1 of option 4)
    // -----------------------------------------------------------------------
    if (session?.step === "awaiting_name") {
      const name = incomingText; // whatever they typed is their name
      sessions.set(phone, { step: "awaiting_phone", name });
      return reply(res, MESSAGES.option4_ask_phone(name));
    }

    // -----------------------------------------------------------------------
    // Session: waiting for phone number (step 2 of option 4)
    // -----------------------------------------------------------------------
    if (session?.step === "awaiting_phone") {
      const { name } = session;
      const providedPhone = incomingText;

      // Save lead BEFORE clearing session so we retain context on failure
      await saveLeadSafe(name, providedPhone);

      sessions.delete(phone); // clear session only after save attempt

      return reply(res, MESSAGES.option4_done(name));
    }

    // -----------------------------------------------------------------------
    // Main menu routing
    // -----------------------------------------------------------------------
    if (["hi", "hello", "hey", "menu", "start"].includes(text)) {
      return reply(res, MESSAGES.welcome);
    }

    if (text === "1") {
      return reply(res, MESSAGES.option1);
    }

    if (text === "2") {
      return reply(res, MESSAGES.option2);
    }

    if (text === "3" || text === "visit") {
      return reply(res, MESSAGES.option3);
    }

    if (text === "4") {
      sessions.set(phone, { step: "awaiting_name" });
      return reply(res, MESSAGES.option4_ask_name);
    }

    // -----------------------------------------------------------------------
    // Default fallback
    // -----------------------------------------------------------------------
    return reply(res, MESSAGES.fallback);
  } catch (err) {
    console.error("❌ Webhook error:", err.message);
    return reply(res, "Something went wrong. Please try again.");
  }
});

// ---------------------------------------------------------------------------
// Save lead to Supabase — errors are logged but never crash the response
// ---------------------------------------------------------------------------
async function saveLeadSafe(name, phoneNumber) {
  try {
    const lead = await saveLead(name, phoneNumber);
    console.log(`✅ Lead saved → name: ${lead.name} | phone: ${lead.phone_number}`);
  } catch (err) {
    console.error("⚠️  Lead save failed (non-critical):", err.message);
  }
}

module.exports = router;
