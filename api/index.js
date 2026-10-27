require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("../server/src/db");
const casesRouter = require("../server/src/routes/cases");

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Lazy-connect DB for Serverless Function execution
let dbInit = false;
app.use(async (req, res, next) => {
  if (!dbInit) {
    try {
      await connectDB();
      dbInit = true;
    } catch (err) {
      console.warn("[Vercel Serverless DB] Using fallback mode:", err.message);
    }
  }
  next();
});

app.use("/api/cases", casesRouter);
app.use("/cases", casesRouter);

app.get(["/api/health", "/health"], (req, res) => {
  res.json({
    status: "ok",
    environment: "vercel-serverless",
    timestamp: new Date().toISOString(),
  });
});

module.exports = app;
