require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// ✅ ADD THIS
app.get("/webhook", (req, res) => {
  res.send("Webhook is live 🚀");
});

// Existing webhook
app.use("/webhook", require("./controllers/webhookController"));

app.get("/", (req, res) => 
  res.json({ status: "Shubhstra Properties Bot 🚀 Running!", timestamp: new Date().toISOString() })
);

app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));