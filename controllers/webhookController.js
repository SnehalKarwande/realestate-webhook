const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("📥 Incoming:", JSON.stringify(req.body, null, 2));

    const message =
      req.body?.query?.message ||
      req.body?.message ||
      "";

    const cleanMessage = message.toString().trim().toLowerCase();

    console.log("💬 User message:", cleanMessage);

    let reply = `*Automatic reply*

Hello! 👋
Welcome to *Shubhstra Properties* 🏢✨

We specialize in premium homes in Wakad & Hinjewadi.
Let me help you find the perfect property 😊

Please choose an option:

1️⃣ Explore 2BHK & 3BHK Projects 🏡
2️⃣ Download Project Brochure 📄
3️⃣ Book a Free Site Visit 🚗
4️⃣ Talk to Property Expert 📞`;

    // Option 1
    if (cleanMessage === "1") {
      reply = `*Automatic reply*

Great choice! 😍

We have handpicked premium 2BHK & 3BHK homes in *Wakad & Hinjewadi* — perfect for both living & investment 🏙️

💰 2BHK starting from ₹65 Lakhs
💰 3BHK starting from ₹95 Lakhs

✨ Near IT Hubs
✨ Modern Amenities & Clubhouse
✨ Excellent Rental & Resale Value

🚗 *Limited slots available for site visits today!*`;
    }

    // Option 2
    if (cleanMessage === "2") {
      reply = `*Automatic reply*

Here’s your project brochure 📄✨

https://drive.google.com/file/d/1aCKEUnkp8vZhZsGfH2ypJB0YW6q-0TqY/view?usp=drivesdk

It includes a quick overview of pricing, layout & key highlights 🏢

Take a look and let me know your thoughts 😊

🚗 Want to visit the site and see it in real?
Type *VISIT* to book your FREE site visit with pickup & drop`;
    }

    // Option 3
    if (cleanMessage === "3" || cleanMessage === "visit") {
      reply = `*Automatic reply*

Excellent choice! 🚗✨

We’d love to show you the project in person — it’s even better than the photos 😊

🎁 *We offer FREE pickup & drop for your site visit*
🏢 Experience the actual flat, amenities & location firsthand

⚡ *Limited slots available for today & tomorrow*

📅 Please share your *preferred date & time*

https://calendly.com/services-shubhstra/free-site-visit-shubhstra-properties

Our senior property expert will call you within 5 minutes to confirm your visit 🤝`;
    }

    // Option 4
    if (cleanMessage === "4") {
      reply = `*Automatic reply*

You’re in good hands! 😊🏢

Our property specialist will guide you with the best options based on your budget and requirements ✨

💼 Get insights on:
• Best deals & current offers
• Investment potential & ROI
• Availability in top projects

📞 Just share your *name* and *phone number*

Our expert will connect with you shortly for a personalized consultation 🤝`;
    }

    res.json({
      replies: [
        {
          message: reply,
        },
      ],
    });

  } catch (error) {
    console.log("❌ Error:", error.message);

    res.json({
      replies: [
        {
          message: "Server error. Please try again.",
        },
      ],
    });
  }
});

module.exports = router;