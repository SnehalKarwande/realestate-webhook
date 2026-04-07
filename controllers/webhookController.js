const express = require("express");
const router = express.Router();
const { addLeadToSheet } = require("../services/googleSheets");

router.post("/", async (req, res) => {
  try {
    console.log("📩 Incoming:", JSON.stringify(req.body, null, 2));

    const message = (req.body.query?.message || "").toLowerCase().trim();
    const phone = req.body.query?.sender || "Unknown";
    const projectName = "Shubhstra Properties";

    let reply = "";

    if (message === "hi" || message === "hello" || message === "start") {
      reply = `*Automatic reply*\nHello! 👋
Welcome to *Shubhstra Properties* 🏢✨

We specialize in premium homes in Wakad & Hinjewadi.
Let me help you find the perfect property 😊

Please choose an option:

1️⃣ Explore 2BHK & 3BHK Projects 🏡
2️⃣ Download Project Brochure 📄
3️⃣ Book a Free Site Visit 🚗
4️⃣ Talk to Property Expert 📞`;

      await addLeadToSheet({ name: projectName, phone, message: "Welcome Inquiry" });

    } else if (message === "1") {
      reply = `*Automatic reply*\nGreat choice! 😍

We have handpicked premium 2BHK & 3BHK homes in *Wakad & Hinjewadi* — perfect for both living & investment 🏙️

💰 2BHK starting from ₹65 Lakhs
💰 3BHK starting from ₹95 Lakhs

✨ Near IT Hubs
✨ Modern Amenities & Clubhouse
✨ Excellent Rental & Resale Value

🚗 *Limited slots available for site visits today!*`;

      await addLeadToSheet({ name: projectName, phone, message: "2BHK/3BHK Interest" });

    } else if (message === "2") {
      reply = `*Automatic reply*\nHere’s your project brochure 📄✨

https://drive.google.com/file/d/1aCKEUnkp8vZhZsGfH2ypJB0YW6q-0TqY/view?usp=drivesdk

It includes a quick overview of pricing, layout & key highlights 🏢

Take a look and let me know your thoughts 😊

🚗 Want to visit the site and see it in real?
Type *VISIT* to book your FREE site visit with pickup & drop`;

      await addLeadToSheet({ name: projectName, phone, message: "Brochure Request" });

    } else if (message === "3" || message === "visit") {
      reply = `*Automatic reply*\nExcellent choice! 🚗✨

We’d love to show you the project in person — it’s even better than the photos 😊

🎁 *We offer FREE pickup & drop for your site visit*
🏢 Experience the actual flat, amenities & location firsthand

⚡ *Limited slots available for today & tomorrow*

📅 Please share your *preferred date & time*

https://calendly.com/services-shubhstra/free-site-visit-shubhstra-properties

Our senior property expert will call you within 5 minutes to confirm your visit 🤝`;

      await addLeadToSheet({ name: projectName, phone, message: "Site Visit Booking" });

    } else if (message === "4") {
      reply = `*Automatic reply*\nYou’re in good hands! 😊🏢

Our property specialist will guide you with the best options based on your budget and requirements ✨

💼 Get insights on:
• Best deals & current offers
• Investment potential & ROI
• Availability in top projects

📞 Just share your *name* and *phone number*

Our expert will connect with you shortly for a personalized consultation 🤝`;

      await addLeadToSheet({ name: projectName, phone, message: "Talk to Expert" });

    } else {
      reply = `Choose an option: 1️⃣ 2BHK & 3BHK 2️⃣ Brochure 3️⃣ Site Visit 4️⃣ Expert`;
    }

    res.status(200).json({ replies: [{ message: reply }] });

  } catch (error) {
    console.error("💥 Webhook Error:", error.message);
    res.status(500).json({ replies: [{ message: "Something went wrong" }] });
  }
});

router.get("/", (req, res) => res.send("Webhook working ✅"));

module.exports = router;