require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db");
const casesRouter = require("./routes/cases");

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Middleware
app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/cases", casesRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "AI Mystery Room Server",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("[Server Error]", err);
  res.status(500).json({ error: "Internal server error", details: err.message });
});

// Initialize DB and start server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`[AI Mystery Room Server] Running on http://localhost:${PORT}`);
    console.log(`[AI Mystery Room Server] Client Origin allowed: ${CLIENT_URL}`);
  });
}

startServer();

module.exports = app;
