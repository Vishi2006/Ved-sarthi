const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI in server .env");
  }

  const dbName = process.env.MONGODB_DB || "healthmeet";

  console.log("🔗 Connecting to MongoDB...");
  mongoose.set("strictQuery", true);
  try {
    await mongoose.connect(uri, { dbName });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = { connectDB };
