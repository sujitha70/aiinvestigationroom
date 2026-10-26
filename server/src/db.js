const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const dns = require("dns");

// Ensure reliable SRV lookup for mongodb+srv:// on all network configurations
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore if not supported in environment
}

let isMongoConnected = false;
const memoryStore = new Map();

// File persistence backup path for zero-setup local dev
const fallbackFilePath = path.join(__dirname, "../.data_cases.json");

function loadFallbackData() {
  try {
    if (fs.existsSync(fallbackFilePath)) {
      const data = JSON.parse(fs.readFileSync(fallbackFilePath, "utf8"));
      Object.entries(data).forEach(([k, v]) => memoryStore.set(k, v));
    }
  } catch (err) {
    console.error("Failed to load local fallback data", err);
  }
}

function saveFallbackData() {
  try {
    const obj = {};
    memoryStore.forEach((v, k) => {
      obj[k] = v;
    });
    fs.writeFileSync(fallbackFilePath, JSON.stringify(obj, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to save local fallback data", err);
  }
}

loadFallbackData();

async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes("your_mongodb")) {
    console.warn(
      "[MongoDB] MONGODB_URI not set or using placeholder. Running in resilient local file/memory mode."
    );
    return false;
  }

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    isMongoConnected = true;
    console.log("[MongoDB] Connected successfully to database.");
    return true;
  } catch (err) {
    console.warn(
      `[MongoDB] Connection failed (${err.message}). Using local persistent memory fallback.`
    );
    isMongoConnected = false;
    return false;
  }
}

// Unified repository methods that work seamlessly whether Mongo is online or in fallback mode
const CaseModel = require("./models/Case");

const CaseRepository = {
  async createCase(caseData) {
    if (isMongoConnected) {
      const doc = new CaseModel(caseData);
      return await doc.save();
    } else {
      const id = "case_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);
      const newCase = {
        _id: id,
        id,
        ...caseData,
        createdAt: new Date(),
      };
      memoryStore.set(id, newCase);
      saveFallbackData();
      return newCase;
    }
  },

  async findCaseById(id) {
    if (isMongoConnected) {
      return await CaseModel.findById(id);
    } else {
      return memoryStore.get(id) || null;
    }
  },

  async updateCase(id, updateData) {
    if (isMongoConnected) {
      return await CaseModel.findByIdAndUpdate(id, updateData, { new: true });
    } else {
      const current = memoryStore.get(id);
      if (!current) return null;
      const updated = { ...current, ...updateData };
      memoryStore.set(id, updated);
      saveFallbackData();
      return updated;
    }
  },
};

module.exports = {
  connectDB,
  CaseRepository,
  isMongoConnected: () => isMongoConnected,
};
