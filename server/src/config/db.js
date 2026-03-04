const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Missing MONGODB_URI in server .env");
  }

  const dbName = process.env.MONGODB_DB || "healthmeet";

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { dbName });
};

module.exports = { connectDB };
