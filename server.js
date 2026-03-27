require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use("/webhook", require("./controllers/webhookController"));

// Health check — UptimeRobot he ping karto to keep Render awake
app.get("/", (req, res) =>
  res.json({
    status: "Shubhstra Properties Bot v2.0 🚀 Running!",
    timestamp: new Date().toISOString(),
  })
);

// ---------------------------------------------------------------------------
// Global error handler
// ---------------------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error("💥 Unhandled Error:", err.message);
  res.status(500).json({ replies: [{ message: "Something went wrong. Please try again." }] });
});

app.listen(PORT, () =>
  console.log(`✅ Server running on http://localhost:${PORT}`)
);
