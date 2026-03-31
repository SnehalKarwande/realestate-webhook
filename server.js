require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Connect the webhook controller
app.use("/webhook", require("./controllers/webhookController"));

// Debug endpoint
app.post("/debug", (req, res) => {
  console.log("🔍 DEBUG BODY:", JSON.stringify(req.body, null, 2));
  console.log("🔍 DEBUG HEADERS:", JSON.stringify(req.headers, null, 2));
  res.json({ received: req.body });
});

// Health check
app.get("/", (req, res) =>
  res.json({
    status: "Shubhstra Properties Bot v2.0 🚀 Running!",
    timestamp: new Date().toISOString(),
  })
);

// Global error handler
app.use((err, req, res, next) => {
  console.error("💥 Unhandled Error:", err.message);
  res.status(500).json({ replies: [{ message: "Something went wrong. Please try again." }] });
});

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);